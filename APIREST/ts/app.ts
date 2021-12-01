const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json({limit: '50mb'}));

const cors = require("cors")
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

/*/
const formidable = require('formidable')
const form = new formidable.IncomingForm();
const fs = require('fs')
const path = require('path')
/*/

//mysql
const mysql=require("mysql");
let connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    port     : process.env.DB_PORT,
    database : process.env.DB_DATABASE,
});

connection.connect(function(err:any){
    if(err){
        console.error('error conecting: ' + err.stack);
        return;
    }
    console.log("Conexion establecida");
});

//exportar para poder conectarse desde cualquier lugar del proyecto
//module.exports = connection;

// create application/json parser
let jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });

const configuracion={
    hostname: "127.0.0.1",
    port: 3000,
}

// para encriptar contraseñas
//const bcryptjs = require('bcryptjs');

//
const session = require('express-session');
app.use(session({
    secret: 'secret', 
    resave: true,
    saveUninitialized: true
}))

//CRUD: Create (post), Read (get), Update (put), Delete (delete)
app.use(cors());

//Autenticación LogIn
app.post('/Authenticate', jsonParser, async(req:any, res:any)=>{
    let user:string = req.body.username;
    let pass:string = req.body.password; 
    //console.log("User: " + user + " | Pass: " + pass);
    connection.query('select * from usuarios where username=? and password=?',[user,pass], async function(error:any, results:any, fields:any){
        if (error) {
            console.log("- Error - \n" + error.stack);
        }
        if (results.length == 0) {
            console.log('USER IS INCORRECT');
            console.log(results);
            console.log("Lenght: " + results.length);
            res.send(false);
        }else{
            //crear la sesion
            req.session.loggedin = true;
            req.session.name = results[0].username;
            req.session.ident = results[0].id;
            req.session.type = results[0].profile;
            //
            console.log(results);
            console.log("Lenght: " + results.length);
            console.log('LOGIN CORRECTO');
            res.send(req.session);
        }
    }) 
    
})

// Autenticación en otras páginas
/*
app.get('/',(req:any, res:any) => {
    if(req.session.loggedin){
        res.send({
            login:true,
            name:req.session.name
        });
    }else{
        req.send({
            login:false,
            name:'Debe iniciar sesión.'
        });
    }
})*/

//crear sesion en la bd
app.post('/session', jsonParser,(req:any,res:any) =>{
    let userid:number = req.body.id;
    let username:string = req.body.name;
    let coneccion = true;
    connection.query('UPDATE sesion SET idUser = ?, username = ?, conectado = ?',[userid,username,coneccion], (error:any, results:any, fields:any)=>{
        if(error){
            console.log("- Error - \n" + error.stack);
        }else{
            console.log("* Se ha creado la sesión en BD *");
        }
    });
})

// Logout
app.post('/logout',(req:any,res:any) => {
    req.session.destroy();
    req.session = null;
    let userid:number = -1;
    let username:string = '';
    let coneccion = false;
    connection.query('UPDATE sesion SET idUser = ?, username = ?, conectado = ?',[userid,username,coneccion], (error:any, results:any, fields:any)=>{
        if(error){
            console.log("- Error - \n" + error.stack);
        }else{
            console.log("* Se ha creado la sesión en BD *");
        }
    });
    console.log("- Sesión Cerrada -");
})


// OBTENER USUARIOS 
app.get('/Usuarios', (req:any, res:any) => {
    connection.query("select * from usuarios", function(error:any, results:any, fields:any){
        res.send(JSON.stringify(results));
    });
})

// OBTENER USUARIOS ARTISTAS
app.get('/UsuariosArtistas', (req:any, res:any) => {
    connection.query("select * from usuarios where profile=1", function(error:any, results:any, fields:any){
        res.send(JSON.stringify(results));
    });
})

// OBTENER USERNAME 
app.get('/Username', (req:any, res:any) => {
    connection.query("select username from usuarios", function(error:any, results:any, fields:any){
        res.send(JSON.stringify(results));
    });
})

// CARGAR IMAGENES GALERIA
app.get('/GalleryImages/:id', (req:any, res:any) => {
    let id=req.params.id;
    connection.query("select * from galeria where id = ?", id, function(error:any, results:any, fields:any){
        res.send(JSON.stringify(results));
    });
})

// OBTENER IMAGEN PERFIL
app.get('/GetImgPerfil/:id', (req:any, res:any) => {
    let id=req.params.id;
    connection.query("select imagen from galeria where id = ? and posicion = 0", id, function(error:any, results:any, fields:any){
        res.send(JSON.stringify(results));
    });
})

// GUARDAR IMAGENES EN BD
app.post('/SaveImg', jsonParser, (req:any, res:any) => {
    let id=req.body.id;
    let posicion:number=req.body.posicion;
    let imagen=req.body.imagen;
    connection.query("insert into galeria(id,posicion,imagen) values(?,?,?)", [id,posicion,imagen], function(error:any,results:any,fields:any){
        res.send(JSON.stringify(results));
    });
});

// CONTAR EMAILS
app.get('/User/:email', (req:any, res:any) => {
    let email=req.params.email;
    connection.query("SELECT COUNT(*) FROM usuarios WHERE email = ?", email, function(error:any, results:any, fields:any){
        res.send(JSON.stringify(results));
    });
})

// OBTENER EMAIL
app.get('/Email', (req:any, res:any) => {
    connection.query("select email from usuarios", function(error:any, results:any, fields:any){
        res.send((JSON.stringify(results[0]['COUNT(*)'])));
    });
})

app.get('/IdArtistas', (req:any, res:any) => {
    connection.query("select id from artistas ", function(error:any, results:any, fields:any){
        res.send(JSON.stringify(results));
    });
})

app.get('/Artista/:id', (req:any, res:any) => {
    let id=req.params.id;
    connection.query("select * from artistas where id = ?", id, function(error:any, results:any, fields:any){
        res.send(JSON.stringify(results));
    });
})

app.get('/Artistas', (req:any, res:any) => {
    connection.query("select * from artistas", function(error:any, results:any, fields:any){
        res.send(JSON.stringify(results));
    });
})

app.get('/Noticias', (req:any, res:any) => {
    connection.query("select * from noticias", function(error:any, results:any, fields:any){
        res.send(JSON.stringify(results));
    });
})

app.get('/Noticias/:id', (req:any, res:any) => {
    let id = req.params.id;
    connection.query("select * from noticias where id = ?", id, function(error:any, results:any, fields:any){
        res.send(JSON.stringify(results));
    });
})

app.get('/GetUsername/:id', (req:any, res:any) => {
    let id=req.params.id;
    connection.query("select username from usuarios where id=?", id, function(error:any, results:any, fields:any){
        res.send(JSON.stringify(results));
    });
})

app.get('/Usuarios/:email', (req:any, res:any) => {
    let email=req.params.email;
    connection.query("select * from usuario where email=?", email, function(error:any, results:any, fields:any){
        res.send(JSON.stringify(results));
    });
})

app.post('/CrearUsuarios', jsonParser, (req:any, res:any) => {
    let email:string=req.body.email;
    let username:string=req.body.username;
    let password:string=req.body.password;
    let profile=req.body.profile;

    connection.query("insert into usuarios(username,email,password,profile) values(?,?,?,?)",[username,email,password,profile],function(error:any,results:any,fields:any){
        if(error){
            console.log("- Error al guardar - \n" + error.stack);
            res.send(false);
        }else{ 
            res.send(JSON.stringify(results));
            console.log(true);
        }
        
    });
});

app.post('/CrearArtista', jsonParser, (req:any, res:any) => {
    let id:string = req.body.id;
    let nombre:string = req.body.nombre;
    let descripcion:string = req.body.descripcion;
    let img=req.body.img;

    connection.query("insert into artistas(id,nombre,descripcion,img) values(?,?,?,?)",[id,nombre,descripcion,img],function(error:any,results:any,fields:any){
        if(error){
            console.log("- Error al guardar - \n" + error.stack);
        }else{ 
            res.send(JSON.stringify(results));
            console.log("Artista Guardado");
        }
        
    });
});

app.post('/CrearGaleria', jsonParser, (req:any, res:any) => {
    let id:number = req.body.id;
    let posicion:number = req.body.posicion;
    let imagen:string = req.body.imagen;

    connection.query("insert into galeria(id,posicion,imagen) values(?,?,?)",[id,posicion,imagen],function(error:any,results:any,fields:any){
        if(error){
            console.log("- Error al guardar - \n" + error.stack);
        }else{ 
            res.send(JSON.stringify(results));
            console.log("Galería Guardada");
        }
        
    });
});

app.put('/Actualizar/:id', jsonParser, (req:any, res:any) => {
    let id=req.params.id;
    let usuario=req.body.usuario;
    let clave=req.body.clave;
    let correo=req.body.correo;

    console.log(`Usuario: ${usuario} Clave: ${clave} Correo: ${correo} ID: ${id}`);
    res.send("datos modificados");
    
});

app.put('/ActualizarImg', jsonParser, (req:any, res:any) => {
    let id = req.body.id;
    let posicion = req.body.posicion;
    let imagen = req.body.imagen;

    connection.query("UPDATE `galeria` SET `imagen`= ? WHERE `id` = ? AND `posicion` = ?",[imagen,id,posicion],function(error:any,results:any,fields:any){
        if(error){
            console.log("- Error al actualizar - \n" + error.stack);
        }else{ 
            res.send(JSON.stringify(results));
            console.log("Imagen Actualizada");
        }
    })
    
});

app.put('/ActualizarArtista', jsonParser, (req:any, res:any) => {
    let id = req.body.id;
    let nombre = req.body.nombre;
    let descripcion = req.body.descripcion;

    connection.query("UPDATE `artistas` SET `nombre`= ?,`descripcion`= ? WHERE `id` = ?",[nombre,descripcion,id],function(error:any,results:any,fields:any){
        if(error){
            console.log("- Error al actualizar - \n" + error.stack);
        }else{ 
            res.send(JSON.stringify(results));
            console.log("Datos Actualizados");
        }
    })
});

app.delete('/Eliminar/:id', (req:any,res:any)=>{
    let id=req.params.id;
    res.status(200).send(`Se elimino el dato ${id}`);
})

app.delete('/EliminarImg/:id/:posicion', (req:any,res:any)=>{
    let id = req.params.id;
    let posicion = req.params.posicion;
    connection.query("DELETE FROM `galeria` WHERE id = ? AND posicion = ?",[id,posicion],function(error:any,results:any,fields:any){
        if(error){
            console.log("- Error al eliminar - \n" + error.stack);
        }else{ 
            res.send(JSON.stringify(results));
            console.log("Imagen Eliminada");
        }
    })
})

/* ------------------------------------------------------------ */
/*
app.post('/upload',jsonParser, (req:any,res:any)=>{

    const form = formidable({});
    if(form!=null && req!=null){    

    form.parse(req, function(err:any, fields:any, files:any) {
  
        // `file` is the name of the <input> field of type `file`
        if(files.file!=null){
            let old_path = files.file.filepath;
            let file_size = files.file.size;
            let file_ext = files.file.originalFilename.split('.').pop();
            let index = old_path.lastIndexOf('/') + 1;
            let file_name = old_path.substr(index);
            let new_path = __dirname+"/../../Images/src/assets/uploads/"+files.file,originalFilename;
        //let new_path = "/uploads/"+file_name + '.' + file_ext;
    
        console.log(old_path);
        
        fs.readFile(old_path, function(err:any, data:any) {
            fs.writeFile(new_path, data, function(err:any) {
                fs.unlink(old_path, function(err:any) {
                    console.log(new_path);
                    console.log(data);
                    if (err) {
                        res.status(500);
                        res.json({'success': false});
                    } else {
                    
                        //res.status(200);
                        //res.json({'success': true,'path':new_path});
                    }
                });
            });
        });
        res.json({fields, files});
    }
  });
} 
     
  });
  
  app.get('/files',(req:any,res:any,next:any)=>{
    const directoryPath = __dirname+"/../../front-end/src/assets/uploads/";
    fs.readdir(directoryPath, function (err:any, files:any) {
      if (err) {
        res.status(500).send({
          message: "Unable to scan files!",
        });
      }
      let fileInfos:any = [];
  
      files.forEach((file:any) => {
        fileInfos.push({
          name: file,
          url: "../../assets/uploads/" + file,
        });
      });
   
      res.status(200).send(fileInfos); 
    });  
  });
  
/* ------------------------------------------------------------ */

app.listen(configuracion, () => {
  console.log(`Conectando al servidor http://localhost:${configuracion.port}`)
})