import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private httpClient: HttpClient) { }

  getImage(imageUrl: any): any {
    return this.httpClient.get(imageUrl, { responseType: 'blob' as 'json' }).toPromise();
  }
}

