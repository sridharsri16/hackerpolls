import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  api: string = 'http://localhost:54716/'
  // = environment.api + "api/";
  lang: string;
  constructor(public http: HttpClient) {
    this.lang = localStorage.getItem('lang');

  }

  getList(controller: string) {
    return this.http.get(`${this.api}${controller}`);
  }

  getById(id, controller: string) {
    return this.http.get(`${this.api}${controller}/${id}`);
  }

  insert(data: any, controller: string) {
    return this.http.post(`${this.api}${controller}`, data);
  }

  delete(id, controller: string) {
    return this.http.delete(`${this.api}${controller}/${id}`);
  }

  update(id, data: any, controller: string) {
    return this.http.put(`${this.api}${controller}/${id}`, data);
  }
}
