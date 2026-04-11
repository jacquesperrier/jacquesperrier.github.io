from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import bcrypt
import jwt
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime, timezone, timedelta
from bson import ObjectId

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def hash_pin(pin: str) -> str:
    return bcrypt.hashpw(pin.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_pin(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))


def create_token(user_id: str, name: str) -> str:
    return jwt.encode(
        {"sub": user_id, "name": name, "exp": datetime.now(timezone.utc) + timedelta(hours=24), "type": "access"},
        JWT_SECRET, algorithm=JWT_ALGORITHM
    )


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifie")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token invalide")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="Utilisateur non trouve")
        user["_id"] = str(user["_id"])
        user.pop("pin_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expire")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")


class LoginRequest(BaseModel):
    name: str
    pin: str


class EntryCreate(BaseModel):
    type: str
    data: dict = {}
    desc: str = ""
    status: str = "ok"


class HaccpStateUpdate(BaseModel):
    state: dict


class SettingsUpdate(BaseModel):
    sheets_enabled: bool = False
    sheets_url: str = ""
    etablissement: str = ""
    permis: str = ""


@api_router.post("/auth/login")
async def login(req: LoginRequest, response: Response):
    user = await db.users.find_one({"name": req.name})
    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur non trouve")
    if not verify_pin(req.pin, user["pin_hash"]):
        raise HTTPException(status_code=401, detail="NIP incorrect")
    token = create_token(str(user["_id"]), user["name"])
    response.set_cookie(
        key="access_token", value=token, httponly=True,
        secure=False, samesite="lax", max_age=86400, path="/"
    )
    return {"id": str(user["_id"]), "name": user["name"], "role": user.get("role", "employe"), "token": token}


@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return {"id": user["_id"], "name": user["name"], "role": user.get("role", "employe")}


@api_router.post("/auth/logout")
async def do_logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Deconnecte"}


@api_router.post("/entries")
async def create_entry(entry: EntryCreate, request: Request):
    user = await get_current_user(request)
    now = datetime.now(timezone.utc)
    doc = {
        "id": str(uuid.uuid4()),
        "type": entry.type,
        "employe": user["name"],
        "date": now.isoformat(),
        "heure": now.strftime("%H:%M"),
        "data": entry.data,
        "desc": entry.desc,
        "status": entry.status,
        "user_id": user["_id"]
    }
    await db.entries.insert_one(doc)
    doc.pop("_id", None)
    doc.pop("user_id", None)
    return doc


@api_router.get("/entries")
async def list_entries(request: Request, type: Optional[str] = None, today_only: bool = False):
    await get_current_user(request)
    query = {}
    if type and type != "tous":
        query["type"] = type
    if today_only:
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        query["date"] = {"$gte": today_start.isoformat()}
    entries = await db.entries.find(query, {"_id": 0, "user_id": 0}).sort("date", -1).to_list(500)
    return entries


@api_router.get("/stats/today")
async def today_stats(request: Request):
    await get_current_user(request)
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    pipeline = [
        {"$match": {"date": {"$gte": today_start.isoformat()}}},
        {"$group": {"_id": "$type", "count": {"$sum": 1}}}
    ]
    results = await db.entries.aggregate(pipeline).to_list(10)
    stats = {r["_id"]: r["count"] for r in results}
    return {
        "nettoyage": stats.get("nettoyage", 0),
        "temperature": stats.get("temperature", 0),
        "reception": stats.get("reception", 0),
        "heures": stats.get("heures", 0)
    }


@api_router.delete("/entries/clear")
async def clear_entries(request: Request):
    await get_current_user(request)
    await db.entries.delete_many({})
    return {"message": "Donnees effacees"}


@api_router.get("/haccp-state")
async def get_haccp_state(request: Request):
    user = await get_current_user(request)
    state = await db.haccp_states.find_one({"user_id": user["_id"]}, {"_id": 0, "user_id": 0})
    return state or {"state": {}}


@api_router.put("/haccp-state")
async def update_haccp_state(update: HaccpStateUpdate, request: Request):
    user = await get_current_user(request)
    await db.haccp_states.update_one(
        {"user_id": user["_id"]},
        {"$set": {"state": update.state, "user_id": user["_id"]}},
        upsert=True
    )
    return {"message": "ok"}


@api_router.get("/modules/progress")
async def get_module_progress(request: Request):
    user = await get_current_user(request)
    progress = await db.module_progress.find_one({"user_id": user["_id"]}, {"_id": 0, "user_id": 0})
    return progress or {"completed": {}}


@api_router.put("/modules/{module_id}/complete")
async def complete_module(module_id: int, request: Request):
    user = await get_current_user(request)
    await db.module_progress.update_one(
        {"user_id": user["_id"]},
        {"$set": {f"completed.{module_id}": True, "user_id": user["_id"]}},
        upsert=True
    )
    return {"message": "ok"}


@api_router.get("/settings")
async def get_settings(request: Request):
    user = await get_current_user(request)
    settings = await db.settings.find_one({"user_id": user["_id"]}, {"_id": 0, "user_id": 0})
    return settings or {"sheets_enabled": False, "sheets_url": "", "etablissement": "", "permis": ""}


@api_router.put("/settings")
async def update_settings(update: SettingsUpdate, request: Request):
    user = await get_current_user(request)
    await db.settings.update_one(
        {"user_id": user["_id"]},
        {"$set": {**update.model_dump(), "user_id": user["_id"]}},
        upsert=True
    )
    return {"message": "ok"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await db.users.create_index("name", unique=True)
    await db.entries.create_index([("date", -1)])
    await db.entries.create_index("type")

    admin_name = os.environ.get("ADMIN_NAME", "Jacques Perrier")
    admin_pin = os.environ.get("ADMIN_PIN", "1234")

    existing = await db.users.find_one({"name": admin_name})
    if not existing:
        await db.users.insert_one({
            "name": admin_name,
            "pin_hash": hash_pin(admin_pin),
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logger.info(f"Default user created: {admin_name}")
    elif not verify_pin(admin_pin, existing["pin_hash"]):
        await db.users.update_one(
            {"name": admin_name},
            {"$set": {"pin_hash": hash_pin(admin_pin)}}
        )

    Path("/app/memory").mkdir(exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write("# Test Credentials\n\n")
        f.write("## Default User\n")
        f.write(f"- Name: {admin_name}\n")
        f.write(f"- PIN: {admin_pin}\n")
        f.write("- Role: admin\n\n")
        f.write("## Auth Endpoints\n")
        f.write("- POST /api/auth/login {name, pin}\n")
        f.write("- GET /api/auth/me\n")
        f.write("- POST /api/auth/logout\n")


@app.on_event("shutdown")
async def shutdown():
    client.close()
