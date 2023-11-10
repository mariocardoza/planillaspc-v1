import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlanillaService } from 'src/app/core/service/planilla.service';
import { LazyLoadEvent } from 'primeng/api';
import Swal from "sweetalert2";
import { MessageService } from 'primeng/api';
import { IMandamiento } from 'src/app/core/models/planillas/mandamiento';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { EncryptService } from 'src/app/core/service/encrypt.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  providers: [MessageService],
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {
  @ViewChild("modalComprobante") modalComprobante: ElementRef;
  planillas: any = [];
  mandamiento: IMandamiento;
  data:any;
  barcode;
  npe;
  private lastTableLazyLoadEvent: LazyLoadEvent;
  token: string;
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
    {value:'2', name:'Bonificaciones'},
    {value:'3', name:'Aguinaldos'},
    {value:'4', name:'Indemnizaciones'},
    {value:'0', name:'Otras prestaciones'},
  ];
  codigoEstados = [
    {value:'1', name:'En proceso'},
    {value:'2', name:'Pendiente de emitir mandamiento de pago'},
    {value:'3', name:'Mandamiento de pago emitido'},
    {value:'4', name:'Anulada'},
    {value:'5', name:'Pago completado'},
    {value:'6', name:'Finalizada'},
  ];
  px2mmFactor: number;
  totalRecords: number = 0;
  constructor(private planillaService: PlanillaService,private router: Router, private messageService: MessageService, public modalService: NgbModal, private encryptService: EncryptService) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
    }
   }

  ngOnInit(): void {
    this.px2mmFactor = this.calcPx2MmFactor();
    
  }

  vistaEditarPlanilla(id){
    const idEncrypt = this.encryptService.encrypt(id);
    this.router.navigate(['/dashboard/planillas/'+idEncrypt+'/edit']);
  }

  encriptar(id){
    const idEncrypt = this.encryptService.encrypt(id);
    return idEncrypt;
  }

  calcPx2MmFactor() {
    let e = document.createElement('div');
    e.style.position = 'absolute';
    e.style.width = '100mm';
    document.body.appendChild(e);
    let rect = e.getBoundingClientRect();
    document.body.removeChild(e);
    return rect.width / 100;
  }

  obtenerPlanillas(event: LazyLoadEvent){
    this.lastTableLazyLoadEvent = event;
    console.log(event)
    this.planillaService.obtenerPlanillas(this.data.CodigoEmpresa,event.globalFilter || '',event.first || 0,event.rows || 10,event.sortOrder || 1,event.sortField || 'fechaHoraRegistro').subscribe((result) => {
      this.planillas = result['data'];
      this.totalRecords = result['registros'];
    });
  }

  procesarPlanilla(idEncabezado){
    Swal.fire({
      title: '¿Esta seguro?',
      text: "Esta acción guardará la planilla y ya no podrá hacer cambios en ella",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Continuar',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.planillaService.enviarPlanilla(idEncabezado).subscribe((result) => {
          if(result.success){
            this.obtenerPlanillas(this.lastTableLazyLoadEvent);
            this.messageService.add({severity:'success', summary: 'Exito', detail:'Planilla enviada a la PGR con éxito'});
          }
        });  
      }
    })
  }

  buscarTipoCuota(codigoTipoCuota){
    var valor = this.tipoCuotas.find(e => e.value === codigoTipoCuota);
    return valor.name;
  }

  buscarEstadoPlanilla(codigoEstado){
    var valor = this.codigoEstados.find(e => e.value === codigoEstado);
    return valor.name;
  }

  generarPlanilla(idEncabezado:number){
    Swal.fire({
      title: '¿Esta seguro?',
      text: "Esta acción emitirá el Mandamiento de Pago",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.planillaService.generarComprobante(idEncabezado).subscribe((result)=>{
          if(result.success){
            this.obtenerPlanillas(this.lastTableLazyLoadEvent);
            this.messageService.add({severity:'success', summary: 'Exito', detail:result.message});
          }else{
            this.messageService.add({severity:'error', summary: 'Error', detail:result.message});
          }
        })
      }
    })
    
  }

  imprimirComprobante(idEncabezado: number){
    this.planillaService.imprimirComprobante(idEncabezado).subscribe((result)=>{
      if(result.success){
        this.mandamiento = result.data;
        this.barcode = this.mandamiento.codigoBarra;
        let v = this.mandamiento.npe.match(/.{1,4}/g); 
        this.npe = v.join(" "); 
        this.modalService.open(this.modalComprobante,{ size: <any>'lg' });
        this.obtenerPlanillas(this.lastTableLazyLoadEvent);
        //this.messageService.add({severity:'success', summary: 'Exito', detail:result.message});
      }
    })
  }

  claseEstadoPlanilla(codigoEstado){
    if(codigoEstado==1){
      return 'primary';
    }else{
      if(codigoEstado == 2){
        return 'warning';
      }
      if(codigoEstado==4){
        return 'danger';
      }else{
        return 'success';
      }
    }
  }

  anularPlanilla(idEncabezado){
    Swal.fire({
      title: '¿Esta seguro?',
      text: "Esta acción anulará la planilla",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.planillaService.anularPlanilla(idEncabezado).subscribe((res)=>{
          if(res['success']){
            this.obtenerPlanillas(this.lastTableLazyLoadEvent);
            this.messageService.add({severity:'success', summary: 'Exito', detail:'Planilla anulada con éxito'});
          }else{
            this.messageService.add({severity:'error', summary: 'Error', detail:'Ocurrió un error al anular la planilla'});
          }
        })
      }
    })
  }

  imprimirPDF(){
    const tabla = document.getElementById('contenido');
    const DATA: HTMLElement = tabla!;
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      /*const canvas2 = document.getElementById('barcode') as HTMLCanvasElement;
      const jpegUrl = canvas2.toDataURL('image/jpeg');
      doc.addImage(jpegUrl, 'JPEG', 100, 150, 350, 60);*/
      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_mandamiento_pago.pdf`);
    });
  }

}
