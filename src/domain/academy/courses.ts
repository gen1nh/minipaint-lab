export type Lesson={id:string;title:string;summary:string;materials:string[];exercise:string;colors?:string[];video?:{id:string;creator:string;title:string}};
export type Course={id:string;title:string;lessons:Lesson[]};
export const courses:Course[]=[
 {id:'fundamentos',title:'Fundamentos da pintura',lessons:[
 {id:'prep',title:'Preparação e primer',summary:'Limpe a peça, remova rebarbas e aplique primer em camadas finas.',materials:['Primer compatível com o material','Lixa fina','Pincel'],exercise:'Prepare uma peça de teste e confira a cobertura após secar.'},
 {id:'base',title:'Camadas de base',summary:'Aplique camadas finas e deixe secar entre aplicações.',materials:['Tinta acrílica','Pincel','Água ou diluente compatível'],exercise:'Compare duas camadas finas com uma camada espessa.'}]},
 {id:'cel',title:'Cel shading anime 2D',lessons:[
 {id:'values',title:'Luz e sombra chapadas',summary:'Escolha uma direção de luz e separe a superfície em áreas de valor bem definido.',materials:['Pincel de ponta fina','Tinta acrílica','Paleta'],colors:['#8c3816','#d46b26','#f3a45e'],exercise:'Pinte uma esfera com três valores sem degradê.'},
 {id:'lines',title:'Contornos e line art',summary:'Use linhas seletivas para separar formas e reforçar áreas de oclusão.',materials:['Pincel fino','Tinta escura'],exercise:'Contorne apenas as divisões que precisam de contraste.'}]},
 {id:'realismo',title:'Realismo',lessons:[{id:'layers',title:'Transições e volume',summary:'Construa transições graduais respeitando o volume e a direção da luz.',materials:['Pincel macio','Tintas acrílicas','Paleta úmida'],exercise:'Pinte uma esfera com cinco valores e suavize as transições.'}]}
];
