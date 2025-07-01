import { title } from "process";
import { PelisCollection, Peli } from "./models";

type Options = {
  id?: number;
  search?: {
    title?: string;
    tag?: string;
  };
};

class PelisController {
  model: PelisCollection;

  constructor() {
    this.model = new PelisCollection();
  }

  async get(options?: Options): Promise<Peli[]> {
    if (options.id) { // Si se busca por ID
      const res = await this.model.getById(options.id);
      return [res];
    } else if (options.search) { // Si se busca por title o tag
      if (options.search) {
        return this.model.search(options.search);
      }
    } else if (!options) { // Si no hay opciones, se devuelven todas las pelis
      return this.model.getAll();
    }
  }

  async getOne(options?: Options): Promise<Peli> {
    const res = await this.get(options);
    return res[0];
  }

  async add(peli: Peli) {
    const res = await this.model.add(peli);
    if (res) {
      return "Película agregada con éxito.";
    } else {
      return "La película ya existe en el sistema.";
    }
  }

  async getAll() {
    return await this.model.getAll();
  }
}

export { PelisController };
