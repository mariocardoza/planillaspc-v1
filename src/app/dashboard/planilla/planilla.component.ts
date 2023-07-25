import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-planilla',
  templateUrl: './planilla.component.html',
  styleUrls: ['./planilla.component.scss']
})
export class PlanillaComponent implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit(): void {
  }

  historial(){
    this.router.navigate(['/dashboard/planillas/historial']);
  }

  crear(){
    this.router.navigate(['/dashboard/planillas/create']);
  }

}
