import { SiteModel } from './Site.Model';

export class CatSubCatModel {
  CatCodi: number;
  CatDesc: string;
  CatPai?: number;
  SubCategorias: CatSubCatModel[];
  Sites: SiteModel[];

  constructor() {
    this.CatCodi = 0;
    this.CatDesc = '';
    this.CatPai = undefined;
    this.SubCategorias = [];
    this.Sites = [];
  }
}
