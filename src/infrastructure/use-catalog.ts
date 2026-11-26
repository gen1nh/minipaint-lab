import {useEffect,useState} from 'react';
import type {CatalogPaint} from '../domain/color/catalog';
import {loadCatalog} from './catalog-loader';
export function useCatalog(){
 const [paints,setPaints]=useState<CatalogPaint[]>([]);
 const [status,setStatus]=useState('Carregando catálogo…');
 useEffect(()=>{let active=true;void loadCatalog().then(data=>{if(active){setPaints(data);setStatus('')}}).catch(()=>{if(active)setStatus('Catálogo indisponível')});return()=>{active=false}},[]);
 return {paints,status,brands:[...new Set(paints.map(p=>p.brand))].sort()};
}
