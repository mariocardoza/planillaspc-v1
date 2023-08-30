import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import { ICredencial } from "src/app/core/models/credencial";
import * as XLSX from 'xlsx'
import { PlanillaService } from "src/app/core/service/planilla.service";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { DetallePlanilla } from "src/app/core/models/detalle-planilla.interface";
@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  providers: [MessageService],
  styleUrls: ["./file-upload.component.scss"],
})
export class FileUploadComponent implements OnInit {
  @Input() config: any[] = [];
  @Input() usePrimary: boolean = true; // input
  @Input() mantenimientoTabla: string = ''; // input
  @Input() llaveHeredada: string = ''; // input
  @Output() return: EventEmitter<any>;
  myFiles: string[] = [];
  separador: string = '|';
  enableTrigger: string = '';
  camposSumar: any;
  resultsShow: any[] = [];
  records: any = {};
  registros: DetallePlanilla[] = [];
  metadataUtilizar: any[] = [];
  campos: string[] = [];
  descriptionColumns: string[] = [];
  campoPrimary: string = '';
  objUser: ICredencial = null;
  loadedData: boolean = false;
  constructor(private planillaService: PlanillaService,private messageService: MessageService, private router: Router) {
    this.return = new EventEmitter<any>();
  }

  ngOnInit() {
    this.objUser = JSON.parse(localStorage.getItem('PlanillaUser'));
    this.separador = this.config['$'] ? this.config['$']['separador'] : '|';
    this.camposSumar = this.config['_'] ? this.config['_'].split(',') : [];
   //  this.enableTrigger = this.config['$']['trigger'] ? this.config['$']['trigger'] : '';
    // console.log(this.separador, this.camposSumar);
    // console.log(this.enableTrigger);

    if(this.usePrimary){
      this.campoPrimary = 'dui'
      // console.log(this.campoPrimary);
      //this.metadataUtilizar = this.metadataUtilizar.filter((campo) => campo.codigoDetalleMantenimientoTabla !== 1);
      // console.log(this.metadataUtilizar);
    }
    this.metadataUtilizar.forEach((field) => {
      this.campos.push(field.codigoCampo.trim());
      this.descriptionColumns.push(field.nombreCampo.trim());
    } );

    // console.log(this.campos);
  }

  getFileDetails(files) {
    console.log(files)
    if (files.length === 0) return;

    if (files.length > 0) this.myFiles[0] = files[0];

    let fileToUpload = <File>files[0];

    if (!this.validateFile(fileToUpload.name)) {
      this.messageService.add({severity:'error', summary: 'Error',detail: 'Formato de archivo inválido'});
      //this.toastService.show("Tipo de archivo inválido.", { classname: 'bg-dark text-light', delay: 3000, header: 'Notificación!' });
      // this.loading = false;
      this.myFiles = [];
      return;
    }

    const reader = new FileReader();
    reader.readAsBinaryString(fileToUpload);

    reader.onload = () => {
      var empleados = XLSX.read(reader.result,{type:'binary'});
      var sheetNames = empleados.SheetNames;
      this.registros = XLSX.utils.sheet_to_json(empleados.Sheets[sheetNames[0]]);
      this.loadedData = true;
      console.log(this.registros)
      this.records.Registro = this.registros
      this.json2array(this.registros)
      this.messageService.add({severity:'success', summary: 'Exito',detail: "Registros cargados con éxito"});
      /*let csvData = reader.result;
       console.log(csvData);
      let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
       //console.log(csvRecordsArray);
      if (csvRecordsArray.length > 0){
        this.loadedData = true;
        let result = this.obtenerDatosArray(csvRecordsArray);
        console.log(result)
        this.registros = result;
        this.records.Registro = result;
        if(this.camposSumar.length > 0){
          this.sumarCampos();
        }
        // this.guardarRegistrosCargados();
      } else {
        //this.toastService.show("No se encontraron registros.", { classname: 'bg-dark text-light', delay: 3000, header: 'Notificación!' });
      }*/
    };
  }

  obtenerDatosArray(csvRecordsArray: any[]){
    console.log(this.separador)
    let registrosRetorno = [];
    csvRecordsArray.forEach((value,index) => {
      console.log(<string>value)
      let actual = (<string>value).split(this.separador);
      //console.log(actual)
      let registro = {};

     /* if(this.usePrimary){
        registro['dui'] = actual[index];
      }*/

      this.campos.forEach((campo, index) => {
        console.log(campo)
        registro[campo] = actual[index]
      });

      registrosRetorno.push(registro);
    });
    // console.log({registrosRetorno});
    return registrosRetorno;
  }

  sumarCampos(){
    // console.log(this.camposSumar);
    this.resultsShow = [];
    this.camposSumar.forEach((key) => {
      this.resultsShow.push({
        nombre: key,
        resultado: 0,
      })
    });

    this.registros.forEach((record) => {
      this.resultsShow.forEach((campo) => {
        campo.resultado += parseFloat( record[campo.nombre] );
      })
    })
    // console.log(this.resultsShow);
  }

  validateFile(name: String) {
    const ext = name.substring(name.lastIndexOf('.') + 1);
    return ext.toLowerCase() == 'xls' || ext.toLowerCase() == 'xlsx';
  }

  guardarRegistrosCargados () {
    console.log(this.registros)
    this.planillaService.guardarPlanillaImportada(this.registros,this.objUser.Token).subscribe(
        res => {
           //console.log(res['message'])
           if(res['success']){
            this.messageService.add({severity:'success', summary: 'Exito',detail: "Planilla cargada con éxito"});
            this.router.navigate(['/dashboard/planillas/'+res['lastId']+'/edit']);
           }else{
            this.messageService.add({severity:'error', summary: 'Error',detail: res['message']});
           }
          
        }
    )
  }

  json2array(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
  }

}
