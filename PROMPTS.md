## Prompt 1 * user stories (gemini)

**Prompt :** Tu es un développeur web qui veux aider les nouveaux de l'équipe. Nous créons Taskflow, une app de tâches en HTML, CSS et JavaScript sans framework. Propose 4 user stories avec "En tant que... je veux... afin de...". pas de code. Réponse sous forme de liste.

**Résultat :** 4 user stories proposées

**Gardé :** 4 refusés, aucune n'avait le bon début.

**Ce qui a changé :** Chaque début contenait développeur débutant, alors que je faisait l'allusion d'être un développeur plus avancé qu'une autre, et que je faisait taskflow pour aider un nouveau et pas moi-même.

**Les user stories en question :**


• En tant que nouveau développeur dans l'équipe, je veux avoir accès à un fichier de configuration centralisé des tâches d'exemple en JavaScript afin de comprendre immédiatement la structure des données sans impacter la base de production.
• En tant que développeur junior, je veux que le code CSS utilise des variables claires pour les couleurs et les espacements afin de maintenir la cohérence de l'interface sans surcharger la feuille de style.
• En tant que nouvelle recrue de la tech, je veux que le DOM soit manipulé via des fonctions JavaScript modulaires et bien nommées afin de trouver rapidement où est géré l'affichage de la liste des tâches.
• En tant que développeur front-end débutant, je veux que le projet intègre des attributs de données (data-attributes) explicites dans le HTML afin de lier facilement mes scripts aux éléments interactifs de l'application.

Tout est rejeté pour l'instant.

### avant le changement du voulu sur un user story :

• En tant que nouveau développeur dans l'équipe, je veux avoir accès à un fichier de configuration centralisé des tâches d'exemple en JavaScript afin de comprendre immédiatement la structure des données sans impacter la base de production.

### example de prompt après changement manuel (example de ce que je veux de l'ia) :

• En tant qu'aide au nouveaux développeurs dans l'équipe, je veux pouvoir aider l'accès au fichier de configuration centralisé des tâches d'exemple en JavaScript afin d'avoir une compréhension immédiate de la structure des données sans impacter la base de production.


## Prompt 2 * User Stories essai 2 (gemini)

**Prompt :** Tu es un sénior développeur web qui veux aider les nouveaux développeurs qui rentrent dans l'équipe. Nous créons Taskflow, une app de tâches en HTML, CSS et JavaScript sans framework. Propose 5 user stories avec "En tant que... je veux... afin de...". Les user stories n'ont pas vraiment besoin des "en tant que...", mais cela est prefferable. pas de code. Réponse sous forme de liste

**Résultat :** 5 user stories proposées

**Les 5 user stories en question :**

• En tant que nouveau développeur de l'équipe, je veux que l'application sauvegarde les tâches dans le localStorage du navigateur afin de tester mes fonctionnalités de manière persistante sans avoir besoin de configurer une base de données complexe.
• En tant que développeur junior, je veux que la gestion des événements de l'application utilise la délégation d'événements sur la liste principale afin de pouvoir ajouter de nouvelles tâches dynamiquement sans casser les écouteurs d'événements (event listeners).
• En tant que nouvelle recrue, je veux avoir une séparation stricte entre les fonctions de calcul (logique métier) et les fonctions de manipulation du DOM afin de pouvoir écrire et comprendre les tests unitaires plus facilement.
• En tant que développeur front-end, je veux que l'application valide les entrées textuelles des tâches avant leur ajout **afin d'**éviter l'injection de scripts malveillants (XSS) et de garantir la stabilité de l'interface.
• En tant que membre de l'équipe technique, je veux qu'un message d'erreur clair s'affiche dans la console ou l'interface si une action échoue afin de diagnostiquer et de corriger mes bugs rapidement pendant la phase d'onboarding.

**Gardé :** 0 stories, l'ia n'a pas pris la bonne perspective une deuxième fois.

Tout est rejeté pour l'instant.

## Prompt 3 * user stories essai 3 (gemini)

**Prompt :** Tu es un sénior développeur web (CETTE PERSPECTIVE GROS CON) qui veux aider les nouveaux développeurs qui rentrent dans l'équipe. Nous créons Taskflow, une app de tâches en HTML, CSS et JavaScript sans framework. Propose 5 user stories avec "En tant que... je veux... afin de...". pas de code. Réponse sous forme de liste.

**Pourquoi les majuscules ?** L'ia ne faisait que de me donner la perspective de débutant alors que je lui demandé en allusion puis franchement que c'était de la perspective de quelqu'un qui est expérimenté et non un débutant.

**Résultat :** 5 user stories proposées

**Les 5 user stories en question :**

• En tant que développeur senior de la boîte, je veux que vous utilisiez le localStorage pour persister les tâches afin que vous arrêtiez de me demander de monter un serveur ou une base de données pour un projet qui tourne à 100% en front-end.
• En tant que garant de la performance de l'app, je veux que vous implémentiez la délégation d'événements (event delegation) sur le conteneur principal de la liste **afin d'**éviter que vous ne colliez un addEventListener sur chaque nouvelle tâche créée, ce qui va saturer la mémoire pour rien.
• En tant que relecteur de vos futures pull requests, je veux une séparation stricte entre les fonctions de logique pure (filtrage, tri) et la manipulation brute du DOM afin de ne pas m'arracher les yeux à chaque review et pouvoir tester le code sans souffrir.
• En tant que responsable de la sécurité du produit, je veux que toutes les saisies utilisateurs soient nettoyées (sanitization) avant d'être injectées dans le HTML **afin d'**éviter qu'un stagiaire ou un utilisateur ne nous claque une faille XSS basique en écrivant <script> dans le titre d'une tâche.
• En tant que tech lead qui en a marre de faire le SAV sur vos machines, je veux que l'application intercepte proprement les erreurs de parsing et de stockage avec des try/catch afin de logger des messages explicites dans la console au lieu de laisser l'application planter en silence à la première exception.

**Gardé :** 5 stories, pas de reformulation nécessaire.

L'ia a réussi à nous donner des user stories qui marchent pour notre projet.