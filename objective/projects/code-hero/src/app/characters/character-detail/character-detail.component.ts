import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CharacterResponse, Character } from 'projects/code-hero/models/character';
import { ImageService } from 'projects/code-hero/services/image.service';
import { CharacterService } from 'projects/code-hero/services/character.service';
import { DetailResponse, Detail } from 'projects/code-hero/models/details';
import { Thumbnail } from 'projects/code-hero/models/thumbnail';

@Component({
  selector: 'code-hero-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss']
})
export class CharacterDetailComponent implements OnInit {
  isLoading: boolean = true;
  character: Character | undefined;
  characterId: string = '';
  characterImage: any;

  comics: Detail[] = [];
  series: Detail[] = [];
  events: Detail[] = [];

  comicsImageList: any[] = [];
  seriesImageList: any[] = [];
  eventsImageList: any[] = [];

  constructor(
    private characterService: CharacterService,
    private imageService: ImageService,
    private route: ActivatedRoute
  ) {
  }
  ngOnInit(): void {
    this.getCharacterDetail();
  };

  getCharacterDetail() {
    let id = this.route.snapshot.paramMap.get('id');
    id ? this.characterId = id : null;

    if (this.characterId) {
      this.isLoading = true;
      this.characterService.getCharacters(null, this.characterId).subscribe((res: CharacterResponse) => {
        if (res.data) {
          this.character = res.data.results[0];
          this.getImage(this.character.thumbnail, 'portrait_xlarge');
          this.getDetailsByContext();
          this.isLoading = false
        }
      });
    }
  }

  getDetailsByContext() {
    this.comicsImageList, this.seriesImageList, this.eventsImageList = new Array<any>();

    this.characterService.getDetailsByCharacterIdAndContext(this.characterId, 'comics').subscribe((res: DetailResponse) => {
      this.comics = res.data.results;
      this.comics.forEach(async comic => {
        await this.getImage(comic.thumbnail, 'standard_small', this.comicsImageList)
      })
    });

    this.characterService.getDetailsByCharacterIdAndContext(this.characterId, 'series').subscribe((res: DetailResponse) => {
      this.series = res.data.results;
      this.series.forEach(async serie => {
        await this.getImage(serie.thumbnail, 'standard_small', this.seriesImageList)
      })
    });

    this.characterService.getDetailsByCharacterIdAndContext(this.characterId, 'events').subscribe((res: DetailResponse) => {
      this.events = res.data.results;
      this.events.forEach(async event => {
        await this.getImage(event.thumbnail, 'standard_small', this.eventsImageList);
      })
    });
  }

  // Image methods
  async getImage(thumbnail: Thumbnail, size: string, imageArray?: Array<any>) {
    let imagePath = `${thumbnail.path}/${size}.${thumbnail.extension}`;
    await this.imageService.getImage(imagePath).then((baseImage: any) => {
      this.createImageFromBlob(baseImage, imageArray);
    });
  }
  createImageFromBlob(image: Blob, imageArray?: Array<any>) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      imageArray ? imageArray.push(reader.result) : this.characterImage = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
