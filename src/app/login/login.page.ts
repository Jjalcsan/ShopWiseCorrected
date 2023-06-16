import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  constructor(private router : Router, private authService : AuthenticationService) { }

  //Inicializamos las variables vacías que el usuario rellenará al acceder
  usuario : string = '';
  contra : string = '';

  ngOnInit() {
  }

  //Función que se lanzará cuando el usuario pulse el boton de acceder, si es login es correcto accederá al inicio
  //Si no lo es, se le mostrará un mensaje de error
  async login() {

    //Se llama al método para verificar el login desde el servicio authentication service
    const usuarioValido = await this.authService.verificarLogin(this.usuario, this.contra);

    //Si el usuario es correcto accederá y su nick se guardará en LocalStorage
    if (usuarioValido) {
      localStorage.setItem("usuario", this.usuario)
      this.navigateToInicio()
    } else {
      window.alert('Los datos no pertenecen a ningun usuario.');
    }
  }

  //Funcion para redirigir el usuario a la aplicacion si el login es correcto
  navigateToInicio(){
    this.router.navigate(['inicio']);
  }

  //Funcion para redirigir el usuario a la pantalla de registro
  navigateToRegister(){
    this.router.navigate(['register']);
  }

}
