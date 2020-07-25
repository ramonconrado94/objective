import { NgModule } from '@angular/core';
import { CharactersRoutingModule } from './characters-routing.module';
import { CharactersComponent } from './characters.component';
import { SharedModule } from './../shared/shared.module';
import { MatListModule } from '@angular/material/list'
import { MatGridListModule } from '@angular/material/grid-list';


@NgModule({
  declarations: [CharactersComponent],
  imports: [
    SharedModule,
    CharactersRoutingModule,
    MatListModule,
    MatGridListModule
  ]
})
export class CharactersModule { }
