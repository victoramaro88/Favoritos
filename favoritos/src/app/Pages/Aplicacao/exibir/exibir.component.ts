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
        items:
          item.SubCategorias.length > 0
            ? this.MontarHierarquia(item.SubCategorias)
            : item.Sites.length > 0
            ? this.AdicionaSites(item.Sites)
            : [],
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
        label: itemSite.sitDesc,
        url: itemSite.sitLink,
      };
      menuItemsSites.push(objSite);
    });

    return menuItemsSites;
  }
}
