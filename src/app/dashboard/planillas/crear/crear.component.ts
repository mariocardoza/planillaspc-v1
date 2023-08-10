import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core'
import * as _moment from 'moment';
import { Moment } from 'moment'
import { MatDatepicker } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { PlanillaService } from 'src/app/core/service/planilla.service';
//import {default as _rollupMoment, Moment} from 'moment';
import { DetallePlanilla, DetalleColumns } from 'src/app/core/models/detalle-planilla.interface';
const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class CrearComponent implements OnInit {
  isSuccess = false;
  isError = false;
  message = '';
  meses = [
    {value:'01', name:'Enero'},
    {value:'02', name:'Febrero'},
    {value:'03', name:'Marzo'},
    {value:'04', name:'Abril'},
    {value:'05', name:'Mayo'},
    {value:'06', name:'Junio'},
    {value:'07', name:'Julio'},
    {value:'08', name:'Agosto'},
    {value:'08', name:'Septiembre'},
    {value:'10', name:'Octubre'},
    {value:'11', name:'Noviembre'},
    {value:'12', name:'Diciembre'},
  ];

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

  displayedColumns: string[] = DetalleColumns.map((col) => col.key)
  columnsSchema: any = DetalleColumns
  dataSource = new MatTableDataSource<DetallePlanilla>()
  valid: any = {}
  data: any;
  token: string;

  periodo = new FormControl(moment());
  planillaFormGroup: FormGroup;

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.periodo.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    //this.periodo.setValue(ctrlValue);
    this.planillaFormGroup.patchValue({Periodo:ctrlValue})
    datepicker.close();
  }


  constructor(private planillaService: PlanillaService, private formBuilder: FormBuilder, private router: Router) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
    }
   }

  ngOnInit(): void {
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
    if(this.planillaFormGroup.valid){
      let periodo = this.planillaFormGroup.value['Periodo']
      this.planillaFormGroup.patchValue({Periodo:periodo.format('MM/Y')})
      const data = {
        ...this.planillaFormGroup.value
      }
      
      this.planillaService.guardarPlanilla(data,this.token).subscribe((result) => {
        if(result['success']){
          this.isSuccess = true;
          this.message = result['message'];
          this.router.navigate(['/dashboard/planillas/'+result['idEncabezado']+'/edit']);
        }else{
          this.isError = true;
          this.message = result['message'];
        }
      })
      this.planillaFormGroup.patchValue({Periodo:periodo})
    }
    
    

    //console.log(data)
  }





 

  

}
