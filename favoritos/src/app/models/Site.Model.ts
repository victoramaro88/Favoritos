export class SiteModel {
  SitCodi: number;
  SitDesc: string;
  SitLink: string;
  SitObse: string;
  SttCodi: number;
  CatCodi: number;

  constructor() {
    this.SitCodi = 0;
    this.SitDesc = '';
    this.SitLink = '';
    this.SitObse = '';
    this.SttCodi = 0;
    this.CatCodi = 0;
  }
}
