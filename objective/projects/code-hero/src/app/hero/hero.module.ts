import { NgModule } from '@angular/core';

import { HeroRoutingModule } from './hero-routing.module';
import { HeroComponent } from './hero.component';

import { SharedModule } from './../shared/shared.module';


@NgModule({
  declarations: [HeroComponent],
  imports: [
    SharedModule,
    HeroRoutingModule
  ]
})
export class HeroModule { }
