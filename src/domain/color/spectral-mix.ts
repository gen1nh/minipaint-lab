import {Color,mix} from 'spectral.js';
export type Pigment = {hex:string;drops:number;tintingStrength?:number};
export function mixPigments(pigments: readonly Pigment[]): string {
 if (!pigments.length || pigments.some(p=>!/^#[0-9a-f]{6}$/i.test(p.hex)||!Number.isSafeInteger(p.drops)||p.drops<1||!Number.isFinite(p.tintingStrength??1)||(p.tintingStrength??1)<=0)) throw new RangeError('Invalid pigment');
 const first=pigments[0]!;
 if(pigments.every(p=>p.hex.toLowerCase()===first.hex.toLowerCase())) return first.hex.toLowerCase();
 const colors=pigments.map((p):[Color,number]=>{const color=new Color(p.hex);color.tintingStrength=p.tintingStrength??1;return [color,p.drops]});
 return mix(...colors).toString({format:'hex'}).toLowerCase();
}
