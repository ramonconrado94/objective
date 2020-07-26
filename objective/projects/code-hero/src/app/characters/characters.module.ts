import { NgModule } from '@angular/core';
import { CharactersRoutingModule } from './characters-routing.module';
import { CharactersComponent } from './characters.component';
import { SharedModule } from './../shared/shared.module';
import { CharacterService } from '../../../services/character.service'
import { ImageService } from '../../../services/image.service'
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [CharactersComponent],
  imports: [
    SharedModule,
    CharactersRoutingModule,
    MatButtonModule,
    FlexLayoutModule,
  ],
  providers: [
    CharacterService,
    ImageService
  ]
})
export class CharactersModule { }
