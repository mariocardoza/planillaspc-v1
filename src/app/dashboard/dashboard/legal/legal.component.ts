import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss']
})
export class LegalComponent implements OnInit {
  loading: boolean = false;
  loading1: boolean = false;
  loading2: boolean = false;
  loading3: boolean = false;
  loading4: boolean = false;
  loading5: boolean = false;
  loading6: boolean = false;
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

  download1(){
    this.loading1 = true;

        setTimeout(() => {
          window.open('/assets/files/Decreto_140_Aguinaldos_1997.pdf', '_blank');
            this.loading1 = false
        }, 2000);
  }

  download2(){
    this.loading2 = true;

        setTimeout(() => {
          window.open('/assets/files/Decreto_167_aguinaldos_1o_de_diciembre_1998.pdf', '_blank');
            this.loading2 = false
        }, 2000);
  }

  download3(){
    this.loading3 = true;

        setTimeout(() => {
          window.open('/assets/files/Decreto_168_30_reformas_indemnizacionesyprestaciones.pdf', '_blank');
            this.loading3 = false
        }, 2000);
  }

  download4(){
    this.loading4 = true;

        setTimeout(() => {
          window.open('/assets/files/Decreto_212_solvencia.pdf', '_blank');
            this.loading4 = false
        }, 2000);
  }

  download5(){
    this.loading5 = true;

        setTimeout(() => {
          window.open('/assets/files/Decreto_503_30_Disposiciones_especiales_aguinaldo.pdf', '_blank');
            this.loading5 = false
        }, 2000);
  }

  download6(){
    this.loading6 = true;

        setTimeout(() => {
          window.open('/assets/files/Decreto_1015_solvencia_cargos_publicos_2002.pdf', '_blank');
            this.loading6 = false
        }, 2000);
  }

}
