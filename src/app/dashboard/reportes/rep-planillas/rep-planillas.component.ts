import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlanillaService } from 'src/app/core/service/planilla.service';
import { LazyLoadEvent } from 'primeng/api';
import Swal from "sweetalert2";
import { MessageService } from 'primeng/api';
import { IMandamiento } from 'src/app/core/models/planillas/mandamiento';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { GenerateReportService } from 'src/app/core/service/generate-report.service';
import { IReportes, IPlanillaReport } from 'src/app/core/models/reportes';
@Component({
  selector: 'app-rep-planillas',
  providers: [MessageService],
  templateUrl: './rep-planillas.component.html',
  styleUrls: ['./rep-planillas.component.scss']
})

export class RepPlanillasComponent implements OnInit {
  @ViewChild("modalPlanilla") modalPlanilla: ElementRef;
  private lastTableLazyLoadEvent: LazyLoadEvent;
  planillas: any;
  imprimir: any;
  medioscontacto: any = [];
  data:any;
  totalRecords:number = 0;
  tipoCuotas = [
    {value:'1', name:'Cuota alimenticia',code:'C'},
    {value:'2', name:'Bonificaciones',code:'OP'},
    {value:'3', name:'Aguinaldos',code:'A'},
    {value:'4', name:'Indemnizaciones',code:'I'},
    {value:'0', name:'Otras prestaciones',code:'OP'},
  ];
  codigoEstados = [
    {value:'1', name:'En proceso'},
    {value:'2', name:'Enviada'},
    {value:'3', name:'Procesada'},
    {value:'4', name:'Anulada'},
    {value:'5', name:'Pago completado'},
  ];
  reporte: IPlanillaReport;
  constructor(private planillaService: PlanillaService, public modalService: NgbModal, private reportService: GenerateReportService) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
  }
  
  ngOnInit(): void {
    
  }

  obtenerPlanillas(event: LazyLoadEvent){
    this.lastTableLazyLoadEvent = event;
    console.log(event)
    this.planillaService.obtenerPlanillas(this.data.CodigoEmpresa,event.globalFilter || '',event.first || 0,event.rows || 10,event.sortOrder || 1,event.sortField || 'fechaHoraRegistro').subscribe((result) => {
      this.planillas = result['data'];
      this.totalRecords = result['registros'];
    });
  }

  buscarTipoCuota(codigoTipoCuota){
    var valor = this.tipoCuotas.find(e => e.value === codigoTipoCuota);
    if(valor){
      return valor.name;
    }else{
      return '';
    }
  }

  codigoTipoCuota(codigoTipoCuota){
    var valor = this.tipoCuotas.find(e => e.value === codigoTipoCuota);
    if(valor){
      return valor.code;
    }else{
      return '';
    }
  }

  buscarEstadoPlanilla(codigoEstado){
    var valor = this.codigoEstados.find(e => e.value === codigoEstado);
    if(valor){
      return valor.name;
    }else{
      return '';
    }
  }

  claseEstadoPlanilla(codigoEstado){
    if(codigoEstado==1){
      return 'primary';
    }else{
      if(codigoEstado==4){
        return 'danger';
      }else{
        return 'success';
      }
    }
  }

  imprimirComprobante(idEncabezado: number){
    let token:string='d';
    this.planillaService.obtenerPlanilla(idEncabezado,token).subscribe((result)=>{
      if(result['success']){
        this.imprimir = result['data']
        this.medioscontacto = result['data'].mediosContacto;
        this.modalService.open(this.modalPlanilla,{ size: <any>'xl' });
        console.log(this.medioscontacto)
        //this.obtenerPlanillas(this.lastTableLazyLoadEvent);
        
        //this.messageService.add({severity:'success', summary: 'Exito', detail:result.message});
      }
    })
    
  }

  async generatePDF(): Promise<void> {
    this.reporte.titulo ="Planilla de empleados";
    this.reporte.orientacion = 'H';
    await this.reportService.build(this.reporte);
  }

  imprimirPDF(){

    


    const tabla = document.getElementById('contenido');
    const contentHeight = document.querySelector<HTMLElement>('.contenido').offsetHeight;
    // Set the maximum height of each page (adjust as needed)
    const maxHeightPerPage = 700; // For example, assuming each page can hold up to 800px of content
    let specialElementHandlers = {
        // element with id of "bypass" - jQuery style selector
        '#header': function (element, renderer) {
            // true = "handled elsewhere, bypass text extraction"
            return true
        }
    };
    let margins = {
        top: 80,
        bottom: 60,
        left: 40,
        width: 522
    };

    // Calculate the number of pages needed
    const totalPages = Math.ceil(contentHeight / maxHeightPerPage);
    const DATA: HTMLElement = tabla!;
    const doc = new jsPDF('l', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3,
      margins: margins 
    };
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = ((imgProps.height * pdfWidth) / imgProps.width)- 50;
      console.log(pdfHeight)
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_planilla.pdf`);
    });
  }

  isMedios(tipoMedio) {
    let medio = this.medioscontacto.find(o => o.codigoTipoMedioContacto === tipoMedio);
    if(medio){
      return medio.medioContactoPersona
    }else{
      return '';
    }
    
  }

  

}
