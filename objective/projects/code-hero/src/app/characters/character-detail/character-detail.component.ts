import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { CharacterResponse, Character } from 'projects/code-hero/models/character';
import { ImageService } from 'projects/code-hero/services/image.service';
import { CharacterService } from 'projects/code-hero/services/character.service';
import { DetailResponse, Detail } from 'projects/code-hero/models/details';
@Component({
  selector: 'code-hero-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss']
})
export class CharacterDetailComponent implements OnInit {
  isLoading: boolean = true;
  character: Character | undefined;
  characterId: string;
  characterImage: any;

  comics: Detail[] = [];
  comicsImageList: any[] = [];

  series: Detail[] = [];
  seriesImageList: any[] = [];

  events: Detail[] = [];
  eventsImageList: any[] = [];

  constructor(
    private characterService: CharacterService,
    private imageService: ImageService,
    private route: ActivatedRoute
  ) {
    this.characterId = '';
  }
  ngOnInit(): void {
    this.getCharacterDetail();
  }

  getCharacterDetail() {
    // TODO - REVIEW
    let id = this.route.snapshot.paramMap.get('id');
    id ? this.characterId = id : null

    if (this.characterId) {
      this.isLoading = true;
      this.characterService.getCharacters(null, this.characterId).subscribe((res: CharacterResponse) => {
        if (res.data) {
          this.character = res.data.results[0];
          this.getImage(`${this.character.thumbnail.path}/portrait_xlarge.${this.character.thumbnail.extension}`)
          this.getDetailsByContext();
          this.isLoading = false
        }
      })
    }
  }

  getDetailsByContext() {
    this.comicsImageList, this.seriesImageList, this.eventsImageList = new Array<any>();

    this.characterService.getDetailsByCharacterIdAndContext(this.characterId, 'comics').subscribe((res: DetailResponse) => {
      this.comics = res.data.results;
      this.comics.forEach(async comic => {
        await this.getImage(`${comic.thumbnail.path}/standard_small.${comic.thumbnail.extension}`, this.comicsImageList)
      })
    });

    this.characterService.getDetailsByCharacterIdAndContext(this.characterId, 'series').subscribe((res: DetailResponse) => {
      this.series = res.data.results;
      this.series.forEach(async serie => {
        await this.getImage(`${serie.thumbnail.path}/standard_small.${serie.thumbnail.extension}`, this.seriesImageList)
      })
    });

    this.characterService.getDetailsByCharacterIdAndContext(this.characterId, 'events').subscribe((res: DetailResponse) => {
      this.events = res.data.results;
      this.events.forEach(async event => {
        await this.getImage(`${event.thumbnail.path}/standard_small.${event.thumbnail.extension}`, this.eventsImageList)
      })
    });
  }

  async getImage(imageUrl: string, imageArray?: Array<any>) {
    await this.imageService.getImage(imageUrl).subscribe((baseImage: any) => {
      this.createImageFromBlob(baseImage, imageArray);
    });
  }

  createImageFromBlob(image: Blob, imageArray?: Array<any>) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      imageArray ? imageArray.push(reader.result) : this.characterImage = reader.result
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
