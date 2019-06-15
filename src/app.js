const express = require ("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const fs = require("fs");

require("./helpers");

const dirNode_modules = path.join(__dirname , '../node_modules');
const dirpublico = path.join(__dirname, "../public");
const dirpartials = path.join(__dirname, "../partials");

hbs.registerPartials(dirpartials);

app.use(express.static(dirpublico));
app.use(bodyParser.urlencoded({extended:false}));

app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

app.set ("view engine", "hbs");


app.get ("/", (req, res) =>{
  res.render("index",{
    titulo: "INICIO"
  });
});


app.get ("/crear", (req, res) =>{
  res.render("crear",{
    titulo: "Crear Curso"
  });
});

const listar_cursos = () => {
  try{
    listaCursos = JSON.parse(fs.readFileSync("./cursos.json"));
} catch (error) {
  listaCursos = [];
}
};

const guardar_curso = () => {
  let datos = JSON.stringify(listaCursos);
  fs.writeFile("cursos.json", datos, (err) => {
    if(err) throw (err);
  });
};

app.post ("/creado", (req, res) =>{
  listar_cursos();

  let nuevo = {
    id: parseInt(req.body.id),
    nombre: req.body.nombre,
    modalidad: req.body.modalidad,
    valor: parseInt(req.body.valor),
    descripcion: req.body.descripcion,
    intensidad: parseInt(req.body.intensidad),
    estado:"Disponible"
  };

  let duplicado = listaCursos.find(num => num.id == nuevo.id);

  if(!duplicado){
    listaCursos.push(nuevo);
    guardar_curso();
    res.render("creado",{
      titulo: "Verifiación Curso Nuevo",
      enunciado: "¡Curso creado con éxito!"
    });
  }
  else{
    res.render("no_creado",{
      titulo: "Verifiación Curso Nuevo",
      enunciado: "Lo sentimos, el ID del curso registrado está repetido :("
    });
  }


});


app.get("/cursos", (req, res) => {
  res.render("cursos", {
    titulo: "Cursos Disponibles"
  });
});

app.post("/info", (req, res) => {
  let curso = req.body.curso;

  if (curso == "Selecciona...") {
    res.render("cambiado_1",{
      titulo: "No has seleccionado ningún curso",
      enunciado: "No has seleccionado ningún curso, vuelve a intentarlo :("
    });
  }
  else{
    listar_cursos();

    let texto = "<th> ID </th>" +
                  "<th> Nombre </th>" +
                  "<th> Modalidad </th>" +
                  "<th> Valor </th>" +
                  "<th> Descripción </th>" +
                  "<th> Intensidad </th>" +
                  "<th> Estado </th>" +
                  "</thead>" +
                  "<tbody>";

    listaCursos.forEach(c => {
      if(c.nombre == curso){
      texto = texto +
              "<tr>" +
              "<td>" + c.id + "</td>" +
              "<td>" + c.nombre + "</td>" +
              "<td>" + c.modalidad + "</td>" +
              "<td>" + c.valor  + " $" + "</td>" +
              "<td>" + c.descripcion + "</td>" +
              "<td>" + c.intensidad + "</td>" +
              "<td>" + c.estado + "</td>" +
              "</tr>";
      }
    });

    texto = texto + "</tbody></table>";

    res.render("info", {
      titulo: "Información del Curso",
      enunciado: "Información del curso de " + curso,
      lista:texto
    });

  }

});


app.get("/inscribir", (req, res) => {
  res.render("inscribir", {
    titulo: "Inscripción"
  });
});

const listar_estudiantes = () => {
  try{
    listaEstudiantes = JSON.parse(fs.readFileSync("./estudiantes.json"));
} catch (error) {
  listaEstudiantes = [];
}
};

const guardar_estudiante = () => {
  let datos = JSON.stringify(listaEstudiantes);
  fs.writeFile("estudiantes.json", datos, (err) => {
    if(err) throw (err);
  });
};

app.post("/registrado", (req, res) => {
  listar_estudiantes();
  let aspirante = {
    nombre: req.body.nombre,
    di: parseInt(req.body.di),
    correo: req.body.correo,
    telefono: parseInt(req.body.telefono),
    curso: req.body.curso
  };

  duplicado = listaEstudiantes.find(identidad => identidad.di == aspirante.di);

  if (aspirante.curso == "Selecciona..."){
    res.render("no_registrado", {
      titulo: "No ingresaste ningún curso",
      enunciado: "No ingresaste ningún curso, vuelve a intentarlo"
    });
  }

  else{
    if (!duplicado) {

      listaEstudiantes.push(aspirante);
      guardar_estudiante();

      res.render("registrado", {
        titulo: "¡Registrado!",
        enunciado: "Tuviste un registro exitoso en el curso de " + aspirante.curso
      });
    }
    else {
      res.render("no_registrado", {
        titulo: "Ya te registraste",
        enunciado: "Ya te registraste a este curso, prueba con uno distinto"
      });
    }
  }


});


app.get("/editar", (req, res) => {
  res.render("editar", {
    titulo: "Editor de cursos"
  });
});

app.post("/informacion", (req,res) => {
  let curso = req.body.curso;

  if (curso == "Selecciona...") {
    res.render("cambiado",{
      titulo: "No has seleccionado ningún curso",
      enunciado: "No has seleccionado ningún curso, vuelve a intentarlo :("
  });
}
else {
  listar_cursos();

  let texto_1 = "<th> ID </th>" +
                "<th> Nombre </th>" +
                "<th> Modalidad </th>" +
                "<th> Valor </th>" +
                "<th> Descripción </th>" +
                "<th> Intensidad </th>" +
                "<th> Estado </th>" +
                "</thead>" +
                "<tbody>";

  listaCursos.forEach(c => {
    if(c.nombre == curso){
    texto_1 = texto_1 +
            "<tr>" +
            "<td>" + c.id + "</td>" +
            "<td>" + c.nombre + "</td>" +
            "<td>" + c.modalidad + "</td>" +
            "<td>" + c.valor  + " $" + "</td>" +
            "<td>" + c.descripcion + "</td>" +
            "<td>" + c.intensidad + "</td>" +
            "<td>" + c.estado + "</td>" +
            "</tr>";
    }
  });

  texto_1 = texto_1 + "</tbody></table>";

  listar_estudiantes();

  let texto = "<th> Nombre </th>" +
              "<th> Documento de Identidad </th>" +
              "</thead>" +
              "<tbody>";

  let alguien = listaEstudiantes.find(a => a.curso == curso);

  if (!alguien){
    texto = "No hay estudiantes en este curso";
  }
  else{
    listaEstudiantes.forEach(estudiante => {
      if(estudiante.curso == curso){
      texto = texto +
              "<tr>" +
              "<td>" + estudiante.nombre + "</td>" +
              "<td>" + estudiante.di + "</td>" +
              "</tr>";
      }
    });

    texto = texto + "</tbody></table>";
  }

    res.render("informacion", {
      titulo: "Información del Curso",
      enunciado: "Información del curso de " + curso,
      lista:texto,
      lista_1:texto_1
    });

  }

});

app.post("/cambiado",(req, res) => {
  let curso = req.body.curso;

  if (curso == "Selecciona...") {
    res.render("cambiado",{
      titulo: "No has seleccionado ningún curso",
      enunciado: "No has seleccionado ningún curso, vuelve a intentarlo :("
  });
}

  else {

  listar_cursos();

  listaCursos.forEach(c => {
    if (c.nombre == curso) {

      if(c.estado == "Disponible"){
        c.estado = "Cerrado";
        guardar_curso();

        res.render("cambiado",{
          titulo: "Curso Cerrado",
          enunciado: "Has cerrado el curso de " + curso
        });

      }
      else{
        c.estado = "Disponible";
        guardar_curso();

        res.render("cambiado",{
          titulo: "Curso Abierto",
          enunciado: "Has abierto el curso de " + curso
        });

      }

    }
  });
}
});

app.post("/eliminar", (req,res) => {
  let curso = req.body.curso;
  let nombre = req.body.nombre;
  let di = req.body.di;

  if (curso == "Selecciona...") {
    res.render("cambiado",{
      titulo: "No has seleccionado ningún curso",
      enunciado: "No has seleccionado ningún curso, vuelve a intentarlo :("
  });
}
else{

  listar_estudiantes();

  let actualizacion = listaEstudiantes.filter (e => (e.di+e.nombre+e.curso != di+nombre+curso));

  if(actualizacion.length == listaEstudiantes.length) {
        res.render("cambiado",{
        titulo: "El estudiante no está registrado",
        enunciado: "El estudiante no está registrado, no lo puedes eliminar :("
      });
  }
  else{

    listaEstudiantes = actualizacion;
    guardar_estudiante();


    let texto = "<th> Nombre </th>" +
                "<th> Documento de Identidad </th>" +
                "</thead>" +
                "<tbody>";

    let alguien = listaEstudiantes.find(a => a.curso == curso);

    if (!alguien){
      texto = "No hay estudiantes en este curso";
    }
    else{
      listaEstudiantes.forEach(estudiante => {
        if(estudiante.curso == curso){
        texto = texto +
                "<tr>" +
                "<td>" + estudiante.nombre + "</td>" +
                "<td>" + estudiante.di + "</td>" +
                "</tr>";
        }
      });

      texto = texto + "</tbody></table>";
    }

    res.render("eliminar", {
      titulo: "Estudiante Eliminado",
      enunciado: "Has eliminado a " + nombre + " del curso de " + curso,
      lista:texto
      });
    }

  }
});


app.listen(3000, function () {
  console.log("Servidor en el puerto 3000");
});
