import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private loginService: LoginService,
    private router: Router
    ) { }

  canActivate(
    route: ActivatedRouteSnapshot, state: 
    RouterStateSnapshot
    ): boolean | Promise<boolean> | Observable<boolean | UrlTree> {
    
      return this.loginService.user.pipe(take(1), map(user => {
      const isAuth = !!user
      if (isAuth) {
        return true;
      }
      return this.router.createUrlTree(['/login'])
    }));
  }
}
