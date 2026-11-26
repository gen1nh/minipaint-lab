export function celPalette(base:string,contrast:number){
 if(!/^#[0-9a-f]{6}$/i.test(base)||!Number.isFinite(contrast)||contrast<0||contrast>1)throw new RangeError('Invalid palette');
 const shade=(amount:number)=>'#'+[1,3,5].map(i=>{const v=parseInt(base.slice(i,i+2),16);return Math.round(amount<0?v*(1+amount):v+(255-v)*amount).toString(16).padStart(2,'0')}).join('');
 return [{role:'Sombra profunda',hex:shade(-.65*contrast)},{role:'Sombra',hex:shade(-.35*contrast)},{role:'Base',hex:base.toLowerCase()},{role:'Luz',hex:shade(.35*contrast)},{role:'Brilho',hex:shade(.7*contrast)}];
}
