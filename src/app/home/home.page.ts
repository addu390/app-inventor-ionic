import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  applications: any
  name: string
  description: string

  constructor(
    private router: Router,
    private loginService: LoginService,
    private alertController: AlertController
    ) {}
  
  
  ngOnInit(): void {
    this.getApplications()
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 800);
  }

  async createApplication() {
    const alert = await this.alertController.create({
      header: 'Application details',
      inputs: [
        {
          name: "name",
          type: 'text',
          placeholder: 'Name'
        },
        {
          name: "description",
          id: 'paragraph',
          type: 'textarea',
          placeholder: 'Description'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Create',
          handler: (data) => {
            this.loginService.applicationCreateOrUpdate(data, "NULL").subscribe(data => {
              this.getApplications()
            })
          }
        }
      ]
    });

    await alert.present();
  }

  getApplications() {
    this.loginService.getApplications().subscribe(applications => {
      this.applications = applications
    })
  }

  deleteApplication(application) {
    console.log("here")
    this.loginService.applicationDelete(application["app_id"]).subscribe(data => {
      this.getApplications()
      
      // TODO: Remove this and fix the navigationn to application page after deletion.
      this.router.navigate(['/home'])
    })
  }
  
}
