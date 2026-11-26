import type {CatalogPaint} from './catalog';
import {mixPigments} from './spectral-mix';
function lab(hex:string){
 if(!/^#[0-9a-f]{6}$/i.test(hex))throw new RangeError('Invalid color');
 const [r,g,b]=[1,3,5].map(i=>{const v=parseInt(hex.slice(i,i+2),16)/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}) as [number,number,number];
 const l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b),m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b),s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);
 return [.2104542553*l+.793617785*m-.0040720468*s,1.9779984951*l-2.428592205*m+.4505937099*s,.0259040371*l+.7827717662*m-.808675766*s];
}
export function colorDistance(a:string,b:string){const x=lab(a),y=lab(b);return Math.hypot(...x.map((v,i)=>v-y[i]!))*100}
export function matchPaints(target:string,paints:readonly CatalogPaint[],limit=12){return paints.map(p=>({paint:p,distance:colorDistance(target,p.hex)})).sort((a,b)=>a.distance-b.distance).slice(0,limit)}
export function reverseMix(target:string,paints:readonly CatalogPaint[]){
 const candidates=matchPaints(target,paints,12).map(x=>x.paint);
 const results:{ingredients:{paint:CatalogPaint;drops:number}[];hex:string;distance:number}[]=[];
 for(let i=0;i<candidates.length;i++)for(let j=i+1;j<candidates.length;j++)for(const [a,b] of [[1,1],[1,2],[2,1],[1,3],[3,1]] as const){
 const ingredients=[{paint:candidates[i]!,drops:a},{paint:candidates[j]!,drops:b}];
 const hex=mixPigments(ingredients.map(x=>({hex:x.paint.hex,drops:x.drops})));
 results.push({ingredients,hex,distance:colorDistance(target,hex)});
 }
 return results.sort((a,b)=>a.distance-b.distance).slice(0,5);
}
