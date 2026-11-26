import { isSavedRecipe, type SavedRecipe } from '../domain/color/saved-recipe';

export const recipeStorageKey = 'minipaint:recipes:v1';

export function readRecipes(): SavedRecipe[] {
  const raw: unknown = JSON.parse(
    localStorage.getItem(recipeStorageKey) ?? '[]',
  );
  if (!Array.isArray(raw) || !raw.every(isSavedRecipe))
    throw new Error('Invalid saved recipes');
  return raw;
}

export async function updateRecipes(
  update: (current: SavedRecipe[]) => SavedRecipe[],
): Promise<SavedRecipe[]> {
  function commit() {
    const next = update(readRecipes());
    if (!next.every(isSavedRecipe)) throw new Error('Invalid recipe');
    localStorage.setItem(recipeStorageKey, JSON.stringify(next));
    return next;
  }

  return navigator.locks
    ? navigator.locks.request(recipeStorageKey, commit)
    : commit();
}
