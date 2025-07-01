import minimist from "minimist";
import { PelisController } from "./controllers";

function parseaParams(argv) { // Parsea los argumentos y valores ingresados
  const resultado = minimist(argv);
  return resultado;
}

async function main() {
  const params = parseaParams(process.argv.slice(2));
  const controller = new PelisController();

  if (params._ == "add") {
    const newPeli = {
      id: params.id,
      title: params.title,
      tags: params.tags,
    };
    console.log(await controller.add(newPeli));
  } else if (params._ == "get") {
    console.log(await controller.get({ id: params.id }));
  } else if (params._ == "search") {
    if (params.title && params.tags) {
      const newSearch = {
        search: {
          title: params.title,
          tag: params.tags,
        },
      };
      console.log(await controller.get(newSearch));
    } else if (params.title) {
      const newSearch = {
        search: {
          title: params.title,
        },
      };
      console.log(await controller.get(newSearch));
    } else if (params.tag) {
      const newSearch = {
        search: {
          tag: params.tag,
        },
      };
      console.log(await controller.get(newSearch));
    }
  } else if (!params._.length) { // Verifica que no se haya ingresado ningúna acción
    console.log(await controller.getAll());
  }
}
main();
