import {blendAppearance} from './appearance';
export function celPalette(base:string,contrast:number,temperature=0){
 if(!/^#[0-9a-f]{6}$/i.test(base)||!Number.isFinite(contrast)||contrast<0||contrast>1||!Number.isFinite(temperature)||Math.abs(temperature)>1)throw new RangeError('Invalid palette');
 const shade=(amount:number)=>{const neutral='#'+[1,3,5].map(i=>{const v=parseInt(base.slice(i,i+2),16);return Math.round(amount<0?v*(1+amount):v+(255-v)*amount).toString(16).padStart(2,'0')}).join('');
 if(!amount||!temperature)return neutral;
 const warm=amount*temperature>0;
 return blendAppearance(warm?'#ffb76b':'#6884d4',neutral,Math.abs(temperature*amount)*.35);
 };
 return [{role:'Sombra profunda',hex:shade(-.65*contrast)},{role:'Sombra',hex:shade(-.35*contrast)},{role:'Base',hex:base.toLowerCase()},{role:'Luz',hex:shade(.35*contrast)},{role:'Brilho',hex:shade(.7*contrast)}];
}
