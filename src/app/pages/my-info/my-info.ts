import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Common } from '../../services/common';

@Component({
  selector: 'app-my-info',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule,
  ],
  templateUrl: './my-info.html',
  styleUrl: './my-info.scss',
})
export class MyInfo {

  user:any = {};

  constructor(
    private common: Common,
    private router: Router,
  ) {
    this.user = this.common.getMember();
  }


  logout() {
    sessionStorage.removeItem("member");
    localStorage.removeItem("member");
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500); 
    
  }
}
