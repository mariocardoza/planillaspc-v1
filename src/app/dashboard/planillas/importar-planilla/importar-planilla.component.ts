import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-importar-planilla',
  templateUrl: './importar-planilla.component.html',
  providers: [MessageService],
  styleUrls: ['./importar-planilla.component.scss']
})
export class ImportarPlanillaComponent implements OnInit {
  loading: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  download(){
    this.loading = true;

        setTimeout(() => {
          window.open('/assets/files/archivo_ejemplo.xlsx', '_blank');
            this.loading = false
        }, 2000);
  }

}
