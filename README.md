## User stories finales

• Création de tâche : En tant qu'utilisateur, je veux pouvoir saisir un titre et cliquer sur un bouton de validation afin d'ajouter une nouvelle action à ma liste quotidienne.

• Suivi de progression : En tant qu'utilisateur, je veux cocher une case à côté d'une tâche afin de la marquer comme terminée et la distinguer visuellement des tâches en cours.

• Nettoyage de l'espace : En tant qu'utilisateur, je veux cliquer sur une icône de corbeille afin de supprimer définitivement une tâche inutile ou créée par erreur.

• Persistance des données : En tant qu'utilisateur, je veux retrouver ma liste intacte lorsque je ferme et rouvre mon navigateur afin de ne jamais perdre mon travail en cours.

• Filtrage visuel : En tant qu'utilisateur, je veux cliquer sur des onglets de tri afin d'afficher uniquement les tâches actives, uniquement les tâches terminées, ou l'intégralité de ma liste.

## Arborescence :

```
Taskflow/
├── app.js
├── index.html
├── PROMPTS.md
├── README.md
└── style.css
```

## Modèle de données :

```
{
  "id": 1,
  "titre": "Réviser le CSS",
  "description": "Réviser Flexbox et Grid",
  "priorite": "haute",
  "echeance": "2026-11-15",
  "statut": "a_faire",
  "categorie": "cours",
  "dateCreation": "2026-10-30"
}
```

## Modèle complet :

```
{
  "id": 1,
  "titre": "Réviser le CSS",
  "description": "Réviser Flexbox et Grid",
  "priorite": "haute",
  "echeance": "2026-11-15",
  "statut": "a_faire",
  "categorie": "cours",
  "filiereId": 2,
  "matiereId": 5,
  "anneeEtude": "L2",
  "dateCreation": "2026-10-30"
}
```