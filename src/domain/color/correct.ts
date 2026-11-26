import {referenceColors} from './reference-colors';
import type {CatalogPaint} from './catalog';
import {colorDistance,matchPaints} from './match';
import {mixPigments} from './spectral-mix';
export function correctMix(current:string,target:string,drops:number,paints:readonly CatalogPaint[]){
 if(!Number.isSafeInteger(drops)||drops<1||drops>10000)throw new RangeError('Invalid drops');
 const before=colorDistance(current,target);
 const candidates=matchPaints(target,paints,24).map(x=>x.paint);
 const anchors=referenceColors;
 for(const anchor of anchors){const p=matchPaints(anchor,paints,1)[0]?.paint;if(p&&!candidates.includes(p))candidates.push(p)}
 return candidates.flatMap(paint=>Array.from({length:Math.min(12,drops)},(_,i)=>{const added=i+1;const hex=mixPigments([{hex:current,drops},{hex:paint.hex,drops:added}]);return {paint,added,hex,distance:colorDistance(hex,target)}})).filter(x=>x.distance<before).sort((a,b)=>a.distance-b.distance).slice(0,5);
}
