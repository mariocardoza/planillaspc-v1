import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss']
})
export class LegalComponent implements OnInit {
  loading: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  download(){
    this.loading = true;

        setTimeout(() => {
          window.open('/assets/files/codigo_de_familia_el_salvador.pdf#page=60', '_blank');
            this.loading = false
        }, 2000);
  }

}
