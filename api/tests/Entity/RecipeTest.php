<?php

namespace App\Tests\Entity;

use App\Entity\Recipe;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class RecipeTest extends KernelTestCase
{
    public function testRequiredRecipeFieldsAreValidated(): void
    {
        self::bootKernel();

        $violations = self::getValidator()->validate(new Recipe());

        self::assertCount(3, $violations);
        self::assertSame('name', $violations[0]->getPropertyPath());
        self::assertSame('preparationTime', $violations[1]->getPropertyPath());
        self::assertSame('cookingTime', $violations[2]->getPropertyPath());
    }

    public function testRecipeTimesCannotBeNegative(): void
    {
        self::bootKernel();

        $recipe = (new Recipe())
            ->setName('Soupe')
            ->setPreparationTime(-1)
            ->setCookingTime(-5)
        ;

        $violations = self::getValidator()->validate($recipe);

        self::assertCount(2, $violations);
        self::assertSame('preparationTime', $violations[0]->getPropertyPath());
        self::assertSame('cookingTime', $violations[1]->getPropertyPath());
    }

    private static function getValidator(): ValidatorInterface
    {
        return self::getContainer()->get(ValidatorInterface::class);
    }
}
