import { Component, OnInit } from '@angular/core';
import {AuthService} from './auth.service'; //used to trigger the onLogin method
import { Router } from '@angular/router'; //used to navigate through pages
import {  FormControl, NgForm } from '@angular/forms';
import {LoadingController, ModalController} from '@ionic/angular';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import {PasswordStrengthValidator} from './password';

// var html = require('signup.html').default
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  formgroup: FormGroup;
  
isLoading = false; //set to false as a default
isLogin = true; //set to true as a default
  constructor( private authService: AuthService, private router : Router, private loadingCtrl: LoadingController,public modalController: ModalController,
    public formbuilder: FormBuilder) //Parameters injected to trigger the necessary methods
   {
    this.formgroup = this.formbuilder.group(
      {
        email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
        password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6),PasswordStrengthValidator.isValid]))
      }
    );
   
   
   }

  ngOnInit() {
  }
  onSubmit(form: NgForm){
    if (!form.valid) //Cannot proceed if the form is invalid.
    {
      return;
    }
    //If the form is valid, the email and password properties are extracted.
    const email = form.value.email;
    const password = form.value.password;
    

    if(this.isLogin)
    {
      //Send a request to login servers
      this.authService.login();
    }
  }
  onLogin()
  {
    this.isLoading = true;
    this.loadingCtrl.create({keyboardClose:true, message:'Logging in...'})
    .then(loadingEl=>{
      loadingEl.present();
      
      setTimeout(()=>{
        this.isLoading = false;
        loadingEl.dismiss();
      }, 1000)
      // this.authService.login();
    })
   
  }
  
   signUp(){
    this.router.navigateByUrl('/register')
    }  }
  
 
 
    // createAccount(){
    //   this.router.navigateByUrl('/auth/register');
    // }
 
  

