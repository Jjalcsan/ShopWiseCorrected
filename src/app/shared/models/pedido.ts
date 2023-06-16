export class Pedido {
    unidades: number;
    precio: number;
    envio: string;
  
    constructor(unidades: number, precio: number, envio: string) {
      this.unidades = unidades;
      this.precio = precio;
      this.envio = envio;
    }
  }