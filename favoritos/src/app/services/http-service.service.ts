import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { CatSubCatModel } from '../models/CatSubCat.Model';
import { SiteModel } from '../models/Site.Model';

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

  public GetSite(sitCodi: number): Observable<SiteModel[]> {
    return this.http.get<SiteModel[]>(
      `${environment.apiServicos}/Favoritos/GetSite/${sitCodi}`
    );
  }

  // #endregion

  // #region POST

  public PostCategoria(objCategoria: CatSubCatModel): Observable<string> {
    return this.http.post<string>(
      `${environment.apiServicos}/Favoritos/PostCategoria`,
      objCategoria
    );
  }

  public PostSite(objSite: SiteModel): Observable<string> {
    return this.http.post<string>(
      `${environment.apiServicos}/Favoritos/PostSite`,
      objSite
    );
  }

  // #endregion

  // #region DELETE

  public DeleteSite(sitCodi: number): Observable<string> {
    return this.http.delete<string>(
      `${environment.apiServicos}/Favoritos/DeleteSite/${sitCodi}`
    );
  }

  // #endregion
}
