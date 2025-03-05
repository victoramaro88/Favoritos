import { CatSubCatModel } from './../../../models/CatSubCat.Model';
import { Component, NgZone, OnInit } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpService } from '../../../services/http-service.service';
import { TreeNode } from 'primeng/api';
import { SiteModel } from '../../../models/Site.Model';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ImportsModule, RouterModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css',
  providers: [MessageService],
})
export class CadastroComponent implements OnInit {
  boolLoading = false;

  lstMenus: CatSubCatModel[] = [];
  items: MenuItem[] = [];
  itemSelecionado!: MenuItem;
  novoItem: CatSubCatModel = new CatSubCatModel();
  boolRegistro: boolean = false;

  files: TreeNode[] = [];

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private zone: NgZone
  ) {
    let objTree: TreeNode = {
      key: '0',
      label: 'Documents',
      data: 'Documents Folder',
      icon: 'pi pi-fw pi-inbox',
      children: [
        {
          key: '0-0',
          label: 'Work',
          data: 'Work Folder',
          icon: 'pi pi-fw pi-cog',
          children: [
            {
              key: '0-0-0',
              label: 'Expenses.doc',
              icon: 'pi pi-fw pi-file',
              data: 'Expenses Document',
            },
            {
              key: '0-0-1',
              label: 'Resume.doc',
              icon: 'pi pi-fw pi-file',
              data: 'Resume Document',
            },
          ],
        },
        {
          key: '0-1',
          label: 'Home',
          data: 'Home Folder',
          icon: 'pi pi-fw pi-home',
          children: [
            {
              key: '0-1-0',
              label: 'Invoices.txt',
              icon: 'pi pi-fw pi-file',
              data: 'Invoices for this month',
            },
          ],
        },
      ],
    };

    this.files.push(objTree);
  }

  ngOnInit() {
    this.GetFavoritos();
  }

  GetFavoritos() {
    this.boolLoading = true;
    this.http.GetFavoritos().subscribe({
      next: (response) => {
        this.lstMenus = response;
        // console.warn('Retorno', this.lstMenus);
        // console.warn('Retorno', JSON.stringify(this.lstMenus));
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
        id: item.CatCodi.toString(),
        icon: 'pi pi-folder',
        label: item.CatDesc,
        target: 'CATEGORIA',
        command: () => {
          this.SelecionaItem(objMenu);
        },
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
        id: itemSite.sitCodi.toString(),
        icon: 'pi pi-link',
        label: itemSite.sitDesc,
        target: 'SITE',
        command: () => {
          this.SelecionaItem(objSite);
        },
        // url: itemSite.sitLink,
      };
      menuItemsSites.push(objSite);
    });

    return menuItemsSites;
  }

  SelecionaItem(item: MenuItem) {
    this.itemSelecionado = item;
    console.warn(this.itemSelecionado);
  }

  Cancelar() {
    this.itemSelecionado = {} as MenuItem;
    this.boolRegistro = false;
    // console.warn(this.itemSelecionado);
  }

  Selecao(tipo: string) {
    switch (tipo) {
      case 'NOVA_SUBCATEGORIA':
        console.warn('NOVA_SUBCATEGORIA', this.itemSelecionado);
        break;
      case 'NOVO_SITE':
        console.warn('NOVO_SITE', this.itemSelecionado);
        break;

      default:
        break;
    }

    this.boolRegistro = true;
  }

  SalvarNovaSubcategoria() {
    this.novoItem.CatPai = this.itemSelecionado.id
      ? +this.itemSelecionado.id
      : 0;
    console.warn(this.novoItem);
  }
}
