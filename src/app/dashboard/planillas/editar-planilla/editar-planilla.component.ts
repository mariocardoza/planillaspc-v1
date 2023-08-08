import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlanillaService } from 'src/app/core/service/planilla.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-editar-planilla',
  templateUrl: './editar-planilla.component.html',
  styleUrls: ['./editar-planilla.component.scss']
})
export class EditarPlanillaComponent implements OnInit {
  isSuccess = false;
  isError = false;
  message = '';
  data: any;
  token: string;
  planilla: any;
  empleados: any;
  planillaFormGroup: FormGroup;
  tipoCuotas = [
    {value:'1', name:'Cuota alimenticia'},
    {value:'3', name:'Aguinaldos'},
    {value:'0', name:'Otras prestaciones'},
  ];
  codigoEstados = [
    {value:'1', name:'En proceso'},
    {value:'2', name:'Enviada'},
    {value:'3', name:'Procesada'},
  ];
  constructor(private formBuilder: FormBuilder,private route: ActivatedRoute, private planillaService: PlanillaService) { 
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
    }
  }

  ngOnInit(): void {
    let id = this.route.snapshot.params.id;
    this.getPlanilla(id)
    this.planillaFormGroup = this.formBuilder.group({
      Periodo: ['', Validators.required],
      CodigoTipoCuota: ['', Validators.required],
      NoMandamiento: ['0',''],
      CodigoEstado: ['1',''],
      CodigoPagaduria:[this.data.CodigoPagaduria,''],
      CodigoEmpresa:[this.data.CodigoEmpresa,''],
      Observacion:['',''],
    });
  }

  onSubmit(){

  }

  getPlanilla(idEncabezado){
    this.planillaService.obtenerPlanilla(idEncabezado,this.token).subscribe((result) => {
      this.planilla = result['data']
      this.empleados = this.planilla.empleados
    })
  }

}
