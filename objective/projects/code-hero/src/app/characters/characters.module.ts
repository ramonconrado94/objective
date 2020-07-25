import { NgModule } from '@angular/core';
import { CharactersRoutingModule } from './characters-routing.module';
import { CharactersComponent } from './characters.component';
import { SharedModule } from './../shared/shared.module';
import { MatListModule } from '@angular/material/list'
import { MatGridListModule } from '@angular/material/grid-list';
import { CharacterService } from '../../../services/character.service'
import { ImageService } from '../../../services/image.service'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [CharactersComponent],
  imports: [
    SharedModule,
    CharactersRoutingModule,
    MatListModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule

  ],
  providers: [
    CharacterService,
    ImageService
  ]
})
export class CharactersModule { }
