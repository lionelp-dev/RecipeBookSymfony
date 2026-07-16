<?php

namespace App\Tests\Api;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

final class OpenApiTest extends KernelTestCase
{
    public function testRecipeApiUsesJsonOnlySchemas(): void
    {
        $document = self::getOpenApiDocument();
        $schemas = $document['components']['schemas'];

        self::assertSame(
            ['ConstraintViolation', 'Error', 'Recipe', 'Recipe.jsonMergePatch'],
            array_keys($schemas),
        );

        foreach (array_keys($schemas) as $schemaName) {
            self::assertStringNotContainsString('.jsonld', $schemaName);
            self::assertFalse(str_starts_with($schemaName, 'Hydra'));
        }

        self::assertSame(
            ['application/json'],
            array_keys($document['paths']['/api/recipes']['get']['responses']['200']['content']),
        );
        self::assertSame(
            ['application/json'],
            array_keys($document['paths']['/api/recipes']['post']['requestBody']['content']),
        );
        self::assertSame(
            ['application/merge-patch+json'],
            array_keys($document['paths']['/api/recipes/{id}']['patch']['requestBody']['content']),
        );
        self::assertArrayHasKey(
            'application/problem+json',
            $document['paths']['/api/recipes']['post']['responses']['422']['content'],
        );
    }

    public function testRecipeSchemaDocumentsValidationConstraints(): void
    {
        $recipeSchema = self::getOpenApiDocument()['components']['schemas']['Recipe'];

        self::assertSame(
            ['name', 'preparationTime', 'cookingTime'],
            $recipeSchema['required'],
        );
        self::assertSame(255, $recipeSchema['properties']['name']['maxLength']);
        self::assertSame(0, $recipeSchema['properties']['preparationTime']['minimum']);
        self::assertSame(0, $recipeSchema['properties']['cookingTime']['minimum']);
    }

    private static function getOpenApiDocument(): array
    {
        self::bootKernel();

        $container = self::getContainer();
        $factory = $container->get(OpenApiFactoryInterface::class);
        $normalizer = $container->get('serializer');

        self::assertInstanceOf(NormalizerInterface::class, $normalizer);

        $document = $normalizer->normalize($factory(), 'json');
        self::assertIsArray($document);

        return $document;
    }
}
