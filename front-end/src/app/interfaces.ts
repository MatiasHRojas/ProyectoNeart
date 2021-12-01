export interface Artista {
    id:number;
    username:string;
    nombre:any;
    descripcion:any;
    img:any;
}

export interface Noticia{
    id:number,
    titulo:string,
    bajada:string,
    contenido:string,
    destacada:boolean,
    imgHome:string, //imagen que aparece en el apartado news de Home
    imgNoticia:string, //imagen completa que aparece al leer la noticia
    imgBanner:string //imagen cuadrada para los banners de otras noticias
}

export interface Team{
    nombre:string,
    ocupacion:string,
    foto:string
}

export interface Username{
    username:string;
}

export interface Usuario{
    username:string;
    email:string;
    password:string;
    profile:number;
}

export interface LogIn{
    username:string;
    password:string;
}