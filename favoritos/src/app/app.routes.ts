import { CadastroComponent } from './Pages/Aplicacao/cadastro/cadastro.component';
import { ExibirComponent } from './Pages/Aplicacao/exibir/exibir.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './Pages/Controle/login/login.component';
import { HomeComponent } from './Pages/Controle/home/home.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'exibir', component: ExibirComponent },
  { path: 'cadastro', component: CadastroComponent },
  // { path: '**', redirectTo: 'login' },
  { path: '**', redirectTo: 'exibir' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
