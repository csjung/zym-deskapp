import { Routes } from '@angular/router';
import { Login } from './login/login';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
    { path: 'login', component:Login },


    { path: '', loadChildren: () => import('./pages/pages.routes').then(mod => mod.PAGES_ROUTES),canActivate: [AuthGuard]}, 
    { path: '', redirectTo: 'pages', pathMatch: 'full' },

];
