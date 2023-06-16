import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';

@Injectable({
    providedIn: 'root'
  })

  //Servicio utilizado para la verificacion de los datos introducidos por el usuario tanto al realizar login como al registrarse
  export class AuthenticationService {

    //Dejamos la ruta de los usuarios del json como una propiedad ya que siempre será la misma
    private usuariosUrl = 'http://localhost:3000/usuarios';
  
    constructor(private http : HttpClient) { }
  
    //Este método comprobará que los datos introducidos en el login
    //Este método lo he hecho utilizando el XMLHttpRequest al contrario que el de registro para probar las dos maneras
    async verificarLogin(nick: string, contrasenia: string): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', this.usuariosUrl, true);
        xhr.onload = () => {
          if (xhr.status === 200) {
            const usuarios = JSON.parse(xhr.responseText);
            const usuarioEncontrado = usuarios.find(
              (usuario: { nick: string; contrasenia: string; }) => usuario.nick === nick && usuario.contrasenia === contrasenia
            );
            resolve(!!usuarioEncontrado);
          } else {
            console.error('Error al verificar el inicio de sesión:', xhr.statusText);
            resolve(false);
          }
        };
        xhr.onerror = () => {
          console.error('Error al verificar el inicio de sesión:', xhr.statusText);
          reject(xhr.statusText);
        };
        xhr.send();
      });
    }

    //Este método comprobará que el usuario introducido no está ya registrado, en caso de no estarlo creará el nuevo usuario
    //Este método al contrario que el anterior utiliza la librería HttpClient para realizar peticiones a una API o a un json como es nuestro caso
    async registrarUsuario(nick: string, contraseña: string, nombre: string): Promise<boolean> {
      try {
        const usuarios = await this.http.get<any[]>(this.usuariosUrl).toPromise();
    
        const usuarioExistente = usuarios?.find((usuario) => usuario.nick === nick);
        
        if (usuarioExistente) {
          window.alert('El usuario ya existe. Registro fallido.');
          return false;
        }
    
        const nuevoUsuario = new Usuario(nick, contraseña, nombre);
    
        await this.http.post(this.usuariosUrl, nuevoUsuario).toPromise();

        return true;
      } catch (error) {
        window.alert('Ha ocurrido un error en el registro')
        console.error('Error al registrar el usuario:', error);
        return false;
      }
    }
    
    
  }