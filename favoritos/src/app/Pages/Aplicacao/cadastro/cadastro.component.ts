import { CatSubCatModel } from './../../../models/CatSubCat.Model';
import { Component, NgZone, OnInit } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpService } from '../../../services/http-service.service';
import { TreeNode } from 'primeng/api';
import { SiteModel } from '../../../models/Site.Model';
import { ChangeDetectorRef } from '@angular/core';

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
  novoSite: SiteModel = new SiteModel();
  boolRegistro: boolean = false;
  boolEditarSite: boolean = false;
  boolEditarCategoria: boolean = false;
  boolNovoSite: boolean = false;

  files: TreeNode[] = [];

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private zone: NgZone,
    private cd: ChangeDetectorRef
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
        key: item.CatPai ? item.CatPai!.toString() : '',
        icon: 'pi pi-folder',
        label: item.CatDesc,
        target: 'CATEGORIA',
        command: () => {
          this.SelecionaItem(objMenu);
        },
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
        id: itemSite.SitCodi.toString(),
        icon: 'pi pi-link',
        label: itemSite.SitDesc,
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

  SelecionaItem(item: MenuItem) {
    this.itemSelecionado = item;
    console.warn('ITEM SELECIONADO:', this.itemSelecionado);

    switch (item.target) {
      case 'SITE':
        this.boolEditarSite = true;
        this.boolEditarCategoria = false;
        this.boolNovoSite = false;
        break;
      case 'CATEGORIA':
        this.boolEditarSite = false;
        this.boolEditarCategoria = true;
        this.boolNovoSite = true;
        break;
      default:
        break;
    }
  }

  Cancelar() {
    this.itemSelecionado = {} as MenuItem;
    this.novoItem = new CatSubCatModel();
    this.boolRegistro = false;
    // console.warn(this.itemSelecionado);
  }

  Selecao(tipo: string) {
    switch (tipo) {
      case 'NOVA_CATEGORIA':
        // console.warn('NOVA_SUBCATEGORIA', this.itemSelecionado);
        this.itemSelecionado = { target: 'CATEGORIA' };
        this.novoItem.CatPai = 0;

        //-> SE FOR O 1º NÍVEL
        // if (this.novoItem.CatPai == 0) {
        //   this.novoItem.CatPai = this.novoItem.CatCodi;
        //   this.novoItem.CatCodi = 0;
        //   console.warn('1º Nível');
        // }
        break;
      case 'NOVA_SUBCATEGORIA':
        // console.warn('NOVA_SUBCATEGORIA', this.itemSelecionado);
        this.itemSelecionado.target = 'CATEGORIA';
        this.novoItem.CatPai = +this.itemSelecionado.id!;

        //-> SE FOR O 1º NÍVEL
        if (this.novoItem.CatPai == 0) {
          this.novoItem.CatPai = this.novoItem.CatCodi;
          this.novoItem.CatCodi = 0;
          console.warn('1º Nível');
        }
        break;
      case 'EDITAR_CATEGORIA':
        // console.warn('EDITAR_CATEGORIA', this.itemSelecionado);
        this.itemSelecionado.target = 'CATEGORIA';
        this.novoItem.CatCodi = +this.itemSelecionado.id!;
        this.novoItem.CatPai = +this.itemSelecionado['key'];
        this.novoItem.CatDesc = this.itemSelecionado.label!;
        break;
      case 'NOVO_SITE':
        // console.warn('NOVO_SITE', this.itemSelecionado);
        this.itemSelecionado.target = 'SITE';
        this.novoSite.CatCodi = +this.itemSelecionado.id!;
        this.novoSite.SttCodi = 1;
        break;
      case 'EDITAR_SITE':
        // console.warn('EDITAR_SITE', this.itemSelecionado);
        this.itemSelecionado.target = 'SITE';
        // this.novoSite.catCodi = +this.itemSelecionado.id!;
        // this.novoSite.sttCodi = 1;
        this.GetSite(+this.itemSelecionado.id!);
        break;

      default:
        break;
    }

    this.boolRegistro = true;
  }

  SalvarNovaSubcategoria() {
    if (this.novoItem.CatDesc.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção: ',
        detail: 'Insira uma descrição.',
      });
      return;
    }

    console.warn('objEnvioPostCategoria: ', this.novoItem);
    this.PostCategoria(this.novoItem);
  }

  SalvarNovoSite() {
    if (this.novoSite.SitDesc.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção: ',
        detail: 'Insira uma descrição.',
      });
      return;
    }
    if (this.novoSite.SitLink.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção: ',
        detail: 'Insira um link.',
      });
      return;
    }

    console.warn('objEnvioPostSite: ', this.novoSite);
    this.PostSite(this.novoSite);
  }

  PostCategoria(objCat: CatSubCatModel) {
    this.boolLoading = true;
    this.http.PostCategoria(objCat).subscribe({
      next: (response) => {
        console.warn('Retorno Insert: ', response);
        if (
          response === 'Salvo com sucesso!' ||
          response === 'Alterado com sucesso!'
        ) {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso! ',
            detail: 'Item salvo com Sucesso!',
          });
        }
        this.boolLoading = false;
        this.GetFavoritos();
        this.Cancelar();
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

  PostSite(objSite: SiteModel) {
    this.boolLoading = true;
    this.http.PostSite(objSite).subscribe({
      next: (response) => {
        console.warn('Retorno Insert: ', response);
        if (
          response === 'Salvo com sucesso!' ||
          response === 'Alterado com sucesso!'
        ) {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso! ',
            detail: 'Item salvo com Sucesso!',
          });
        }
        this.boolLoading = false;
        this.GetFavoritos();
        this.Cancelar();
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

  GetSite(sitCodi: number) {
    this.boolLoading = true;
    this.http.GetSite(sitCodi).subscribe({
      next: (response) => {
        console.warn(response);
        this.novoSite = response[0];
        this.novoSite = { ...this.novoSite, ...response[0] };
        console.warn(this.novoSite);
        this.cd.detectChanges();
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
}
