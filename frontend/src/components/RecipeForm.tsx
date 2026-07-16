import { Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import type { RecipeInput } from "../api/recipes";

type FormState = {
	name: string;
	description: string;
	preparationTime: string;
	cookingTime: string;
};

type RecipeFormProps = {
	initialValues: RecipeInput;
	submitLabel: string;
	submittingLabel: string;
	onSubmit: (recipe: RecipeInput) => Promise<void>;
};

export function RecipeForm({
	initialValues,
	submitLabel,
	submittingLabel,
	onSubmit,
}: RecipeFormProps) {
	const [form, setForm] = useState<FormState>({
		name: initialValues.name,
		description: initialValues.description ?? "",
		preparationTime: String(initialValues.preparationTime),
		cookingTime: String(initialValues.cookingTime),
	});
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);

		const name = form.name.trim();
		const description = form.description.trim();
		const preparationTime = Number(form.preparationTime);
		const cookingTime = Number(form.cookingTime);

		if (!name) {
			setError("Le nom de la recette est obligatoire.");
			return;
		}

		if (
			!isValidDuration(form.preparationTime, preparationTime) ||
			!isValidDuration(form.cookingTime, cookingTime)
		) {
			setError("Les temps doivent etre des nombres positifs ou egaux a zero.");
			return;
		}

		setIsSubmitting(true);

		try {
			await onSubmit({
				name,
				description: description || null,
				preparationTime,
				cookingTime,
			});
		} catch (caughtError) {
			setError(
				caughtError instanceof Error
					? caughtError.message
					: "La recette n'a pas pu etre enregistree.",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<form
			className="mt-8 space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
			onSubmit={handleSubmit}
			noValidate
		>
			<div>
				<label htmlFor="name" className="block text-sm font-semibold text-stone-800">
					Nom
				</label>
				<input
					id="name"
					type="text"
					value={form.name}
					onChange={(event) =>
						setForm((current) => ({ ...current, name: event.target.value }))
					}
					className="mt-2 min-h-11 w-full rounded-xl border border-stone-300 px-3 py-2 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
					autoComplete="off"
				/>
			</div>

			<div>
				<label
					htmlFor="description"
					className="block text-sm font-semibold text-stone-800"
				>
					Description <span className="font-normal text-stone-500">(facultative)</span>
				</label>
				<textarea
					id="description"
					value={form.description}
					onChange={(event) =>
						setForm((current) => ({ ...current, description: event.target.value }))
					}
					rows={5}
					className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
				/>
			</div>

			<div className="grid gap-6 sm:grid-cols-2">
				<div>
					<label
						htmlFor="preparationTime"
						className="block text-sm font-semibold text-stone-800"
					>
						Préparation (minutes)
					</label>
					<input
						id="preparationTime"
						type="number"
						min="0"
						step="1"
						value={form.preparationTime}
						onChange={(event) =>
							setForm((current) => ({
								...current,
								preparationTime: event.target.value,
							}))
						}
						className="mt-2 min-h-11 w-full rounded-xl border border-stone-300 px-3 py-2 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
					/>
				</div>

				<div>
					<label
						htmlFor="cookingTime"
						className="block text-sm font-semibold text-stone-800"
					>
						Cuisson (minutes)
					</label>
					<input
						id="cookingTime"
						type="number"
						min="0"
						step="1"
						value={form.cookingTime}
						onChange={(event) =>
							setForm((current) => ({
								...current,
								cookingTime: event.target.value,
							}))
						}
						className="mt-2 min-h-11 w-full rounded-xl border border-stone-300 px-3 py-2 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
					/>
				</div>
			</div>

			{error && (
				<p
					className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
					role="alert"
				>
					{error}
				</p>
			)}

			<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
				<Link
					to="/"
					className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-800 transition hover:bg-stone-100"
				>
					Annuler
				</Link>
				<button
					type="submit"
					disabled={isSubmitting}
					className="inline-flex min-h-11 items-center justify-center rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isSubmitting ? submittingLabel : submitLabel}
				</button>
			</div>
		</form>
	);
}

function isValidDuration(rawValue: string, value: number) {
	return rawValue.trim() !== "" && Number.isInteger(value) && value >= 0;
}
