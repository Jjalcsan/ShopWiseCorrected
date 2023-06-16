import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//Este servicio se utiliza para transportar los valores del precio total y del total de unidades desde el catálogo hasta la factura para crear el nuevo pedido en el usuario
export class DatosService {

  //Creamos la variable pública de unidades para que pueda ser accesible desde todas las páginas
  public unidades = new BehaviorSubject<any>(null);
  unidades$ = this.unidades.asObservable();

  //Creamos la variable pública de precio para que pueda ser accesible desde todas las páginas
  public precio = new BehaviorSubject<any>(null);
  precio$ = this.precio.asObservable();

  //Este método será llamado desde el catálogo para guardar los valores de nuestra selección de productos
  setDatos(unidades: any, precio: any): void {
    this.unidades.next(unidades);
    this.precio.next(precio)
  }
}