import { Component, OnInit } from '@angular/core';
// import {AuthService} from ''; //used to trigger the onLogin method
import { Router } from '@angular/router'; //used to navigate through pages
import {  FormControl } from '@angular/forms';
import {LoadingController, ModalController} from '@ionic/angular';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import {PasswordStrengthValidator, PasswordMatch} from '../auth/password';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  form: FormGroup;
  
  isLoading = false; //set to false as a default
  isSignup = true; //set to true as a default
    constructor(  private router : Router, private loadingCtrl: LoadingController, public formbuilder: FormBuilder) //Parameters injected to trigger the necessary methods
     {
      this.form = this.formbuilder.group(
        {
          email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
          password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6),PasswordStrengthValidator.isValid])),
          confirmpassword: new FormControl('', Validators.compose([Validators.required,PasswordMatch.MatchPassword ])),
          
        }
      ); 
     }
  ngOnInit() {
  }
  onSignUp()
  {
    this.isLoading = true;
    this.loadingCtrl.create({keyboardClose:true, message:'Creating account...'})
    .then(loadingEl=>{
      loadingEl.present();
      
      setTimeout(()=>{
        this.isLoading = false;
        loadingEl.dismiss();
      }, 1000)
      // this.authService.login();
    })
  }
  Login(){
    this.router.navigateByUrl('/auth')
  }

}
