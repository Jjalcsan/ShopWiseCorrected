import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../shared/models/usuario';
import { Pedido } from '../shared/models/pedido';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class InicioPage implements OnInit {

  //Declaramos la variable de usuario y la de pedidos inicializandola como null asi como usuariosUrl para hacer una ruta comun a todas las peticiones
  usuario: string | null;
  pedidos: any = null;
  private usuariosUrl = 'http://localhost:3000';

  constructor(private router : Router, private http : HttpClient) { 
    //Siempre se iguala la variable usuario a la que haya en el LocalStorage
    this.usuario = this.obtenerUsuarioLocalStorage();
  }

  ngOnInit() {
    //Ejecuta la funcion en el inicio para recoger los pedidos del usuario
    this.obtenerPedidos()
  }

  //Obtiene al usuario del LocalStorage y lo guarda en la variable usuario
  obtenerUsuarioLocalStorage(): string | null {
    const usuario = localStorage.getItem('usuario');
    return usuario;
  }

  //Funcion para obtener los pedidos del usuario especificado en la ruta de la peticion mediante el nick que haya en el LocalStorage
  async obtenerPedidos() {
    try {

      const url = `${this.usuariosUrl}/usuarios?nick=${this.usuario}`;
      const response = await this.http.get<Usuario[]>(url).toPromise();
      const usuarioEncontrado = response![0]; //Suponemos que el nick es único, por lo tanto, obtenemos el primer elemento del array

      this.pedidos = usuarioEncontrado.pedidos

      return this.pedidos;
    } catch (error) {
      window.alert('Ha ocurrido un error')
      return false;
    }
  }

  //Este metodo borra el pedido indicado por su id de la lista de pedidos del usuario
  async borrarPedido(id: Pedido){
    const url = `${this.usuariosUrl}/usuarios?nick=${this.usuario}`;
    const response = await this.http.get<Usuario[]>(url).toPromise();
    const usuarioEncontrado = response![0]; //Suponemos que el nick es único, por lo tanto, obtenemos el primer elemento del array
    if (usuarioEncontrado) {
      //Obtiene el índice del pedido encontrado en la lista de pedidos del usuario
      const indicePedido = usuarioEncontrado.pedidos.indexOf(id);
      
      //Borra el pedido de la lista de pedidos del usuario
      usuarioEncontrado.pedidos.splice(indicePedido, 1);
      try {
        //Hace la petición DELETE al endpoint del json-server
        const response = await fetch(`http://localhost:3000/usuarios?nick=${this.usuario}/pedidos/${id}`, {
          method: 'DELETE'
        });
    
        if (response.ok) {
          console.log(`Pedido con ID ${id} borrado correctamente.`);
        } else {
          console.log(`Error al borrar el pedido con ID ${id}.`);
        }
      } catch (error) {
        console.error('Error al realizar la petición DELETE:', error);
      }
    }
  }

  //Cierra la sesion, borrando el usuario del LocalStorage y redirigiendonos al login
  cerrarSesion() {
    localStorage.removeItem("usuario");
    this.navigateToLogin();
  }

  //Nos redirige al login
  navigateToLogin(){
    this.router.navigate(['']);
  }

  //Nos redirige al catalogo de productos
  navigateToCatalogo(){
    this.router.navigate(['catalogo']);
  }


}
