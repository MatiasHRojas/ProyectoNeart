"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
var cors = require("cors");
var dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });
/*/
const formidable = require('formidable')
const form = new formidable.IncomingForm();
const fs = require('fs')
const path = require('path')
/*/
//mysql
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});
connection.connect(function (err) {
    if (err) {
        console.error('error conecting: ' + err.stack);
        return;
    }
    console.log("Conexion establecida");
});
//exportar para poder conectarse desde cualquier lugar del proyecto
//module.exports = connection;
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var configuracion = {
    hostname: "127.0.0.1",
    port: 3000,
};
// para encriptar contraseñas
//const bcryptjs = require('bcryptjs');
//
var session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
//CRUD: Create (post), Read (get), Update (put), Delete (delete)
app.use(cors());
//Autenticación LogIn
app.post('/Authenticate', jsonParser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, pass;
    return __generator(this, function (_a) {
        user = req.body.username;
        pass = req.body.password;
        //console.log("User: " + user + " | Pass: " + pass);
        connection.query('select * from usuarios where username=? and password=?', [user, pass], function (error, results, fields) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (error) {
                        console.log("- Error - \n" + error.stack);
                    }
                    if (results.length == 0) {
                        console.log('USER IS INCORRECT');
                        console.log(results);
                        console.log("Lenght: " + results.length);
                        res.send(false);
                    }
                    else {
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
                    return [2 /*return*/];
                });
            });
        });
        return [2 /*return*/];
    });
}); });
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
app.post('/session', jsonParser, function (req, res) {
    var userid = req.body.id;
    var username = req.body.name;
    var coneccion = true;
    connection.query('UPDATE sesion SET idUser = ?, username = ?, conectado = ?', [userid, username, coneccion], function (error, results, fields) {
        if (error) {
            console.log("- Error - \n" + error.stack);
        }
        else {
            console.log("* Se ha creado la sesión en BD *");
        }
    });
});
// Logout
app.post('/logout', function (req, res) {
    req.session.destroy();
    req.session = null;
    var userid = -1;
    var username = '';
    var coneccion = false;
    connection.query('UPDATE sesion SET idUser = ?, username = ?, conectado = ?', [userid, username, coneccion], function (error, results, fields) {
        if (error) {
            console.log("- Error - \n" + error.stack);
        }
        else {
            console.log("* Se ha creado la sesión en BD *");
        }
    });
    console.log("- Sesión Cerrada -");
});
// OBTENER USUARIOS 
app.get('/Usuarios', function (req, res) {
    connection.query("select * from usuarios", function (error, results, fields) {
        res.send(JSON.stringify(results));
    });
});
// OBTENER USUARIOS ARTISTAS
app.get('/UsuariosArtistas', function (req, res) {
    connection.query("select * from usuarios where profile=1", function (error, results, fields) {
        res.send(JSON.stringify(results));
    });
});
// OBTENER USERNAME 
app.get('/Username', function (req, res) {
    connection.query("select username from usuarios", function (error, results, fields) {
        res.send(JSON.stringify(results));
    });
});
// CARGAR IMAGENES GALERIA
app.get('/GalleryImages/:id', function (req, res) {
    var id = req.params.id;
    connection.query("select * from galeria where id = ?", id, function (error, results, fields) {
        res.send(JSON.stringify(results));
    });
});
// OBTENER IMAGEN PERFIL
app.get('/GetImgPerfil/:id', function (req, res) {
    var id = req.params.id;
    connection.query("select imagen from galeria where id = ? and posicion = 0", id, function (error, results, fields) {
        res.send(JSON.stringify(results));
    });
});
// GUARDAR IMAGENES EN BD
app.post('/SaveImg', jsonParser, function (req, res) {
    var id = req.body.id;
    var posicion = req.body.posicion;
    var imagen = req.body.imagen;
    connection.query("insert into galeria(id,posicion,imagen) values(?,?,?)", [id, posicion, imagen], function (error, results, fields) {
        res.send(JSON.stringify(results));
    });
});
// CONTAR EMAILS
app.get('/User/:email', function (req, res) {
    var email = req.params.email;
    connection.query("SELECT COUNT(*) FROM usuarios WHERE email = ?", email, function (error, results, fields) {
        res.send(JSON.stringify(results));
    });
});
// OBTENER EMAIL
app.get('/Email', function (req, res) {
    connection.query("select email from usuarios", function (error, results, fields) {
        res.send((JSON.stringify(results[0]['COUNT(*)'])));
    });
});
app.get('/IdArtistas', function (req, res) {
    connection.query("select id from artistas ", function (error, results, fields) {
        res.send(JSON.stringify(results));
    });
});
app.get('/Artista/:id', function (req, res) {
    var id = req.params.id;
    connection.query("select * from artistas where id = ?", id, function (error, results, fields) {
        res.send(JSON.stringify(results));
    });
});
app.get('/Artistas', function (req, res) {
    connection.query("select * from artistas", function (error, results, fields) {
        res.send(JSON.stringify(results));
    });
});
app.get('/Noticias', function (req, res) {
    connection.query("select * from noticias", function (error, results, fields) {
        res.send(JSON.stringify(results));
    });
});
app.get('/Noticias/:id', function (req, res) {
    var id = req.params.id;
    connection.query("select * from noticias where id = ?", id, function (error, results, fields) {
        res.send(JSON.stringify(results));
    });
});
app.get('/GetUsername/:id', function (req, res) {
    var id = req.params.id;
    connection.query("select username from usuarios where id=?", id, function (error, results, fields) {
        res.send(JSON.stringify(results));
    });
});
app.get('/Usuarios/:email', function (req, res) {
    var email = req.params.email;
    connection.query("select * from usuario where email=?", email, function (error, results, fields) {
        res.send(JSON.stringify(results));
    });
});
app.post('/CrearUsuarios', jsonParser, function (req, res) {
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var profile = req.body.profile;
    connection.query("insert into usuarios(username,email,password,profile) values(?,?,?,?)", [username, email, password, profile], function (error, results, fields) {
        if (error) {
            console.log("- Error al guardar - \n" + error.stack);
            res.send(false);
        }
        else {
            res.send(JSON.stringify(results));
            console.log(true);
        }
    });
});
app.post('/CrearArtista', jsonParser, function (req, res) {
    var id = req.body.id;
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    var img = req.body.img;
    connection.query("insert into artistas(id,nombre,descripcion,img) values(?,?,?,?)", [id, nombre, descripcion, img], function (error, results, fields) {
        if (error) {
            console.log("- Error al guardar - \n" + error.stack);
        }
        else {
            res.send(JSON.stringify(results));
            console.log("Artista Guardado");
        }
    });
});
app.post('/CrearGaleria', jsonParser, function (req, res) {
    var id = req.body.id;
    var posicion = req.body.posicion;
    var imagen = req.body.imagen;
    connection.query("insert into galeria(id,posicion,imagen) values(?,?,?)", [id, posicion, imagen], function (error, results, fields) {
        if (error) {
            console.log("- Error al guardar - \n" + error.stack);
        }
        else {
            res.send(JSON.stringify(results));
            console.log("Galería Guardada");
        }
    });
});
app.put('/Actualizar/:id', jsonParser, function (req, res) {
    var id = req.params.id;
    var usuario = req.body.usuario;
    var clave = req.body.clave;
    var correo = req.body.correo;
    console.log("Usuario: ".concat(usuario, " Clave: ").concat(clave, " Correo: ").concat(correo, " ID: ").concat(id));
    res.send("datos modificados");
});
app.put('/ActualizarImg', jsonParser, function (req, res) {
    var id = req.body.id;
    var posicion = req.body.posicion;
    var imagen = req.body.imagen;
    connection.query("UPDATE `galeria` SET `imagen`= ? WHERE `id` = ? AND `posicion` = ?", [imagen, id, posicion], function (error, results, fields) {
        if (error) {
            console.log("- Error al actualizar - \n" + error.stack);
        }
        else {
            res.send(JSON.stringify(results));
            console.log("Imagen Actualizada");
        }
    });
});
app.put('/ActualizarArtista', jsonParser, function (req, res) {
    var id = req.body.id;
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    connection.query("UPDATE `artistas` SET `nombre`= ?,`descripcion`= ? WHERE `id` = ?", [nombre, descripcion, id], function (error, results, fields) {
        if (error) {
            console.log("- Error al actualizar - \n" + error.stack);
        }
        else {
            res.send(JSON.stringify(results));
            console.log("Datos Actualizados");
        }
    });
});
app.delete('/Eliminar/:id', function (req, res) {
    var id = req.params.id;
    res.status(200).send("Se elimino el dato ".concat(id));
});
app.delete('/EliminarImg/:id/:posicion', function (req, res) {
    var id = req.params.id;
    var posicion = req.params.posicion;
    connection.query("DELETE FROM `galeria` WHERE id = ? AND posicion = ?", [id, posicion], function (error, results, fields) {
        if (error) {
            console.log("- Error al eliminar - \n" + error.stack);
        }
        else {
            res.send(JSON.stringify(results));
            console.log("Imagen Eliminada");
        }
    });
});
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
app.listen(configuracion, function () {
    console.log("Conectando al servidor http://localhost:".concat(configuracion.port));
});
