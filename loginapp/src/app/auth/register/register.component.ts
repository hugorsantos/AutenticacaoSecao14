import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { User } from '../user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formRegister = this.fb.group({
    'firstname': ['', [Validators.required]],
    'lastname': ['', [Validators.required]],
    'address': ['', [Validators.required]],
    'city': ['', [Validators.required]],
    'state': ['', [Validators.required]],
    'phone': ['', [Validators.required]],
    'mobilephone': ['', [Validators.required]],
    'email': ['', [Validators.required, Validators.email]],
    'password1': ['', [Validators.required, Validators.minLength(6)]],
    'password2': ['', [Validators.required, Validators.minLength(6)]],
  }, { validator: this.matchingPasswords});
  
  states = ["MG", "RS", "SC", "GO", "PR", "SP", "DF"];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
  }

  matchingPasswords(group: FormGroup) {
    if (group) {
      const password1 = group.controls['password1'].value;
      const password2 = group.controls['password2'].value;
      if (password1 == password2) {
        return null;
      }
    }
    return {matching: false};
  }

  onSubmit() {
    console.log(this.formRegister.value);
    let u: User = { 
      ...this.formRegister.value, 
      password: this.formRegister.value.password1};
    this.authService.register(u)
      .subscribe(
        (u) => {
          this.snackBar.open(
            'Registrado com sucesso. Use suas credenciais para fazer login',
            'OK', {duration: 3000});
          this.router.navigateByUrl('/auth/login');
        },
        (err) => {
          console.error(err);
          this.snackBar.open(err.error.message,'OK', {duration: 2000});
        }
      )
  }

}
