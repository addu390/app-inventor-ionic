import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  userId: string;

  constructor(private storage: Storage) { }

  public set(settingName: any, value: any) {
    return this.storage.set(`setting:${ settingName }`, value);
  }
  
  public async get(settingName: any){
    return await this.storage.get(`setting:${ settingName }`)
    .then(data => {
      return data;
    }).catch(error => {
      return null;
    });
  }
  
  public async remove(settingName: any){
    return await this.storage.remove(`setting:${ settingName }`);
  }
  
  public clear() {
    this.storage.clear().then(() => {
    });
  }
}
