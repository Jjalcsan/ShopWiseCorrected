import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../shared/models/usuario';
import { Pedido } from '../shared/models/pedido';
import { DatosService } from '../shared/services/datos.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.page.html',
  styleUrls: ['./resumen.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ResumenPage implements OnInit {


  subscription!: Subscription //Variable subscription que utiliza la libreria de rxjs
  usuario!: string | null ;   //Variable para igualarla al usuario del LocalStorage
  private usuariosUrl = 'http://localhost:3000';  //La ruta comun a todas las peticiones
  cantidad: any;  //Variable para igualarla al valor del datos service
  precio: any;    //Variable para igualarla al valor del datos servie
  opcionSeleccionada!: string;  //Recoge la opcion de envio seleccionada en el archivo HTML

  constructor(private router : Router, private http : HttpClient, private datos : DatosService) { }

  ngOnInit() {
    this.usuario = this.obtenerUsuarioLocalStorage();  //Obtiene al usuario del LocalStorage y lo almacena en la variable usuario
    this.buscarUsuarioPorNick(this.usuario!)  //Busca al usuario mediante el nick almacenado en LocalStorage para obtener todos sus datos
    //Subscripcion de estas dos variables a sus variables correspondientes en el datos service
    this.subscription = this.datos.unidades$.subscribe(unidades => {this.cantidad=unidades})
    this.subscription = this.datos.precio$.subscribe(precio => {this.precio=precio})
  }

  //Busca al usuario por su nick para obtener todos sus datos
  async buscarUsuarioPorNick(nick: string): Promise<Usuario | null> {
    try {
      const url = `${this.usuariosUrl}/usuarios?nick=${nick}`;
      const response = await this.http.get<Usuario[]>(url).toPromise();
      const usuarioEncontrado = response![0]; //Suponemos que el nick es único, por lo tanto, obtenemos el primer elemento del array
      console.log(usuarioEncontrado.pedidos)
      if (usuarioEncontrado) {
        this.subscription = this.datos.unidades$.subscribe(unidades => {this.cantidad=unidades})
        this.subscription = this.datos.precio$.subscribe(precio => {this.precio=precio})
        console.log(this.precio)
        return usuarioEncontrado;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  //Metodo para completar el pedido y redirigirnos al inicio
  async completarPedido(nick: string | null, unidades: number, precio: number, envio: string): Promise<void> {
    try {
      if(this.opcionSeleccionada!=null){
        //Estructura condicional para añadir al precio global el precio de la opcion de envio seleccionada
        if(this.opcionSeleccionada=="normal"){
          this.precio = precio + 1.5;
        } else if (this.opcionSeleccionada=="express") {
          this.precio = precio + 3.0;
        } else if (this.opcionSeleccionada=="urgente") {
          this.precio = precio + 5.0;
        }

        const url = `${this.usuariosUrl}/usuarios?nick=${nick}`;
        const response = await this.http.get<Usuario[]>(url).toPromise();
        const usuarioEncontrado = response![0]; //Suponemos que el nick es único, por lo tanto, obtenemos el primer elemento del array

        const nuevoPedido = new Pedido(unidades, precio, envio);
  
        //Agregamos el nuevo pedido a la lista de pedidos del usuario
        usuarioEncontrado.pedidos.push(nuevoPedido)
        console.log(usuarioEncontrado)

        //Actualiza el JSON con los cambios
        await this.http.put(`${this.usuariosUrl}/usuarios?nick=${nick}`, usuarioEncontrado).toPromise();

      } else {
        window.alert("Debes escoger un metodo de envio")
      }
  
    } catch (error) {
      console.error('Error al completar el pedido:', error);
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
  //Nos redirige al inicio
  navigateToInicio(){
    this.router.navigate(['inicio'])
  }

}
