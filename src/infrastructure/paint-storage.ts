import {isPaint,type PaintRecord} from '../domain/paint/catalog';
const key='minipaint.inventory.v1';
export function loadPaints():PaintRecord[]{
 const raw=localStorage.getItem(key);
 if(!raw)return [];
 const data:unknown=JSON.parse(raw);
 if(!Array.isArray(data)||!data.every(isPaint))throw new Error('Invalid inventory');
 return data;
}
export function savePaints(paints:PaintRecord[]){localStorage.setItem(key,JSON.stringify(paints))}
