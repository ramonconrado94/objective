import { Component, OnInit } from '@angular/core';
import { CharacterService } from 'projects/code-hero/services/character.service';
import { Page } from 'projects/code-hero/models/page';
import { FormControl } from '@angular/forms';
import { CharacterResponse, Character } from 'projects/code-hero/models/character';
import { ImageService } from 'projects/code-hero/services/image.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { range } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'code-hero-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {
  characterName: FormControl;
  characterList: Character[] = []
  imageList: any[] = []

  page: Page;
  pages: number[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  isLoading: boolean = false;

  constructor(
    private characterService: CharacterService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer
  ) {
    this.characterName = new FormControl();
    this.page = {
      offset: 0,
      limit: 10
    }
  }

  ngOnInit(): void {
    let page = sessionStorage.getItem('page');
    if (page) {
      this.page = JSON.parse(page);
      this.characterName.setValue(this.page.argument)
    }
    this.getCharacters();
    this.filterCharacters();
  };

  ngOnDestroy(): void {
    sessionStorage.setItem('page', JSON.stringify(this.page));
  }

  getCharacters() {
    this.isLoading = true;
    this.characterService.getCharacters(this.page).subscribe((res: CharacterResponse) => {
      this.getPages(res.data.offset, res.data.limit, res.data.total)
      this.characterList = res.data.results;
      this.getImageList();
      this.isLoading = false;
    });
  }

  filterCharacters() {
    this.characterName.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(name => {
        this.page.argument = name;
        this.page.offset = 0;
        this.getCharacters();
      })
  }

  async getImageList() {
    this.imageList = new Array<any>()
    this.characterList.forEach(async character => {
      let imagePath = `${character.thumbnail.path}/standard_small.${character.thumbnail.extension}`;
      await this.imageService.getImage(imagePath).then((baseImage: any) => {
        let trustUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(baseImage));
        this.imageList.push(trustUrl);
      })
    });
  }

  selectPage(page: number) {
    this.page.offset = (page * this.page.limit) - 10;
    this.getCharacters();
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
