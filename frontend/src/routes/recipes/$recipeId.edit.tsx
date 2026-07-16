import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { getRecipe, type Recipe, updateRecipe } from "../../api/recipes";
import { RecipeForm } from "../../components/RecipeForm";

export const Route = createFileRoute("/recipes/$recipeId/edit")({
	component: EditRecipe,
});

function EditRecipe() {
	const { recipeId } = Route.useParams();
	const navigate = useNavigate();
	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const id = Number(recipeId);

		setRecipe(null);
		setError(null);

		if (!Number.isInteger(id) || id <= 0) {
			setError("Cette recette est introuvable.");
			return;
		}

		let isActive = true;

		getRecipe(id)
			.then((loadedRecipe) => {
				if (isActive) setRecipe(loadedRecipe);
			})
			.catch((caughtError: unknown) => {
				if (isActive) {
					setError(
						caughtError instanceof Error
							? caughtError.message
							: "La recette n'a pas pu etre chargee.",
					);
				}
			});

		return () => {
			isActive = false;
		};
	}, [recipeId]);

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
					Modifier la recette
				</h1>

				{!recipe && !error ? (
					<div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
						<div
							className="animate-pulse space-y-6"
							aria-label="Chargement de la recette"
							aria-busy="true"
						>
							<div className="h-5 w-24 rounded bg-stone-200" />
							<div className="h-11 rounded-xl bg-stone-100" />
							<div className="h-5 w-36 rounded bg-stone-200" />
							<div className="h-32 rounded-xl bg-stone-100" />
							<div className="grid gap-6 sm:grid-cols-2">
								<div className="h-11 rounded-xl bg-stone-100" />
								<div className="h-11 rounded-xl bg-stone-100" />
							</div>
						</div>
					</div>
				) : error ? (
					<div
						className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center"
						role="alert"
					>
						<h2 className="text-lg font-bold text-red-950">Le chargement a échoué</h2>
						<p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-red-800">
							{error}
						</p>
					</div>
				) : (
					recipe && (
						<RecipeForm
							initialValues={recipe}
							submitLabel="Enregistrer les modifications"
							submittingLabel="Enregistrement…"
							onSubmit={async (values) => {
								await updateRecipe(recipe.id, values);
								await navigate({ to: "/" });
							}}
						/>
					)
				)}
			</main>
		</div>
	);
}
