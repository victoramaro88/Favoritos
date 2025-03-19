import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { MenuItem, MessageService } from 'primeng/api';
import { HttpService } from '../../../services/http-service.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CatSubCatModel } from '../../../models/CatSubCat.Model';
import { NgZone } from '@angular/core';
import { SiteModel } from '../../../models/Site.Model';

@Component({
  selector: 'app-exibir',
  standalone: true,
  imports: [ImportsModule, RouterModule],
  templateUrl: './exibir.component.html',
  styleUrl: './exibir.component.css',
  providers: [MessageService],
})
export class ExibirComponent implements OnInit {
  boolLoading = false;

  items: MenuItem[] = [];
  lstCatSubCat: CatSubCatModel[] = [];

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.GetFavoritos();
  }

  GetFavoritos() {
    this.boolLoading = true;
    this.http.GetFavoritos().subscribe({
      next: (response) => {
        // console.warn('Retorno', response);
        this.items = this.MontarHierarquia(response);
        this.boolLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro: ',
          detail: 'Falha ao realizar a operação, contate o suporte.',
        });
        this.boolLoading = false;
      },
    });
  }

  MontarHierarquia(listaHierarquia: CatSubCatModel[]): MenuItem[] {
    let menuItems: MenuItem[] = [];

    listaHierarquia.forEach((item) => {
      let objMenu: MenuItem = {
        icon: 'pi pi-folder',
        label: item.CatDesc,
        items: this.PreencheItems(item.SubCategorias, item.Sites),
      };
      menuItems.push(objMenu);
    });

    return menuItems;
  }

  AdicionaSites(listaSites: SiteModel[]) {
    let menuItemsSites: MenuItem[] = [];
    listaSites.forEach((itemSite) => {
      let objSite: MenuItem = {
        icon: 'pi pi-link',
        label: itemSite.SitDesc,
        url: itemSite.SitLink,
      };
      menuItemsSites.push(objSite);
    });

    return menuItemsSites;
  }

  PreencheItems(categorias: CatSubCatModel[], sites: SiteModel[]) {
    let itemRet: MenuItem[] = [];

    if (categorias.length > 0) {
      let lstCat: MenuItem[] = this.MontarHierarquia(categorias);
      lstCat.forEach((itemCat) => {
        itemRet.push(itemCat);
      });
    }

    if (sites.length > 0) {
      let lstSites: MenuItem[] = this.AdicionaSites(sites);
      lstSites.forEach((itemSite) => {
        itemRet.push(itemSite);
      });
    }

    return itemRet;
  }
}
