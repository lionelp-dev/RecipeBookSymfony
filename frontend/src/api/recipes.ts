export type Recipe = {
	id: number;
	name: string;
	description: string | null;
	preparationTime: number;
	cookingTime: number;
};

export type RecipeInput = {
	name: string;
	description: string | null;
	preparationTime: number;
	cookingTime: number;
};

type RecipeCollection =
	| Recipe[]
	| {
			member?: Recipe[];
			"hydra:member"?: Recipe[];
	  };

export async function getRecipes(): Promise<Recipe[]> {
	const response = await fetch("/api/recipes", {
		cache: "no-store",
		headers: { Accept: "application/json" },
	});

	if (!response.ok) {
		throw new Error(`L'API a répondu avec le statut ${response.status}.`);
	}

	const data = (await response.json()) as RecipeCollection;

	if (Array.isArray(data)) {
		return data;
	}

	return data.member ?? data["hydra:member"] ?? [];
}

export async function createRecipe(recipe: RecipeInput): Promise<Recipe> {
	const response = await fetch("/api/recipes", {
		method: "POST",
		cache: "no-store",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(recipe),
	});

	if (!response.ok) {
		throw new Error(`L'API a répondu avec le statut ${response.status}.`);
	}

	return (await response.json()) as Recipe;
}

export async function getRecipe(id: number): Promise<Recipe> {
	const response = await fetch(`/api/recipes/${id}`, {
		cache: "no-store",
		headers: { Accept: "application/json" },
	});

	if (!response.ok) {
		throw new Error(`L'API a répondu avec le statut ${response.status}.`);
	}

	return (await response.json()) as Recipe;
}

export async function updateRecipe(
	id: number,
	recipe: RecipeInput,
): Promise<Recipe> {
	const response = await fetch(`/api/recipes/${id}`, {
		method: "PATCH",
		cache: "no-store",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/merge-patch+json",
		},
		body: JSON.stringify(recipe),
	});

	if (!response.ok) {
		throw new Error(`L'API a répondu avec le statut ${response.status}.`);
	}

	return (await response.json()) as Recipe;
}

export async function deleteRecipe(id: number): Promise<void> {
	const response = await fetch(`/api/recipes/${id}`, {
		method: "DELETE",
		cache: "no-store",
		headers: { Accept: "application/json" },
	});

	if (!response.ok) {
		throw new Error(`L'API a répondu avec le statut ${response.status}.`);
	}
}
