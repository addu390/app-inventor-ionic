import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoginService } from '../services/login.service';
import { StorageService } from '../services/storage.service';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  private userSub: Subscription;
  isLoading = false;
  isAuthenticated = false;
  userDetails: any;

  constructor(
    private loginService: LoginService,
    public storageService: StorageService,
    private router: Router,
    private toast: ToastController,
    private googlePlus: GooglePlus) {
    }

  ngOnInit() {
    this.userSub = this.loginService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      if (this.isAuthenticated) {
        this.loginService.getUserDetails().subscribe(data => {
          this.userDetails = JSON.parse(JSON.stringify(data))
        })
      }
    });
  }
  
  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  loginUser() {
    this.isLoading = true;
    this.googlePlus.login({})
    .then(res => {
      this.tokenInfo(res["accessToken"]);
      this.save(res);
      this.isLoading = false;
      this.router.navigate(['login'])
    })
    .catch(err => {
      this.isLoading = false;
      this.presentToast(err);
      console.log(err);
    });
  }

  async presentToast(errorMessage: string) {
    const toast = await this.toast.create({
      message: errorMessage,
      duration: 2000
    });
    toast.present();
  }
  
  logoutUser() {
    this.googlePlus.logout().then(() => {
      this.loginService.logout();
    });
  }

  save(authResponseData: any) {
    this.loginService.userCreateOrUpdate(authResponseData).subscribe(
      result => {
        console.log(result);
      },
      error => {
        this.presentToast(error);
      }
    )
  }

  tokenInfo(accessToken: string) {
    this.loginService.getTokenInfo(accessToken).subscribe(
      result => {
        console.log(result);
      },
      error => {
        this.presentToast(error);
      }
    )
  }
}
