import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatosService } from '../shared/services/datos.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CatalogoPage implements OnInit {

  //Declaramos la variable productos como un array, la variable usuario para igualarla a la del usuario del LocalStorage y la ruta del json
  productos: any[] | undefined;
  usuario!: string | null;
  private productosUrl = 'http://localhost:3000/productos';

  constructor(private http: HttpClient, private router : Router, private datos : DatosService) {}

  ngOnInit() {
    //Ejecutamos estas dos funciones en el inicio, la primera es para almacenar todos los productos en la variable productos, la segunda para guardar
    //al usuario en la variable usuario
    this.obtenerProductos();
    this.usuario = this.obtenerUsuarioLocalStorage();
  }

  //Este método se ejecuta al entrar en la vista, hace una peticion al json para obtener todos los productos y guardarlo en la variable productos
  async obtenerProductos() {
    try {
      this.productos = await this.http.get<any[]>(this.productosUrl).toPromise();

      console.log(this.productos)

      return this.productos;
    } catch (error) {
      window.alert('Ha ocurrido un error')
      return false;
    }
  }

  //Este método se ejecuta al pulsar el boton para ir a la factura, si no hay ninguna unidad seleccionada nos dara un mensaje de error
  calcularTotal(): void {
    let totalUnidadesCompradas = 0;
    let precioTotal = 0;

    //Hace la suma de todos los productos comprados multiplicandolo por su precio
    for (let producto of this.productos!) {
      if (producto.class && producto.class > 0) {
        totalUnidadesCompradas += producto.class;
        precioTotal += producto.precio * producto.class;
      }
    }

    //En caso de no haber productos nos dara un mensaje de error y no nos dejara continuar
    if(totalUnidadesCompradas==0){
      window.alert("Tienes que comprar alguna unidad de algun producto")
    //En caso contrario ejecutara la funcion setDatos de datos service para estipular los valores del precio total y el total de unidades y nos llevara a la factura
    }else{
      this.datos.setDatos(totalUnidadesCompradas, precioTotal)
      this.navigateToResumen()
    }
  }

  //Cierra la sesion, borrando el usuario del LocalStorage y redirigiendonos al login
  cerrarSesion() {
    localStorage.removeItem("usuario");
    this.navigateToLogin();
  }

  //Obtiene al usuario del LocalStorage y lo guarda en la variable usuario
  obtenerUsuarioLocalStorage(): string | null {
    const usuario = localStorage.getItem('usuario');
    return usuario;
  }

  //Nos redirige al login
  navigateToLogin(){
    this.router.navigate(['']);
  }

  //Nos redirige a la factura
  navigateToResumen(){
    this.router.navigate(['resumen']);
  }

}
