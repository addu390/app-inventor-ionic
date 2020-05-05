import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor(private http: HttpClient) { }

  get(url: string) {
    // console.log(url)
    return this.http.get(url);
  }


  post(url: string, postData: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json; charset=UTF-8'
      })
    };
    return this.http.post(url, postData, httpOptions);
  }

  put(url: string, postData: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json; charset=UTF-8'
      })
    };
    return this.http.put(url, postData, httpOptions);
  }

  delete(url: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json; charset=UTF-8'
      })
    };
    return this.http.delete(url, httpOptions);
  }
}
