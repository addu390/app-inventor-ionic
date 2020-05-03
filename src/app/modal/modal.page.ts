import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { ComponentField, ActionField } from '../application/application.model';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  applicationId: string;
  componentId: string;
  componentDetail: ComponentField = new ComponentField();
  isEdit = false;

  constructor(private modalController: ModalController,
    private navParams: NavParams,
    private loginService: LoginService,
    private toast: ToastController) { }

  ngOnInit() {
    this.applicationId = this.navParams.get('applicationId');
    this.componentId = this.navParams.get('componentId');
    if (this.componentId != undefined || this.componentId != null) {
      this.isEdit = true;
      this.loginService.getComponentDetails(this.applicationId, this.componentId).subscribe(data => {
        const componentDetail: any = data
        this.componentDetail = componentDetail
      }) 
    } else {
      this.componentDetail.action = new ActionField();
      this.componentDetail.action.request_type = "GET"
      this.componentDetail.input_type = 1
    }
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  submitComponent() {
      console.log(this.componentDetail);
      if (this.componentDetail.uuid == null || this.componentDetail.uuid.length < 5) {
        this.presentToast("Unique Identifier is a mandatory field with atleast 5 characters")
      }
      else {
        if (this.isEdit) {
          this.loginService.componentUpdate(this.componentDetail, this.applicationId, this.componentId).subscribe( data => {
            console.log(data)
          })
          this.modalController.dismiss({  
            'dismissed': true
          });
        } else {
          this.loginService.componentCreate(this.componentDetail, this.applicationId).subscribe( data => {
            console.log(data)
          })
          this.modalController.dismiss({  
            'dismissed': true
          });
        }
      }
  }

  addOptions() {
    if (this.componentDetail.options == null || this.componentDetail.options == undefined) {
      this.componentDetail.options = []
    }
    this.componentDetail.options.push('')
  }

  removeOptions() {
    this.componentDetail.options.splice(this.componentDetail.options.length - 1, 1);
  }

  httpRequestChange(ev: any) {
    console.log('Segment changed', ev);
  }

  async presentToast(errorMessage: string) {
    const toast = await this.toast.create({
      message: errorMessage,
      duration: 2000
    });
    toast.present();
  }

}
