import { Component, Input } from '@angular/core';

@Component({
  selector: 'code-hero-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
  @Input('detailList')
  detailList: any;
  @Input('imageList')
  imageList: Array<any> = [];
}


