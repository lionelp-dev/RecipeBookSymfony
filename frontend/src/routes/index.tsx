import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { deleteRecipe, getRecipes, type Recipe } from "../api/recipes";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const [deletingRecipeId, setDeletingRecipeId] = useState<number | null>(null);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const {
		data: recipes = [],
		error,
		isPending,
		isFetching,
		refetch,
	} = useQuery({
		queryKey: ["recipes"],
		queryFn: () => getRecipes(),
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: "always",
		refetchOnWindowFocus: true,
	});

	async function handleDelete(recipe: Recipe) {
		const confirmed = window.confirm(
			`Supprimer la recette « ${recipe.name} » ?`,
		);

		if (!confirmed) return;

		setDeleteError(null);
		setDeletingRecipeId(recipe.id);

		try {
			await deleteRecipe(recipe.id);
			await refetch();
		} catch (caughtError) {
			setDeleteError(
				caughtError instanceof Error
					? caughtError.message
					: "La recette n'a pas pu etre supprimee.",
			);
		} finally {
			setDeletingRecipeId(null);
		}
	}

	return (
		<div className="min-h-screen bg-stone-50 text-stone-950">
			<header className="sticky top-0 z-20 flex h-16 items-center justify-end border-b border-stone-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-10">
				<Link
					to="/recipes/new"
					className="inline-flex min-h-11 items-center justify-center rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
				>
					Nouvelle recette
				</Link>
			</header>

			<main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
				<section aria-labelledby="recipes-title">
					<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber-700">
								Carnet de cuisine
							</p>
							<h1
								id="recipes-title"
								className="text-3xl font-bold tracking-tight sm:text-4xl"
							>
								Mes recettes
							</h1>
							<p className="mt-2 text-sm text-stone-500" aria-live="polite">
								{recipes.length} recette{recipes.length === 1 ? "" : "s"}
							</p>
						</div>

						<button
							type="button"
							disabled={isPending || isFetching}
							onClick={() => refetch()}
							className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-400 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Actualiser
						</button>
					</div>

					{deleteError && (
						<p
							className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
							role="alert"
						>
							{deleteError}
						</p>
					)}

					{isPending ? (
						<RecipeSkeleton />
					) : error ? (
						<div
							className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center"
							role="alert"
						>
							<h2 className="text-lg font-bold text-red-950">
								Le chargement a échoué
							</h2>
							<p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-red-800">
								{error.message}
							</p>
							<button
								type="button"
								onClick={() => refetch()}
								className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-red-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
							>
								Réessayer
							</button>
						</div>
					) : recipes.length === 0 ? (
						<div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
							<h2 className="text-lg font-bold">Aucune recette pour le moment</h2>
							<p className="mt-2 text-sm text-stone-500">
								Les recettes ajoutées à votre carnet apparaîtront ici.
							</p>
						</div>
					) : (
						<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
							{recipes.map((recipe) => (
								<article
									key={recipe.id}
									className="flex min-h-52 flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
								>
									<h2 className="text-xl font-bold tracking-tight">
										{recipe.name}
									</h2>

									<dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600">
										<div className="flex gap-1.5">
											<dt className="font-semibold text-stone-800">Préparation :</dt>
											<dd>{recipe.preparationTime} min</dd>
										</div>
										<div className="flex gap-1.5">
											<dt className="font-semibold text-stone-800">Cuisson :</dt>
											<dd>{recipe.cookingTime} min</dd>
										</div>
									</dl>

									<p className="mt-4 line-clamp-4 text-sm leading-6 text-stone-600">
										{recipe.description || "Aucune description disponible."}
									</p>

									<div className="mt-auto flex gap-3 pt-6">
										<Link
											to="/recipes/$recipeId/edit"
											params={{ recipeId: String(recipe.id) }}
											aria-label={`Modifier la recette ${recipe.name}`}
											className="inline-flex size-11 items-center justify-center rounded-xl border border-stone-300 bg-white text-stone-800 transition hover:border-stone-400 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
										>
											<Pencil aria-hidden="true" size={18} />
										</Link>
										<button
											type="button"
											onClick={() => handleDelete(recipe)}
											disabled={deletingRecipeId !== null}
											aria-label={
												deletingRecipeId === recipe.id
													? `Suppression de la recette ${recipe.name}`
													: `Supprimer la recette ${recipe.name}`
											}
											className="inline-flex size-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-800 transition hover:border-red-300 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 disabled:cursor-not-allowed disabled:opacity-50"
										>
											<Trash2 aria-hidden="true" size={18} />
										</button>
									</div>
								</article>
							))}
						</div>
					)}
				</section>
			</main>
		</div>
	);
}

function RecipeSkeleton() {
	return (
		<output
			className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
			aria-label="Chargement des recettes"
			aria-busy="true"
		>
			{[1, 2, 3, 4, 5, 6].map((item) => (
				<div
					key={item}
					className="min-h-52 animate-pulse rounded-2xl border border-stone-200 bg-white p-6"
				>
					<div className="h-6 w-2/3 rounded bg-stone-200" />
					<div className="mt-6 h-4 w-full rounded bg-stone-100" />
					<div className="mt-3 h-4 w-5/6 rounded bg-stone-100" />
					<div className="mt-3 h-4 w-1/2 rounded bg-stone-100" />
				</div>
			))}
		</output>
	);
}
