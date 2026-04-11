export const HACCP_CHECKLIST = [
  {
    section: "Hygi\u00e8ne du personnel",
    items: [
      { id: "h1", text: "Port du couvre-chef obligatoire", risk: "crit" },
      { id: "h2", text: "Lavage des mains fr\u00e9quent et document\u00e9", risk: "crit" },
      { id: "h3", text: "Tenue de travail propre et compl\u00e8te", risk: "maj" },
      { id: "h4", text: "Absence de bijoux en zone de production", risk: "maj" },
      { id: "h5", text: "Personnel malade \u00e9cart\u00e9 de la production", risk: "crit" }
    ]
  },
  {
    section: "Temp\u00e9ratures de contr\u00f4le",
    items: [
      { id: "t1", text: "R\u00e9frig\u00e9rateurs entre 0\u00b0C et 4\u00b0C", risk: "crit" },
      { id: "t2", text: "Cong\u00e9lateurs \u00e0 -18\u00b0C ou moins", risk: "crit" },
      { id: "t3", text: "Cuisson viande >= 74\u00b0C \u00e0 c\u0153ur", risk: "crit" },
      { id: "t4", text: "Cuisson volaille >= 85\u00b0C \u00e0 c\u0153ur", risk: "crit" },
      { id: "t5", text: "Maintien chaud >= 60\u00b0C", risk: "crit" },
      { id: "t6", text: "Registre de temp\u00e9ratures \u00e0 jour", risk: "maj" }
    ]
  },
  {
    section: "Nettoyage et d\u00e9sinfection",
    items: [
      { id: "n1", text: "Planchers propres, sans d\u00e9bris ni liquide", risk: "crit" },
      { id: "n2", text: "Surfaces de travail d\u00e9sinfect\u00e9es", risk: "crit" },
      { id: "n3", text: "\u00c9quipements nettoy\u00e9s apr\u00e8s usage", risk: "maj" },
      { id: "n4", text: "Programme de nettoyage document\u00e9", risk: "maj" },
      { id: "n5", text: "Produits d\u00e9sinfectants approuv\u00e9s disponibles", risk: "maj" }
    ]
  },
  {
    section: "Pr\u00e9vention contamination crois\u00e9e",
    items: [
      { id: "c1", text: "Planches synth\u00e9tiques code couleur utilis\u00e9es", risk: "crit" },
      { id: "c2", text: "S\u00e9paration viandes crues / aliments cuits", risk: "crit" },
      { id: "c3", text: "Aliments couverts et \u00e9tiquet\u00e9s en entrep\u00f4t", risk: "maj" },
      { id: "c4", text: "FIFO respect\u00e9 (premier entr\u00e9, premier sorti)", risk: "maj" }
    ]
  },
  {
    section: "Installations et \u00e9quipements",
    items: [
      { id: "e1", text: "\u00c9clairage suffisant en zone de production", risk: "maj" },
      { id: "e2", text: "Hotte fonctionnelle et propre", risk: "maj" },
      { id: "e3", text: "Poubelles ferm\u00e9es et vid\u00e9es r\u00e9guli\u00e8rement", risk: "maj" },
      { id: "e4", text: "Absence de nuisibles (rongeurs, insectes)", risk: "crit" },
      { id: "e5", text: "Eau chaude disponible aux postes de lavage", risk: "crit" }
    ]
  }
];
