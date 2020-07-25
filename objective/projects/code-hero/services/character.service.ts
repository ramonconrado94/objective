import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { MarvelResponse } from '../models/marvel-response';
import { Page } from '../models/page';
import { md5 } from './../utils/md5';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  private marvel_api = 'https://gateway.marvel.com/v1/public/characters';
  private public_key = '3aaebdb08ed73d4e83226af834abf703';
  private private_key = 'da3f077c1f49fbeef225ca6bef92b3dd18335499';

  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  getCharacters(page: Page): Observable<MarvelResponse> {
    const timestamp = new Date().getTime().toString();
    const hash = md5(timestamp + this.private_key + this.public_key)
    const options = {
      params: new HttpParams({
        fromObject: {
          apikey: this.public_key,
          ts: timestamp,
          hash: hash,
          offset: page.offset,
          limit: page.limit,
        }
      })
    };
    if (page.argument) {
      options.params = options.params.append("nameStartsWith", page.argument)

    }
    return this.httpClient.get<MarvelResponse>(this.marvel_api, options)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  // findCharacterByName(name: string): Observable<MarvelResponse> {
  //   const timestamp = new Date().getTime().toString();
  //   const hash = md5(timestamp + this.private_key + this.public_key)
  //   const options = {
  //     params: new HttpParams({
  //       fromObject: {
  //         apikey: this.public_key,
  //         ts: timestamp,
  //         hash: hash,
  //         name: name
  //       }
  //     })
  //   };
  //   return this.httpClient.get<MarvelResponse>(this.marvel_api, options)
  //     .pipe(
  //       retry(2),
  //       catchError(this.handleError))
  // }

  // Manipulação de erros
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };
}
