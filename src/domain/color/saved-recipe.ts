export type RecipePaint={name:string;brand:string;hex:string;drops:number;tintingStrength?:number};
export type SavedRecipe={id:string;name:string;paints:RecipePaint[];thinner:number;hex:string};
export function isSavedRecipe(x:unknown):x is SavedRecipe{
 if(!x||typeof x!=='object')return false;
 const r=x as SavedRecipe;
 return typeof r.id==='string'&&typeof r.name==='string'&&typeof r.hex==='string'&&/^#[0-9a-f]{6}$/i.test(r.hex)&&Number.isSafeInteger(r.thinner)&&r.thinner>=0&&r.thinner<=10000&&Array.isArray(r.paints)&&r.paints.length>0&&r.paints.length<=100&&r.paints.every(p=>p&&typeof p.name==='string'&&typeof p.brand==='string'&&typeof p.hex==='string'&&/^#[0-9a-f]{6}$/i.test(p.hex)&&Number.isSafeInteger(p.drops)&&p.drops>=1&&p.drops<=10000&&(p.tintingStrength===undefined||(typeof p.tintingStrength==='number'&&Number.isFinite(p.tintingStrength)&&p.tintingStrength>=.1&&p.tintingStrength<=5)));
}

// Compare recipe content, not backup IDs or object property order.
function recipeKey(r:SavedRecipe){return JSON.stringify([r.name,r.thinner,r.hex.toLowerCase(),r.paints.map(p=>[p.name,p.brand,p.hex.toLowerCase(),p.drops,p.tintingStrength??1])])}
export function mergeRecipeBackup(existing:SavedRecipe[],incoming:SavedRecipe[],newId:()=>string){const result=[...existing];const keys=new Set(existing.map(recipeKey));for(const r of incoming){const key=recipeKey(r);if(keys.has(key))continue;keys.add(key);result.push({...r,id:newId()})}return result}
