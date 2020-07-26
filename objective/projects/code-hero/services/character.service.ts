import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { CharacterResponse } from '../models/character';
import { Page } from '../models/page';
import { md5 } from './../utils/md5';
import { DetailResponse } from '../models/details';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  private marvel_api = 'https://gateway.marvel.com/v1/public/characters';
  private public_key = '3aaebdb08ed73d4e83226af834abf703';
  private private_key = 'da3f077c1f49fbeef225ca6bef92b3dd18335499';

  constructor(
    private httpClient: HttpClient,
  ) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  getCharacters(page: Page): Observable<CharacterResponse> {
    const timestamp = new Date().getTime().toString();
    const hash = md5(timestamp + this.private_key + this.public_key)
    const options = {
      params: new HttpParams({
        fromObject: {
          apikey: this.public_key,
          ts: timestamp,
          hash: hash,
          offset: page.offset.toString(),
          limit: page.limit.toString()
        }
      })
    };
    if (page.argument) {
      options.params = options.params.append("nameStartsWith", page.argument)

    }
    return this.httpClient.get<CharacterResponse>(this.marvel_api, options)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  getCharacterByid(id: string): Observable<CharacterResponse> {
    const timestamp = new Date().getTime().toString();
    const hash = md5(timestamp + this.private_key + this.public_key)
    const options = {
      params: new HttpParams({
        fromObject: {
          apikey: this.public_key,
          ts: timestamp,
          hash: hash,
          offset: '0',
          limit: '1'
        }
      })
    };
    return this.httpClient.get<CharacterResponse>(`${this.marvel_api}/${id}`, options)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  getDetailsByCharacterIdAndContext(id: string, context: string): Observable<DetailResponse> {
    const timestamp = new Date().getTime().toString();
    const hash = md5(timestamp + this.private_key + this.public_key)
    const options = {
      params: new HttpParams({
        fromObject: {
          apikey: this.public_key,
          ts: timestamp,
          hash: hash,
          offset: '0',
          limit: '5'
        }
      })
    };
    return this.httpClient.get<DetailResponse>(`${this.marvel_api}/${id}/${context}`, options)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }


  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Erro: ${error.status}, ` + `Message: ${error.message}`;
      if (error.status === 404)
        window.location.href = 'herois';
    }
    return throwError(errorMessage);
  };
}
