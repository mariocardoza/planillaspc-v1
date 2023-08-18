import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-importar-planilla',
  templateUrl: './importar-planilla.component.html',
  providers: [MessageService],
  styleUrls: ['./importar-planilla.component.scss']
})
export class ImportarPlanillaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
