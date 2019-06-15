const fs = require("fs");
const hbs = require ("hbs");

const listar_cursos = () => {
  try{
    listaCursos = JSON.parse(fs.readFileSync("./cursos.json"));
} catch (error) {
  listaCursos = [];
}
};

hbs.registerHelper("listar", () => {
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
              //Esta es la estructura de una tabla. Vamos a organizar los datos de listado.json ahí

  listaCursos.forEach(curso => {
    if(curso.estado == "Disponible"){
    texto = texto +
            "<tr>" +
            "<td>" + curso.id + "</td>" +
            "<td>" + curso.nombre + "</td>" +
            "<td>" + curso.modalidad + "</td>" +
            "<td>" + curso.valor + " $" + "</td>" +
            "<td>" + curso.descripcion + "</td>" +
            "<td>" + curso.intensidad + "</td>" +
            "<td>" + curso.estado + "</td>" +
            "</tr>";
    }
  });

  texto = texto + "</tbody></table>";

  return texto;

});

hbs.registerHelper("listar_sencillo", () => {
  listar_cursos();
  let texto = "<th> Nombre </th>" +
              "<th> Descripción </th>" +
              "<th> Valor </th>" +
              "</thead>" +
              "<tbody>";
              //Esta es la estructura de una tabla. Vamos a organizar los datos de listado.json ahí

  listaCursos.forEach(curso => {
    if(curso.estado == "Disponible"){
    texto = texto +
            "<tr>" +
            "<td>" + curso.nombre + "</td>" +
            "<td>" + curso.descripcion + "</td>" +
            "<td>" + curso.valor + " $" + "</td>" +
            "</tr>";
    }
  });

  texto = texto + "</tbody></table>";

  return texto;

});

const listar_estudiantes = () => {
  try{
    listaEstudiantes = JSON.parse(fs.readFileSync("./estudiantes.json"));
} catch (error) {
  listaEstudiantes = [];
}
};

hbs.registerHelper("opciones", () => {
  listar_cursos();
  let opciones;

  listaCursos.forEach(curso => {
    if(curso.estado == "Disponible"){
    opciones = opciones + "<option>" + curso.nombre + "</option>";
  }

});

  return opciones;

});

hbs.registerHelper("opciones_1", () => {
  listar_cursos();
  let opciones;

  listaCursos.forEach(curso => {
    opciones = opciones + "<option>" + curso.nombre + "</option>";
});

  return opciones;

});
