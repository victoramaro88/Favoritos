import { CatSubCatModel } from './../../../models/CatSubCat.Model';
import { Component, NgZone, OnInit } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpService } from '../../../services/http-service.service';

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
        this.lstMenus = response;
        console.warn('Retorno', this.lstMenus);
        console.warn('Retorno', JSON.stringify(this.lstMenus));
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
