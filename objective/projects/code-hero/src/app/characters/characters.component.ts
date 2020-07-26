import { Component, OnInit } from '@angular/core';
import { CharacterService } from 'projects/code-hero/services/character.service';
import { Page } from 'projects/code-hero/models/page';
import { FormControl } from '@angular/forms';
import { CharacterResponse, Character } from 'projects/code-hero/models/character';
import { ImageService } from 'projects/code-hero/services/image.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { range } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'code-hero-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {
  characterList: Character[] = []
  characterName: FormControl;
  imageList: any[] = []
  image: any;

  page: Page;
  pages: number[] = [];

  currentPage: number = 1;
  totalPages: number = 1;
  range: any;

  pageLimit: any;

  showList: boolean = true;

  constructor(
    private characterService: CharacterService,
    private imageService: ImageService,
    private router: Router
  ) {
    this.characterName = new FormControl();
    this.page = {
      offset: 0,
      limit: 10
    }
  }

  ngOnInit(): void {
    this.getCharacters();
    this.filterCharacters();
  }

  getCharacters() {
    this.characterService.getCharacters(this.page).subscribe((res: CharacterResponse) => {
      this.processResults(res);
      this.getPages(res.data.offset, res.data.limit, res.data.total)
    });
  }

  getDetails(characterId: number) {
    this.router.navigate(['herois/' + characterId])
  }

  selectPage(page: number) {
    this.page.offset = (page * this.page.limit) - 10;
    this.getCharacters();
  }

  filterCharacters() {
    this.characterName.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(name => {
        this.showList = true;
        this.page.argument = name;
        this.page.offset = 0;
        this.getCharacters();
      })
  }

  processResults(res: CharacterResponse) {
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

  getPages(offset: number, limit: number, size: number) {
    this.currentPage = this.getCurrentPage(offset, limit);
    this.totalPages = this.getTotalPages(limit, size);
    this.pages = [];
    range(this.currentPage - 2, 5).subscribe(page => {
      this.pages.push(page)
    })

  }

  getCurrentPage(offset: number, limit: number): number {
    return Math.floor(offset / limit) + 1;
  }

  getTotalPages(limit: number, total: number): number {
    return Math.ceil(Math.max(total, 1) / Math.max(limit, 1));
  }
}
