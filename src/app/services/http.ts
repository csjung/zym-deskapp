import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Http {

  httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

  constructor(protected httpClient: HttpClient) { }

  public getAll(url: string) {
    return this.httpClient.get<any[]>(environment.serviceUrl + encodeURI(url));
  }

  public getObject(url: string) {
    return this.httpClient.get<any>(environment.serviceUrl + encodeURI(url));
  }

  public postObject(obj: any, url: string) {
    return this.httpClient.post<any>(environment.serviceUrl + url, JSON.stringify(obj), this.httpOptions);
  }

  public postList(obj: any, url: string) {
    return this.httpClient.post<any[]>(environment.serviceUrl + url, JSON.stringify(obj), this.httpOptions);
  }

  public delObject(url: string) {
    return this.httpClient.get(environment.serviceUrl + url, this.httpOptions);
  }
}
