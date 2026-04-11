import { useState, useEffect, useCallback } from 'react';
import '@/App.css';
import * as api from '@/api';
import LoginScreen from '@/components/LoginScreen';
import Dashboard from '@/components/Dashboard';
import NettoyageForm from '@/components/NettoyageForm';
import TemperatureForm from '@/components/TemperatureForm';
import ReceptionForm from '@/components/ReceptionForm';
import HeuresForm from '@/components/HeuresForm';
import HaccpScreen from '@/components/HaccpScreen';
import FormationList from '@/components/FormationList';
import ModuleViewer from '@/components/ModuleViewer';
import HistoryScreen from '@/components/HistoryScreen';
import SettingsScreen from '@/components/SettingsScreen';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('login');
  const [toast, setToast] = useState(null);
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState({ nettoyage: 0, temperature: 0, reception: 0, heures: 0 });
  const [haccpState, setHaccpState] = useState({});
  const [moduleProgress, setModuleProgress] = useState({});
  const [currentModule, setCurrentModule] = useState(0);

  const showToast = useCallback((msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [entriesRes, statsRes, haccpRes, moduleRes] = await Promise.all([
        api.getEntries({ today_only: true }),
        api.getTodayStats(),
        api.getHaccpState(),
        api.getModuleProgress()
      ]);
      setEntries(entriesRes.data);
      setStats(statsRes.data);
      setHaccpState(haccpRes.data.state || {});
      setModuleProgress(moduleRes.data.completed || {});
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('verdict_token');
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.data);
          setScreen('dashboard');
          await fetchData();
        } catch (e) {
          localStorage.removeItem('verdict_token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [fetchData]);

  const handleLogin = async (name, pin) => {
    const res = await api.login(name, pin);
    localStorage.setItem('verdict_token', res.data.token);
    setUser(res.data);
    setScreen('dashboard');
    await fetchData();
  };

  const handleLogout = async () => {
    try { await api.logout(); } catch (e) { /* ignore */ }
    localStorage.removeItem('verdict_token');
    setUser(null);
    setScreen('login');
    setEntries([]);
    setStats({ nettoyage: 0, temperature: 0, reception: 0, heures: 0 });
  };

  const handleSaveEntry = async (entry) => {
    try {
      const res = await api.createEntry(entry);
      setEntries(prev => [res.data, ...prev]);
      const type = entry.type;
      if (type !== 'haccp') {
        setStats(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
      }
      showToast('Enregistr\u00e9 avec succ\u00e8s', 'success');
      setTimeout(() => {
        setScreen('dashboard');
        fetchData();
      }, 900);
    } catch (e) {
      showToast('Erreur d\'enregistrement', 'error');
    }
  };

  const handleUpdateHaccpState = useCallback(async (state) => {
    try { await api.updateHaccpState(state); } catch (e) { /* ignore */ }
  }, []);

  const handleCompleteModule = async (idx) => {
    try {
      await api.completeModule(idx);
      setModuleProgress(prev => ({ ...prev, [idx]: true }));
      showToast('Module compl\u00e9t\u00e9!', 'success');
      setTimeout(() => setScreen('formation'), 800);
    } catch (e) {
      showToast('Erreur', 'error');
    }
  };

  const handleClearData = () => {
    setEntries([]);
    setStats({ nettoyage: 0, temperature: 0, reception: 0, heures: 0 });
  };

  const goBack = () => {
    setScreen('dashboard');
    fetchData();
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'dashboard':
        return (
          <Dashboard
            user={user}
            stats={stats}
            entries={entries}
            onLogout={handleLogout}
            onOpenForm={setScreen}
            onOpenFormation={() => setScreen('formation')}
            onSwitchTab={setScreen}
          />
        );
      case 'nettoyage':
        return <NettoyageForm user={user} onSave={handleSaveEntry} onBack={goBack} showToast={showToast} />;
      case 'temperature':
        return <TemperatureForm user={user} onSave={handleSaveEntry} onBack={goBack} showToast={showToast} />;
      case 'reception':
        return <ReceptionForm user={user} onSave={handleSaveEntry} onBack={goBack} showToast={showToast} />;
      case 'heures':
        return <HeuresForm user={user} onSave={handleSaveEntry} onBack={goBack} showToast={showToast} />;
      case 'haccp':
        return <HaccpScreen haccpState={haccpState} onSave={handleSaveEntry} onBack={goBack} onUpdateState={handleUpdateHaccpState} />;
      case 'formation':
        return (
          <FormationList
            moduleProgress={moduleProgress}
            onOpenModule={(idx) => { setCurrentModule(idx); setScreen('module'); }}
            onBack={goBack}
          />
        );
      case 'module':
        return <ModuleViewer moduleIndex={currentModule} onComplete={handleCompleteModule} onBack={() => setScreen('formation')} />;
      case 'history':
        return <HistoryScreen onSwitchTab={setScreen} />;
      case 'settings':
        return <SettingsScreen onSwitchTab={setScreen} showToast={showToast} onClearData={handleClearData} />;
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="App" data-testid="app-root">
      {renderScreen()}
      <div className={`toast-container ${toast ? 'show' : ''} ${toast?.type || ''}`} data-testid="toast">
        {toast?.msg || ''}
      </div>
    </div>
  );
}

export default App;
