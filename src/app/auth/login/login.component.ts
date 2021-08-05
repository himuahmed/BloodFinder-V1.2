import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { login } from '../interfaces/login';
import { AuthService } from '../services/auth.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/shared-services/user-service.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy {

  loginForm: FormGroup;
  loginCred: login;
  unsubscribe$ = new Subject();
  isLoading= true;
  constructor(private formBuilder:FormBuilder, private authService:AuthService,readonly snackBar: MatSnackBar, private router:Router, private userService:UserServiceService) { }

  ngOnInit() {
    this.loginFormMethod();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }



  loginFormMethod(){
    return this.loginForm = this.formBuilder.group({
      EmailOrUsername:['himu5@gmail.com',[Validators.required, Validators.maxLength(100)]],
      password:['0123456',[Validators.required]]
    });
  }

  login(){
    this.loginCred = Object.assign({}, this.loginForm.value);
    this.authService.login(this.loginCred).subscribe(next => {
      this.userService.setLoggedInPerson();
      this.getPersonByUserId();
    },error=> {
      this.openSnackBar("Failed to log in", "close")
    })
  }

  getPersonByUserId(){
    this.userService.getPersonByUserId().pipe(takeUntil(this.unsubscribe$)).subscribe(res=>{
      if(res){
        this.router.navigate(['']);
      }
    },error=>{
      this.isLoading = false;
      this.router.navigate(['user/add-person-info']);
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action,{
      duration: 2*1000
    });
  }

}
