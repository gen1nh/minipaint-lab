import {useState,useEffect} from 'react';
import {parseCatalog,searchCatalog,type CatalogPaint} from '../../domain/color/catalog';
export function CatalogPicker({onSelect}:{onSelect:(p:CatalogPaint)=>void}){
 const [paints,setPaints]=useState<CatalogPaint[]>([]);
 const [query,setQuery]=useState('');
 const [status,setStatus]=useState('Carregando catálogo…');
 useEffect(()=>{const controller=new AbortController();const load=async()=>{const read=async(path:string)=>{const r=await fetch(import.meta.env.BASE_URL+'catalog/'+path,{signal:controller.signal});if(!r.ok)throw new Error('Catalog unavailable');return r.json() as Promise<unknown>};const index=await read('index.json');if(!Array.isArray(index)||!index.every(x=>typeof x==='string'&&/^[a-zA-Z0-9_]+$/.test(x)))throw new Error('Invalid index');const data=await Promise.all(index.map(x=>read(x+'.json')));setPaints(data.flatMap(parseCatalog));setStatus('')};void load().catch(()=>{if(!controller.signal.aborted)setStatus('Catálogo indisponível. Use uma cor personalizada.')});return ()=>controller.abort()},[]);
 return <div className="catalog-picker"><label>Buscar tinta comercial<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Marca, nome ou código"/></label>{status&&<p role="status">{status}</p>}{query.trim()&&<div className="catalog-results">{searchCatalog(paints,query).map((p,i)=><button key={i} onClick={()=>{onSelect(p);setQuery('')}}><span className="catalog-swatch" style={{background:p.hex}}/><span>{p.name}<small>{p.brand} · {p.range} · {p.code}</small></span></button>)}{!status&&!searchCatalog(paints,query).length&&<p>Nenhuma tinta encontrada.</p>}</div>}<small>{paints.length} amostras digitais · <a href="https://github.com/Arcturus5404/miniature-paints">Fonte MIT</a></small></div>
}
