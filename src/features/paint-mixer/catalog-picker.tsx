import {useState} from 'react';
import {searchCatalog,type CatalogPaint} from '../../domain/color/catalog';
import {useCatalog} from '../../infrastructure/use-catalog';
export function CatalogPicker({onSelect}:{onSelect:(p:CatalogPaint)=>void}){
 const {paints,status}=useCatalog();
 const [query,setQuery]=useState('');
 const results=query.trim()?searchCatalog(paints,query):[];
 return <div className="catalog-picker"><label>Buscar tinta comercial<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Marca, nome ou código"/></label>{status&&<p role="status">{status}</p>}{query.trim()&&<div className="catalog-results">{results.map((p,i)=><button key={i} onClick={()=>{onSelect(p);setQuery('')}}><span className="catalog-swatch" style={{background:p.hex}}/><span>{p.name}<small>{[p.brand,p.range,p.code].filter(Boolean).join(' · ')}</small></span></button>)}{!status&&!results.length&&<p>Nenhuma tinta encontrada.</p>}</div>}</div>
}
