import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import { ICredencial } from "src/app/core/models/credencial";

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
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
  registros: any[] = [];
  metadataUtilizar: any[] = [];
  campos: string[] = [];
  descriptionColumns: string[] = [];
  campoPrimary: string = '';
  objUser: ICredencial = null;
  loadedData: boolean = false;
  constructor() {
    this.return = new EventEmitter<any>();
  }

  ngOnInit() {
    this.objUser = JSON.parse(localStorage.getItem('PlanillaUser'));
    this.separador = this.config['$'] ? this.config['$']['separador'] : '|';
    this.camposSumar = this.config['_'] ? this.config['_'].split(',') : [];
    this.enableTrigger = this.config['$']['trigger'] ? this.config['$']['trigger'] : '';
    // console.log(this.separador, this.camposSumar);
    // console.log(this.enableTrigger);

    if(this.usePrimary){
      this.campoPrimary = this.metadataUtilizar.find((campo) => campo.codigoDetalleMantenimientoTabla === 1).codigoCampo.trim();
      // console.log(this.campoPrimary);
      this.metadataUtilizar = this.metadataUtilizar.filter((campo) => campo.codigoDetalleMantenimientoTabla !== 1);
      // console.log(this.metadataUtilizar);
    }
    this.metadataUtilizar.forEach((field) => {
      this.campos.push(field.codigoCampo.trim());
      this.descriptionColumns.push(field.nombreCampo.trim());
    } );

    // console.log(this.campos);
  }

  getFileDetails(files) {
    if (files.length === 0) return;

    if (files.length > 0) this.myFiles[0] = files[0];

    let fileToUpload = <File>files[0];

    if (!this.validateFile(fileToUpload.name)) {
      //this.toastService.show("Tipo de archivo inválido.", { classname: 'bg-dark text-light', delay: 3000, header: 'Notificación!' });
      // this.loading = false;
      this.myFiles = [];
      return;
    }

    const reader = new FileReader();
    reader.readAsText(fileToUpload);

    reader.onload = () => {
      let csvData = reader.result;
      // console.log(csvData);
      let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
      // console.log(csvRecordsArray);
      if (csvRecordsArray.length > 0){
        this.loadedData = true;
        let result = this.obtenerDatosArray(csvRecordsArray);
        this.registros = result;
        this.records.Registro = result;
        if(this.camposSumar.length > 0){
          this.sumarCampos();
        }
        // this.guardarRegistrosCargados();
      } else {
        //this.toastService.show("No se encontraron registros.", { classname: 'bg-dark text-light', delay: 3000, header: 'Notificación!' });
      }
    };
  }

  obtenerDatosArray(csvRecordsArray: any[]){
    let registrosRetorno = [];
    csvRecordsArray.forEach(value => {
      let actual = (<string>value).split(this.separador);

      let registro = {};

      if(this.usePrimary){
        registro[this.campoPrimary] = this.llaveHeredada;
      }

      this.campos.forEach((campo, index) => {
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
    return ext.toLowerCase() == 'txt' || ext.toLowerCase() == 'csv';
  }

  guardarRegistrosCargados () {
    /*this.displayTableService.guardarRegistrosSubidos(this.mantenimientoTabla, this.enableTrigger, this.llaveHeredada, this.records).subscribe(
        res => {
          // console.log(res)
          if(res.statusCode === 200){
            this.buttonPdfService.actualizarTabla();
            this.toastService.show(`Se guardaron los datos correctamemte.`, { classname: 'bg-success text-light', delay: 5000, header: "Acción exitosa." });
            this.return.emit(this.records);
          }else {
            this.toastService.show(res.reasonPhrase, { classname: 'bg-dark text-light', delay: 3000, header: 'Error!' });
          }
        }
    )*/
  }

}
