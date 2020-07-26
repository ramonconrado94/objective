import { Component, OnInit, Input } from '@angular/core';
import { Detail } from 'projects/code-hero/models/details';

@Component({
  selector: 'code-hero-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  @Input('detailList')
  detailList: Array<Detail> = [];
  @Input('imageList')
  imageList: Array<any> = [];
  constructor(
  ) {
  }
  ngOnInit(): void {
  }
}
