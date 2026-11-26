import {useState,useEffect} from 'react';
import {searchCatalog,type CatalogPaint} from '../../domain/color/catalog';
import {loadCatalog} from '../../infrastructure/catalog-loader';
export function CatalogPicker({onSelect}:{onSelect:(p:CatalogPaint)=>void}){
 const [paints,setPaints]=useState<CatalogPaint[]>([]);
 const [query,setQuery]=useState('');
 const [status,setStatus]=useState('Carregando catálogo…');
 useEffect(()=>{let active=true;void loadCatalog().then(data=>{if(active){setPaints(data);setStatus('')}}).catch(()=>{if(active)setStatus('Catálogo indisponível. Use uma cor personalizada.')});return ()=>{active=false}},[]);
 const results=query.trim()?searchCatalog(paints,query):[];
 return <div className="catalog-picker"><label>Buscar tinta comercial<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Marca, nome ou código"/></label>{status&&<p role="status">{status}</p>}{query.trim()&&<div className="catalog-results">{results.map((p,i)=><button key={i} onClick={()=>{onSelect(p);setQuery('')}}><span className="catalog-swatch" style={{background:p.hex}}/><span>{p.name}<small>{[p.brand,p.range,p.code].filter(Boolean).join(' · ')}</small></span></button>)}{!status&&!results.length&&<p>Nenhuma tinta encontrada.</p>}</div>}</div>
}
