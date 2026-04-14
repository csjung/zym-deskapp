import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) { }

  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    return handler.handle(req).pipe(
      map((event: HttpEvent<any>) => {          
          return event;
      }),
      catchError((error: HttpErrorResponse) => {  
          console.log('error=>', error);
          let msg = '';
          if (error.error) {
            if (error.error.message) {
              msg = error.error.message;
            } else {
              msg = error.error;
            }
          } else {
            msg = error.message;
          }
          this.snackBar.open(msg, 'ERROR', {
            duration: 3000,
          });     
          return throwError(error);
      }));
  }

}
