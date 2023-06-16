import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage implements OnInit {

  constructor(private router : Router, private authService : AuthenticationService) { }

   //Inicializamos las variables vacías que el usuario rellenará al registrarse 
  usuario : string = '';
  contra : string = '';
  nombre : string = '';

  ngOnInit() {
  }

  //Función que se lanzará cuando el usuario pulse el boton de registrarse, si los datos son correctos se le devolverá al login
  //Si no lo son, se le mostrará un mensaje de error
  async register() {

    //Se llama al método para registrar un nuevo usuario desde el servicio authentication service
    const usuarioValido = await this.authService.registrarUsuario(this.usuario, this.contra, this.nombre);

    //Si los datos son correctos y el nick de usuario no existe se creará la cuenta
    if (usuarioValido) {
      this.navigateToLogin();
      window.alert("Usuario creado correctamente, puedes iniciar sesion")
    } else {
      window.alert('Credenciales incorrectas. Inicio de sesión fallido.');
    }
  }

  //Funcion para redirigir el usuario a la aplicacion si el login es correcto
  navigateToInicio(){
    this.router.navigate(['inicio']);
  }

  //Funcion para redirigir el usuario a la pantalla de registro
  navigateToLogin(){
    this.router.navigate(['login']);
  }
}
