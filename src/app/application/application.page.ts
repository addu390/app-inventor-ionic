import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { ComponentField } from './application.model';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ActionService } from '../services/action.service';


@Component({
  selector: 'app-application',
  templateUrl: './application.page.html',
  styleUrls: ['./application.page.scss'],
})
export class ApplicationPage implements OnInit {
  applicationId: string;
  application: any;
  components: ComponentField[] = [];
  toggle = true;
  isLoading = false;

  constructor(private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private actionService: ActionService,
    private alertController: AlertController) { }

  ngOnInit() {
    this.applicationId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getApplicationDetails()
  }

  async presentModal() {
    const createApplicationModal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        'applicationId': this.applicationId
      }
    });
    createApplicationModal.onDidDismiss().then(data => {
      this.getApplicationDetails()
    });
    return createApplicationModal.present();
  }

  getApplicationDetails() {
    this.loginService.getApplicationDetails(this.applicationId).subscribe(application => {
      this.application = application
      this.components = application["components"]
      if (this.components.length == 0) {
        this.toggle = false
      }
    })
  }

  reorderItems(event)
  {
    console.log(event);
    console.log(`Moving item from ${event.detail.from} to ${event.detail.to}`);
    const itemMove = this.components.splice(event.detail.from, 1)[0];
    this.components.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
  }

  toggleOrder() {
    this.toggle = !this.toggle
  }

  doRefresh() {
    this.getApplicationDetails()
  }

  deleteComponent(component) {
    this.loginService.componentDelete(this.applicationId, component["component_id"]).subscribe(data => {
      this.getApplicationDetails()
    })
  }

  editComponent(component) {
    this.presentEditModal(component["component_id"])
  }

  async presentEditModal(componentId: string) {
    const createApplicationModal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        'applicationId': this.applicationId,
        'componentId': componentId
      }
      
    });
    createApplicationModal.onDidDismiss().then(data => {
      this.getApplicationDetails()
    });
    return createApplicationModal.present();
  }

  makeRequest(component: ComponentField) {
    this.isLoading = true;
    let uuidReplacedUrl = this.componentMap(component.action.url);
    if (component.action.request_type == "GET") {
      this.actionService.get(uuidReplacedUrl).subscribe(data => {
        this.presentApiOutput(data, uuidReplacedUrl)
      }, error => {
        this.presentApiOutput(error, uuidReplacedUrl)
      })
    }
    else if (component.action.request_type == "POST") {
      let replacedPostData = JSON.stringify(JSON.parse(this.componentMap(component.action.body)));
      console.log(replacedPostData)
      this.actionService.post(uuidReplacedUrl, replacedPostData).subscribe(data => {
        this.presentApiOutput(data, uuidReplacedUrl)
      }, error => {
        this.presentApiOutput(error, uuidReplacedUrl)
      })
    }
    else if (component.action.request_type == "PUT") {
      let replacedPostData = JSON.stringify(JSON.parse(this.componentMap(component.action.body)));
      console.log(replacedPostData)
      this.actionService.put(uuidReplacedUrl, replacedPostData).subscribe(data => {
        this.presentApiOutput(data, uuidReplacedUrl)
      }, error => {
        this.presentApiOutput(error, uuidReplacedUrl)
      })
    }
  }

  componentMap(url: string) {
    for (let component of this.components) {
      url = url.replace(component.uuid, component.values);
    }
    return url;
  }

  async presentApiOutput(data: any, url: string) {
    const alert = await this.alertController.create({
      header: 'API Output',
      subHeader: url,
      message: '<pre><code>' + JSON.stringify(data) + '</code></pre>',
      buttons: ['OK']
    });
    this.isLoading = false;
    await alert.present();
  }

}
