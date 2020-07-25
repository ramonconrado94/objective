import { Component, OnInit } from '@angular/core';
import { CharacterService } from 'projects/code-hero/services/character.service';
import { Character } from 'projects/code-hero/models/character';
import { Page } from 'projects/code-hero/models/page';
import { FormControl } from '@angular/forms';
import { MarvelResponse } from 'projects/code-hero/models/marvel-response';
import { ImageService } from 'projects/code-hero/services/image.service';

@Component({
  selector: 'code-hero-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {
  page: Page;
  characterList: Character[] = []
  characterName: FormControl;
  imageList: any[] = []
  image: any;
  constructor(
    private characterService: CharacterService,
    private imageService: ImageService,
  ) {
    this.characterName = new FormControl();
    this.page = {
      offset: '0',
      limit: '10'
    }
  }

  ngOnInit(): void {
    this.getCharacters();
    this.filterCharacters();
  }

  getCharacters() {
    this.characterService.getCharacters(this.page).subscribe((res: MarvelResponse) => {
      this.processResults(res);
    });
  }

  filterCharacters() {
    this.characterName.valueChanges.subscribe(name => {
      this.page.argument = name;
      this.getCharacters();
    })
  }

  // findCharactersByName(name: string) {
  //   this.characterService.findCharacterByName(name).subscribe((res) => {
  //     this.processResults(res);
  //   })
  // };

  // findCharactersByNameStartsWith() {
  //   this.characterService.getCharacters(this.page).subscribe((res) => {
  //     this.processResults(res);
  //   })
  // }


  processResults(res: MarvelResponse) {
    this.characterList = res.data.results;
    this.characterList.forEach(character => {
      this.imageList = new Array<any>()
      this.getImage(`${character.thumbnail.path}/standard_small.${character.thumbnail.extension}`)
    })
  }

  getImage(imageUrl: string) {
    this.imageService.getImage(imageUrl).subscribe((baseImage: any) => {
      this.createImageFromBlob(baseImage)
      // let objectURL = 'data:image/jpg;base64,' + baseImage.image;
      // this.imageList.push(this.sanitizer.bypassSecurityTrustUrl(result));
    });
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageList.push(reader.result);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
