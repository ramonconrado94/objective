import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/herois',
    pathMatch: 'full'
  },
  {
    path: 'herois', loadChildren: () => import('./characters/characters.module').then(m => m.CharactersModule)
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
