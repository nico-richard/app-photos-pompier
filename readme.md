# Application de gestion des photos

### Accueil
Vide pour le moment

### Véhicules
Tableau listant tous les véhicules dans la table `vehicle`.

Bouton d'ajout : celà ouvre une ligne vide à remplir.

Actions pour chaque ligne :

- **Détails** : ouvre une modale détailant les propritétés du véhicule et affichant ses vues
- **Ajouter photos** : ouvre une modale détailant les propritétés du véhicule et permettant de gérer les vues (ajout suppression)
- **Editer** : permet d'éditer les propriétés de la ligne en question
- **Supprimer** : permet de supprimer la ligne en question

### Vues
Gallerie de toutes les images présentes dans la table `view`.

Filtres dynamiques disponible sur la partie gauche.

### Import

Importation des données provenant de fichier Excel, le format doit correspondre à :

### Marques

Tableau listant les marques.

Actions pour chaque ligne :

- **Editer** : permet d'éditer le nom de la marque en question
- **Supprimer** : permet de supprimer la marque en question

# TODO

### Import
- Ne pas importer les véhicules déjà présent
- Ne pas créer les vues déjà présentes
- Afficher le nombre de véhicules qui vont être créés et les existants

### Modale d'ajout de vues pour véhicule
- Ne pas re-créer les vues déjà présentes

### Gallerie des vues
- Ne pas afficher les vues non trouvées
- Ajouter icone de chargement