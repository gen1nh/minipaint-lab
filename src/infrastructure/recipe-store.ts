import {isSavedRecipe,type SavedRecipe} from '../domain/color/saved-recipe';
const key='minipaint:recipes:v1';
export function readRecipes():SavedRecipe[]{const raw:unknown=JSON.parse(localStorage.getItem(key)??'[]');if(!Array.isArray(raw)||!raw.every(isSavedRecipe))throw new Error('Invalid saved recipes');return raw}
export function writeRecipes(recipes:SavedRecipe[]){if(!recipes.every(isSavedRecipe))throw new Error('Invalid recipe');localStorage.setItem(key,JSON.stringify(recipes))}
