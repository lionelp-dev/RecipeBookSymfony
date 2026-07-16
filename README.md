# Carnet de recettes

Carnet de recettes est une application pédagogique pour découvrir l'environnement Symfony. Elle permet de gérer une collection de recettes avec Doctrine ORM, des formulaires Symfony et une interface Twig mise en forme avec Tailwind CSS.

Chaque recette possède un nom, une description, un temps de préparation et un temps de cuisson. L'application couvre le cycle complet de création, de consultation, de modification et de suppression des données.

## Objectifs d'apprentissage

Ce projet sert de support pour pratiquer les bases d'une application Symfony :

- définir des contrôleurs et des routes avec des attributs PHP ;
- créer et traiter des formulaires Symfony liés à une entité ;
- manipuler une base de données avec Doctrine ORM, les migrations et les repositories ;
- charger des données de démonstration avec les fixtures Doctrine ;
- construire des vues avec Twig, des partials et un thème de formulaire personnalisé ;
- intégrer Tailwind CSS avec SymfonyCasts TailwindBundle ;
- protéger une action sensible avec un token CSRF.

## Fonctionnalités

- affichage de toutes les recettes ;
- ajout d'une recette ;
- modification d'une recette existante ;
- suppression d'une recette avec confirmation et protection CSRF ;
- données de démonstration comprenant plusieurs recettes françaises.

## Prérequis

- PHP 8.4 ou supérieur ;
- Composer ;
- l'extension PHP SQLite.

## Démarrage

1. Installer les dépendances PHP :

   ```bash
   composer install
   ```

2. Créer la base de données en appliquant les migrations :

   ```bash
   php bin/console doctrine:migrations:migrate --no-interaction
   ```

3. Charger les recettes de démonstration :

   ```bash
   php bin/console doctrine:fixtures:load --no-interaction
   ```

   Cette commande remplace les données déjà présentes dans la base.

4. Dans un premier terminal, compiler Tailwind CSS et surveiller les modifications :

   ```bash
   php bin/console tailwind:build --watch
   ```

5. Dans un second terminal, lancer le serveur PHP :

  ```bash
  symfony server:start 
   ```

L'application est disponible sur `http://127.0.0.1:8000/`.
