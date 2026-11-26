import {useState} from 'react';
import {celPalette} from '../../domain/color/cel-palette';
export function CelShading({onFind}:{onFind:(hex:string)=>void}){
 const [base,setBase]=useState('#d46b26');const [contrast,setContrast]=useState(.8);
 return <><h1>Paleta cel shading</h1><section className="panel"><label>Cor-base <input type="color" value={base} onChange={e=>setBase(e.target.value)}/> {base}</label><label>Contraste {Math.round(contrast*100)}%<input type="range" min="0" max="1" step=".05" value={contrast} onChange={e=>setContrast(Number(e.target.value))}/></label><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))',gap:8}}>{celPalette(base,contrast).map(p=><button key={p.role} style={{display:'grid',gap:4,textAlign:'left'}} onClick={()=>onFind(p.hex)}><span style={{background:p.hex,height:64,borderRadius:4}}/><strong>{p.role}</strong><small>{p.hex} · Buscar tinta</small></button>)}</div><p className="muted">Paleta digital de valores, não receita física. Selecione uma amostra para encontrar tintas e misturas próximas. Ajuste a direção e temperatura da luz conforme a referência.</p></section></>
}
