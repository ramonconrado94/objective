import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private httpClient: HttpClient) { }

  getImage(imageUrl: any): any {
    let httpsUrl = imageUrl.replace('http://', 'https://')
    return this.httpClient.get(httpsUrl, { responseType: 'blob' as 'json' }).toPromise();
  }
}
