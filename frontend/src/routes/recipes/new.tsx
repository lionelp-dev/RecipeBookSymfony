import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { createRecipe } from "../../api/recipes";
import { RecipeForm } from "../../components/RecipeForm";

export const Route = createFileRoute("/recipes/new")({
	component: NewRecipe,
});

function NewRecipe() {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-stone-50 text-stone-950">
			<header className="border-b border-stone-200 bg-white px-4 py-4 sm:px-6 lg:px-10">
				<div className="mx-auto flex w-full max-w-3xl items-center justify-between">
					<Link
						to="/"
						className="text-sm font-semibold text-stone-600 transition hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
					>
						Retour aux recettes
					</Link>
				</div>
			</header>

			<main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
				<p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
					Carnet de cuisine
				</p>
				<h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
					Nouvelle recette
				</h1>

				<RecipeForm
					initialValues={{
						name: "",
						description: null,
						preparationTime: 0,
						cookingTime: 0,
					}}
					submitLabel="Créer la recette"
					submittingLabel="Enregistrement…"
					onSubmit={async (recipe) => {
						await createRecipe(recipe);
						await navigate({ to: "/" });
					}}
				/>
			</main>
		</div>
	);
}
