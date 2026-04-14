import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Http } from '../services/http';
import { Common } from '../services/common';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-login',
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  form: FormGroup;
  autoLogin = false;
  passwordVisible = false;

  constructor(private fb: FormBuilder,
    private router: Router,
    private http: Http,
    private common: Common,
  ) {
    this.form = this.fb.group({
      saupNum: new FormControl('', {validators: [Validators.required],}),
      memberId: new FormControl('', {validators: [Validators.required],}),
      memberPass: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    let member = this.common.getLocalItem("member")
    if (member) {
      this.http.postObject(member, '/member/autoLogin.do').subscribe(obj => {
        this.common.setMember(obj);
      });
    }
  }

  onSubmit() {
    this.http.postObject(this.form.value, '/member/authMember.do').subscribe(obj => {  
      this.common.setMember(obj);
      if (this.autoLogin) {
        this.common.setLocalItem("member", obj);
      } else {
        localStorage.removeItem("member");
      }
      if (sessionStorage.getItem('loginAfter')) {   
        let url:any = sessionStorage.getItem('loginAfter');
        this.router.navigate([url.replace(/"/g, '')]);
      } else {
        this.router.navigate(['/']);
      }      
    });
  }
}
