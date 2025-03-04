import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { CatSubCatModel } from '../models/CatSubCat.Model';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  // #region GET

  public GetFavoritos(): Observable<CatSubCatModel[]> {
    return this.http.get<CatSubCatModel[]>(
      `${environment.apiServicos}/Favoritos/GetFavoritos`
    );
  }

  // #endregion
}
