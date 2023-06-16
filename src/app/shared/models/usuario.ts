import { Pedido } from "./pedido";

export class Usuario {
    nick: string;
    contrasenia: string;
    nombre: string;
    pedidos: Pedido[];
  
    constructor(nick: string, contrasenia: string, nombre: string) {
      this.nick = nick;
      this.contrasenia = contrasenia;
      this.nombre = nombre;
      this.pedidos = [];
    }
  }