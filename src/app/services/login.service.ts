import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap, take, exhaustMap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { User } from '../login/user.model';
import { Router } from '@angular/router';

interface AuthResponseData {
  userId: string,
  displayName: string,
  imageUrl: string,
  refreshToken: string,
  email: string,
  accessToken: string,
  idToken: string
}

interface TokenInfo {
  exp: string,
  expires_in: string,
  email: string,
  refreshToken: string,
  email_verified: string,
  access_type: string,
  scope: string,
  sub: string,
  aud: string,
  azp: string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  // url = "http://addu390.pythonanywhere.com"
  url = "http://localhost:8000"
  
  private FIVE_MINUTES = 300000
  private DEFAULT_TIMEOUT = 300

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router) {

  }

  logout() {
    this.user.next(null);
    this.storageService.clear();
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.router.navigate(['/login'])
  }

  getTokenInfo(accessToken: string) {
    return this.http.get<TokenInfo>("https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=" + accessToken)
    .pipe(tap(result => {
      const expirationDate = new Date(new Date().getTime() + +result.expires_in * 1000)
      const user = new User(result.email, result.sub, accessToken, expirationDate);
      this.user.next(user);
      this.autoLogout(+result.expires_in * 1000);
      this.storageService.set('userData', JSON.stringify(user));
    }));
  }

  refreshToken() {
    return this.user.pipe(take(1), exhaustMap(user => {
      return this.http.post(this.url + "/v1/token/" + user.userId, {});
    }));
  }

  autoLogout(expirationDuration: number) {
    if (expirationDuration <= 0) { 
      expirationDuration = this.DEFAULT_TIMEOUT 
    } else if (expirationDuration > this.FIVE_MINUTES) {
      expirationDuration = expirationDuration - this.FIVE_MINUTES;
    }
    this.tokenExpirationTimer = setTimeout(() => {
      this.refreshToken().subscribe(data => {
        let auth = JSON.parse(JSON.stringify(data))
        let userData = {
          "accessToken": auth["access_token"],
          "idToken": auth["id_token"],
        }
        this.userCreateOrUpdate(userData).subscribe(userDetails => {
          this.getTokenInfo(auth["access_token"]).subscribe(data => {
            console.log("Refresh token and auto login the user")
          }, error => {
            this.logout();
          })
        }, error => {
          this.logout();
        })
      }, error => {
        this.logout();
      })
    }, expirationDuration);
  }

  autoLogin() {
    let userData: {
      email: string,
      userId: string,
      _accessToken: string,
      _expiresIn: string
    };
    this.storageService.get('userData').then(result => {
      userData = JSON.parse(result);
      if (!userData) {
        return;
      }
      const loadedUser = new User(userData.email, userData.userId, userData._accessToken, new Date(userData._expiresIn));
      if (loadedUser.token) {
        this.user.next(loadedUser);
        const expirationDuration = new Date(userData._expiresIn).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration);
      }
    });
  }

  userCreateOrUpdate(postData: any) {
    let userId: string
    return this.user.pipe(take(1), exhaustMap(user => {
      if (postData["userId"]) {
        userId = postData["userId"]
      } else {
        userId = user.userId
      }
      return this.http.post<AuthResponseData>(this.url + "/v1/user/" + userId, postData);
    }));
  }

  getUserDetails() {
    return this.user.pipe(take(1), exhaustMap(user => {
      return this.http.get<AuthResponseData>(this.url + "/v1/user/" + user.userId);
    }));
  }

  getApplications() {
    return this.user.pipe(take(1), exhaustMap(user => {
      return this.http.get<AuthResponseData>(this.url + "/v1/application/" + user.userId);
    }));
  }

  getApplicationDetails(applicationId: string) {
    return this.user.pipe(take(1), exhaustMap(user => {
      return this.http.get(this.url + "/v1/application/" + user.userId + "/" + applicationId);
    }));
  }

  getComponentDetails(applicationId: string, componentId: string) {
    return this.user.pipe(take(1), exhaustMap(user => {
      return this.http.get(this.url + "/v1/application/" + user.userId + "/" + applicationId + "/" + componentId);
    }));
  }

  componentCreate(postData: any, appId: string) {
    return this.user.pipe(take(1), exhaustMap(user => {
      return this.http.put(this.url + "/v1/application/" + user.userId + "/" + appId, postData);
    }));
  }

  componentUpdate(postData: any, appId: string, componentId: string) {
    return this.user.pipe(take(1), exhaustMap(user => {
      return this.http.put(this.url + "/v1/application/" + user.userId + "/" + appId + "/" + componentId, postData);
    }));
  }

  componentDelete(appId: string, componentId: string) {
    return this.user.pipe(take(1), exhaustMap(user => {
      return this.http.delete(this.url + "/v1/application/" + user.userId + "/" + appId + "/" + componentId);
    }));
  }

  applicationDelete(appId: string) {
    return this.user.pipe(take(1), exhaustMap(user => {
      return this.http.delete(this.url + "/v1/application/" + user.userId + "/" + appId);
    }));
  }

  applicationCreateOrUpdate(postData: any, appId: string) {
    return this.user.pipe(take(1), exhaustMap(user => {
      return this.http.post(this.url + "/v1/application/" + user.userId + "/" + appId, postData);
    }));
  }
}
