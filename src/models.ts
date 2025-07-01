import * as jsonfile from "jsonfile";
// El siguiente import no se usa pero es necesario
import * as _ from "lodash";
// de esta forma Typescript se entera que tiene que incluir
// el .json y pasarlo a la carpeta /dist
// si no, solo usandolo desde la libreria jsonfile, no se dá cuenta

// no modificar estas propiedades, agregar todas las que quieras
type SearchOptions = {
  title?: string;
  tag?: string;
};

class Peli {
  id: number;
  title: string;
  tags: string[];
}

class PelisCollection {
  
  async getAll(): Promise<Peli[]> {
    return await jsonfile.readFile(__dirname + "/pelis.json");
  }

  async add(peli: Peli): Promise<boolean> {
    const pelis = await jsonfile.readFile(__dirname + "/pelis.json");
    const promesaUno = this.getById(peli.id).then((peliExiste) => {
      if (peliExiste) {
        return false;
      } else {
        const data = [...pelis, peli];
        const promesaDos = jsonfile.writeFile(__dirname + "/pelis.json", data);
        return promesaDos.then(() => {
          return true;
        });
      }
    });
    return promesaUno;
  }

  async getById(id: number): Promise<Peli> {
    const pelis = await jsonfile.readFile(__dirname + "/pelis.json");
    const found = _.find(pelis, { id: id });
    return found;
  }

  async search(options: SearchOptions): Promise<Peli[]> {
    const lista = await this.getAll();

    const funcFoundTitle = (listTitle: string, optionsTitle: string) => { // Verifica si la peli incluye los carácteres buscados
      return _.includes(_.lowerCase(listTitle), _.lowerCase(optionsTitle));
    };

    const funcFoundTag = (listTag: string[], optionsTag: string) => { // Verifica si la peli incluye el tag buscado
      let foundTag = false;
      for (const tag of listTag) {
        foundTag = optionsTag == tag ? (foundTag = true) : foundTag;
      }
      return foundTag;
    };

    const listraFiltrada = lista.filter(function (p) {
      let esteVa = false;
      if (options.tag && options.title) { // Si se busca por título y tag
        const foundTag = funcFoundTag(p.tags, options.tag);
        const foundTitle = funcFoundTitle(p.title, options.title);
        foundTitle && foundTag ? (esteVa = true) : esteVa;
      } else if (options.tag) { // Si se busca por tag
        funcFoundTag(p.tags, options.tag) ? (esteVa = true) : esteVa;
      } else if (options.title) { // Si se busca por título
        funcFoundTitle(p.title, options.title) ? (esteVa = true) : esteVa;
      }
      return esteVa;
    });
    return listraFiltrada;
  }
}


export { PelisCollection, Peli };
