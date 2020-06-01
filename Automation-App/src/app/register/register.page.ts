import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service'; //used to trigger the onLogin method
import { Router } from '@angular/router'; //used to navigate through pages
import {  FormControl, NgForm } from '@angular/forms';
import {LoadingController, AlertController} from '@ionic/angular';
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
    constructor( private alertCtrl: AlertController, private authService: AuthService, private router : Router, private loadingCtrl: LoadingController, public formbuilder: FormBuilder) //Parameters injected to trigger the necessary methods
     {
      this.form = this.formbuilder.group(
        {
          email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
          passwordGroup: new FormGroup({
            password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6),PasswordStrengthValidator.isValid])),
            confirmpassword: new FormControl('', Validators.compose([Validators.required])),
          }, Validators.compose([PasswordMatch.MatchPassword]))
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
      const confirmpassword = form.value.confirmpassword;
      this.onSignUp(email, password, confirmpassword)
  }
  onSignUp(email: string, password: string, confirmpassword: string)
  {
    this.isLoading = true;
    this.authService.login();
    this.loadingCtrl.create({keyboardClose:true, message:'Creating account...'})
    .then(loadingEl=>{
      loadingEl.present();
      
      // setTimeout(()=>{
      //   this.isLoading = false;
      //   loadingEl.dismiss();
      // }, 1000)
      this.authService.signup(email, password, confirmpassword).subscribe(
        resData => {
          console.log(resData);
          this.isLoading = false;
          loadingEl.dismiss();
          console.log('signedup!!');
          // this.router.navigateByUrl('../auth');
        },
        errRes => {
          loadingEl.dismiss();
          const code = errRes.error.error.message;
          let message = 'Could not sign you up, Try again.';
          if(code === 'EMAIL EXISTS'){
            message = 'This email address already exists';
          }
          this.showAlert(message);
        }
      );
    })
  }
  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
}
  // Login(){
  //   console.log(this.form);
  //   this.router.navigateByUrl('/auth')
  // }
  



