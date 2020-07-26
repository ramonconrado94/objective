import { NgModule } from '@angular/core';
import { CharactersRoutingModule } from './characters-routing.module';
import { CharactersComponent } from './characters.component';
import { CharacterService } from '../../../services/character.service'
import { CharacterDetailComponent } from './character-detail/character-detail.component';
import { DetailComponent } from './character-detail/detail/detail.component';
import { ImageService } from '../../../services/image.service'
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from './../shared/shared.module';

@NgModule({
  declarations: [
    CharactersComponent,
    CharacterDetailComponent,
    DetailComponent,
  ],
  imports: [
    SharedModule,
    CharactersRoutingModule,
    FlexLayoutModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    CharacterService,
    ImageService
  ],
  entryComponents: [
    CharacterDetailComponent,
    DetailComponent,
  ]
})
export class CharactersModule { }
