import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';
import { take, exhaustMap } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";

// Don't add root
@Injectable()
export class LoginInterceptorService implements HttpInterceptor {

  constructor(private loginService: LoginService) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.loginService.user.pipe(take(1), exhaustMap(user => {
      if (!user) {
        return next.handle(req); 
      }
      const modifiedRequest = req.clone({ params:
        new HttpParams().set('auth', user.token)
      })
      return next.handle(modifiedRequest);
    }));
  }
}
