function channels(hex:string){if(!/^#[0-9a-f]{6}$/i.test(hex))throw new RangeError('Invalid color');return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255)}
const linear=(v:number)=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4;
const srgb=(v:number)=>v<=.0031308?12.92*v:1.055*v**(1/2.4)-.055;
export function blendAppearance(foreground:string,background:string,coverage:number){
 if(!Number.isFinite(coverage)||coverage<0||coverage>1)throw new RangeError('Invalid coverage');
 const a=channels(foreground),b=channels(background);
 return '#'+a.map((v,i)=>Math.round(255*srgb(linear(v)*coverage+linear(b[i]!)*(1-coverage))).toString(16).padStart(2,'0')).join('');
}
export function layerCoverage(perLayer:number,layers:number){if(!Number.isFinite(perLayer)||perLayer<0||perLayer>1||!Number.isSafeInteger(layers)||layers<1||layers>20)throw new RangeError('Invalid layers');return 1-(1-perLayer)**layers}
