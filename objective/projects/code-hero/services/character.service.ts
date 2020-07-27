import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { CharacterResponse } from '../models/character';
import { Page } from '../models/page';
import { md5 } from './../utils/md5';
import { DetailResponse } from '../models/details';
import { environment } from '../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  marvel_api = environment.marvel_api;
  public_key = environment.public_key;
  private_key = environment.private_key;

  constructor(
    private httpClient: HttpClient,
  ) { }

  getCharacters(page?: Page | null, id?: string): Observable<CharacterResponse> {
    console.log("CharacterService -> page", page)
    const timestamp = new Date().getTime().toString();
    const hash = md5(timestamp + this.private_key + this.public_key)
    const options = {
      params: new HttpParams({
        fromObject: {
          apikey: this.public_key,
          ts: timestamp,
          hash: hash,
          offset: page ? page.offset.toString() : '0',
          limit: page ? page.limit.toString() : '1'
        }
      })
    };
    if (page && page.argument) {
      options.params = options.params.append("nameStartsWith", page.argument)
    }
    const path = id ? this.marvel_api + `/${id}` : this.marvel_api;

    return this.httpClient.get<CharacterResponse>(path, options)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  getDetailsByCharacterIdAndContext(id: string, context: string): Observable<DetailResponse> {
    console.log("CharacterService -> context", context)
    console.log("CharacterService -> id", id)
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
