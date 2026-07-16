<?php

namespace App\DataFixtures;

use App\Entity\Recipe;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $recipes = [
            (new Recipe())
                ->setName('Hachis parmentier')
                ->setDescription("Un gratin familial composé de viande de bœuf et d'une purée de pommes de terre onctueuse.")
                ->setPreparationTime(30)
                ->setCookingTime(35),
            (new Recipe())
                ->setName('Blanquette de veau')
                ->setDescription("Un mijoté de veau accompagné de légumes et d'une sauce blanche crémeuse.")
                ->setPreparationTime(25)
                ->setCookingTime(90),
            (new Recipe())
                ->setName('Gratin dauphinois')
                ->setDescription("De fines rondelles de pommes de terre cuites lentement dans une crème parfumée à l'ail.")
                ->setPreparationTime(20)
                ->setCookingTime(60),
            (new Recipe())
                ->setName('Croque-monsieur')
                ->setDescription('Un sandwich chaud et croustillant garni de jambon, de fromage et de béchamel.')
                ->setPreparationTime(10)
                ->setCookingTime(10),
            (new Recipe())
                ->setName('Bœuf bourguignon')
                ->setDescription('Du bœuf mijoté au vin rouge avec des carottes, des champignons et des petits oignons.')
                ->setPreparationTime(30)
                ->setCookingTime(180),
            (new Recipe())
                ->setName('Galettes de pommes de terre')
                ->setDescription('Des galettes dorées et croustillantes à base de pommes de terre râpées.')
                ->setPreparationTime(20)
                ->setCookingTime(15),
            (new Recipe())
                ->setName('Poulet basquaise')
                ->setDescription('Du poulet mijoté avec des poivrons, des tomates, des oignons et des aromates.')
                ->setPreparationTime(20)
                ->setCookingTime(45),
            (new Recipe())
                ->setName('Gratin de courgettes')
                ->setDescription('Des courgettes fondantes gratinées au four avec de la crème et du fromage.')
                ->setPreparationTime(15)
                ->setCookingTime(35),
            (new Recipe())
                ->setName('Clafoutis aux cerises')
                ->setDescription("Un dessert moelleux aux cerises recouvertes d'une pâte légère proche du flan.")
                ->setPreparationTime(15)
                ->setCookingTime(40),
            (new Recipe())
                ->setName('Mousse au chocolat')
                ->setDescription('Une mousse aérienne et gourmande préparée avec du chocolat noir.')
                ->setPreparationTime(20)
                ->setCookingTime(0),
        ];

        foreach ($recipes as $recipe) {
            $manager->persist($recipe);
        }

        $manager->flush();
    }
}
