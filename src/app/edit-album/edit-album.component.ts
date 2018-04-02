import { Component, Input, OnInit } from '@angular/core';
import { Album } from '../album.model';

@Component({
  selector: 'app-edit-album',
  templateUrl: './edit-album.component.html',
  styleUrls: ['./edit-album.component.css']
})


export class EditAlbumComponent implements OnInit {
  @Input() selectedAlbum;

  constructor() { }

  ngOnInit() {
  }

}
