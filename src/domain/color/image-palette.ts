export function dominantColors(data:Uint8ClampedArray,limit=8){
 const bins=new Map<number,{count:number;r:number;g:number;b:number}>();
 const stride=Math.max(1,Math.ceil(data.length/4/100000))*4;
 for(let i=0;i+3<data.length;i+=stride){const r=data[i]!,g=data[i+1]!,b=data[i+2]!;if(data[i+3]!<128)continue;const key=((r>>5)<<6)|((g>>5)<<3)|(b>>5);const bin=bins.get(key)??{count:0,r:0,g:0,b:0};bin.count++;bin.r+=r;bin.g+=g;bin.b+=b;bins.set(key,bin)}
 return [...bins.values()].sort((a,b)=>b.count-a.count).slice(0,limit).map(v=>'#'+[v.r,v.g,v.b].map(n=>Math.round(n/v.count).toString(16).padStart(2,'0')).join(''));
}
