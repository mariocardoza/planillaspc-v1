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
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts  from 'pdfmake/build/vfs_fonts';
import { imagenes } from 'src/environments/images';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as moment from "moment/moment";
@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  providers: [MessageService],
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {
  @ViewChild("modalComprobante") modalComprobante: ElementRef;
  @ViewChild("modalEstados") modalEstados: ElementRef;
  @ViewChild("modalRecibo") modalRecibo: ElementRef;
  planillas: any = [];
  loading:boolean = false;
  medioscontacto: any = [];
  imprimir: any;
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
    {value:'1', name:'Cuota alimenticia',code:'C'},
    {value:'2', name:'Bonificaciones',code:'OP'},
    {value:'3', name:'Aguinaldos',code:'A'},
    {value:'4', name:'Indemnizaciones',code:'I'},
    {value:'0', name:'Otras prestaciones',code:'OP'},
  ];
  codigoEstados = [
    {value:'1', name:'En proceso'},
    {value:'2', name:'Pendiente de emitir mandamiento de pago'},
    {value:'3', name:'Mandamiento de pago emitido'},
    {value:'4', name:'Anulada'},
    {value:'5', name:'Pago completado'},
    {value:'6', name:'Finalizada'},
  ];
  codigoEstadosTimeline = [
    {value:'1', name:'En proceso'},
    {value:'2', name:'Pendiente de emitir mandamiento de pago'},
    {value:'3', name:'Mandamiento de pago emitido'},
    {value:'5', name:'Pago completado'},
    {value:'6', name:'Finalizada'},
  ];
  track: any = [];
  px2mmFactor: number;
  totalRecords: number = 0;
  estadoActual
  constructor(private planillaService: PlanillaService,private router: Router, private messageService: MessageService, public modalService: NgbModal, private encryptService: EncryptService) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
    }
   }

  ngOnInit(): void {
    this.px2mmFactor = this.calcPx2MmFactor();
    
  }

  verTrack(id){
    this.planillaService.obtenerPlanilla(id,this.token).subscribe((result) => {
      if(result['success']){
        this.track = result['track'];
        this.estadoActual = result['data'].codigoEstado;
      }  
    })
    this.modalService.open(this.modalEstados,{ size: <any>'md' });
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
    this.planillaService.obtenerPlanillas(this.data.CodigoEmpresa,0,event.globalFilter || '',event.first || 0,event.rows || 10,event.sortOrder || 1,event.sortField || 'fechaHoraRegistro').subscribe((result) => {
      this.planillas = result['data'];
      this.totalRecords = result['registros'];
    });
  }

  procesarPlanilla(idEncabezado){
    this.planillaService.verificarDistribucion(idEncabezado,this.data.TipoEmpresa).subscribe((result) => {
      if(result.cuantos > 0){
        this.messageService.add({severity:'error', summary: 'Error', detail:'Verifique la correcta distribucion de las prestaciones'});
        Swal.fire({
          html: result.duis
        });
      }else{
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

  imprimirPlanilla(idEncabezado: number){
    let token:string='d';
    let total = 0;
    this.loading = true;
    this.planillaService.obtenerPlanilla(idEncabezado,token).subscribe((result)=>{
      if(result['success']){
        this.imprimir = result['data']
        this.medioscontacto = result['data'].mediosContacto;
        let array = Array();
        let aux = Array();
        aux.push("N°")
        aux.push("7. NOMBRE DEL ALIMENTANTE (DEMANDADO)")
        aux.push("8. NOMBRE DEL ALIMENTARIO (DEMANDANTE)")
        aux.push("9. No. EXPEDIENTE FISICO")
        aux.push("10. No. EXPEDIENTE ELECTRÓNICO")
        aux.push("11. TIPO DE INGRESO")
        aux.push("12. MONTO")
        aux.push("13. NÚMERO DE IDENTIFICACIÓN")
        array.push(aux)
        for(let i=0; i < this.imprimir.detalles.length; i++){
          let aux = Array();
          aux.push(i+1)
          aux.push(this.imprimir.detalles[i].apellidosDemandado+" "+this.imprimir.detalles[i].nombresDemandado)
          aux.push(this.imprimir.detalles[i].apellidosDemandante+" "+this.imprimir.detalles[i].nombresDemandante)
          aux.push(this.imprimir.detalles[i].noExpediente)
          aux.push(this.imprimir.detalles[i].codigoExpediente)
          aux.push(this.codigoTipoCuota(this.imprimir.codigoTipoCuota))
          aux.push("$"+this.imprimir.detalles[i].monto.toFixed(2))
          aux.push(this.imprimir.detalles[i].duIdemandado)
          array.push(aux)
          total+=this.imprimir.detalles[i].monto;
        }

          let footer = Array();
          footer.push('')
          footer.push('')
          footer.push('')
          footer.push('')
          footer.push('')
          footer.push('')
          footer.push("$"+total.toFixed(2))
          footer.push('')

          array.push(footer)
        
        setTimeout(() => { 
          this.generarReporte(array);
         }, 10000);
        
        
        
        //this.obtenerPlanillas(this.lastTableLazyLoadEvent);
        
        //this.messageService.add({severity:'success', summary: 'Exito', detail:result.message});
      }
    })
    
  }

  generarReporte(array){
    const fecha = moment();
    console.log(this.imprimir)
        const pdfDefinition: any = {
          defaultStyle: {
            fontSize: 7,
          },
          // by default we use portrait, you can change it to landscape if you wish
          pageOrientation: 'landscape',
  
          // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
          pageMargins: [ 40, 110, 40, 60 ],
          footer: (currentPage, pageCount) => {
            var t = [{
              layout: "noBorders",
              fontSize: 8,
              margin: [40 , 10],
              columns: [
                {
                  text: 'Generado el ' + fecha.format('DD/MM/YYYY HH:mm:ss'),
                  fontSize: 8,
                  width: 400
                },
                {
                  text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                  alignment: 'right',
                  fontSize: 8
                }
              ],
            }];
      
            return t;
          },
          header: [
            {
              margin: [ 40, 10, 40, 5 ],
              columns: [
                {
                  table: {
                    widths: [ '10%','68%','22%'],
                    body: [
                      [
                        { image: imagenes.imageTest, width:80, rowSpan:2 },
                        { text: 'PROCURADURÍA GENERAL DE LA REPÚBLICA', alignment:'center', fontSize:'18', style:'headers', },
                        {
                          text: 'Solo vista previa', width:160, rowSpan:2,
                        }
                      ],[
                        '',
                        {
                          table:{
                            widths : ['*','*','20%'],
                            style:'headers',
                            body:[
                              [
                                {text: '1. NOMBRE DE LA EMPRESA O INSTITUCIÓN: '+this.imprimir.nombreComercial,style:'tableHeader',rowSpan:2,alignment:'left'},
                                {text: '2. DIRECCIÓN Y TELÉFONO: '+this.isMedios("2"),style:'tableHeader',alignment:'left'},
                                {text: '3. TEL. - FAX.: ', style:'tableHeader', rowSpan:2,alignment:'left'},
                              ],
                              [
                                {},
                                {text:'4. CORREO: '+this.isMedios("1"),style:'tableHeader',alignment:'left'},
                                {}
                              ],
                              [
                                {text:'CÓDIGO DE EMPRESA: '+this.data.CodigoPGR, style:'tableHeader',alignment:'left'},
                                {text:'5. MES A PAGAR: '+this.imprimir.mes, style:'tableHeader',alignment:'left'},
                                {text:'6. AÑO: '+this.imprimir.anio, style:'tableHeader',alignment:'left'},
                              ]
                            ]
                          },
                        },
                        ''
                      ],
                    ],
                  },
                  layout: 'noBorders'
                }/*,{
                  image: this.sello, width:100, 
                }*/
              ],
            }
          ],
          content: [
            {
              table:{
                headerRows: 1,
                style: 'tables',
                widths : ['2%','*','*','10%','10%','5%','6%','10%'],
                body: 
                  array
              },
            },{
              columns: [
                {
                  text: 'Observaciones: '+this.imprimir.observacion, margin:[0,5,0,2],
                },{
                  text:''
                },
                ,{
                  text: '' ,
                  //absolutePosition: {x:320}
                },
                ,{
                  text:''
                },
                /*{
                  text: "F. _____________________________",margin:[0,5,0,0],
                },{
                  text: "F. _____________________________",margin:[0,5,0,0],
                }*/
              ]
            },
            {
              columns: [
                {
                  text: 'CERTIFICO QUE LA INFORMACIÓN SUMINISTRADA EN ESTA PLANILLA ES CORRECTA Y QUE LA MISMA NO ME EXIME DE RESPONSABILIDAD LEGAL POR ERRORES O INEXACTITUDES',fontSize: 6,
                },
                /*{
                  text: "NOMBRE DEL PAGADOR",fontSize: 6,
                },{
                  text: "FIRMA Y SELLO DEL PAGADOR",fontSize: 6,
                }*/
              ]
            }
           
          ],
          styles: {
            headers: {
              fontSize: 18,
              bold: true
            },
            tables: {
              fontSize: 7,
              bold: false
            },
            tableHeader: {
              fontSize: 9,
              bold: false
            },
          }
        }

        const pdf = pdfMake.createPdf(pdfDefinition);
        
        pdf.download('reporte_planilla.pdf');

        this.loading = false;
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

  isMedios(tipoMedio) {
    let medio = this.medioscontacto.find(o => o.codigoTipoMedioContacto === tipoMedio);
    if(medio){
      return medio.medioContactoPersona
    }else{
      return '';
    }
  }

  imprimirRecibo(idEncabezado: number){
    this.planillaService.imprimirComprobante(idEncabezado).subscribe((result)=>{
      if(result.success){
        this.mandamiento = result.data;
        this.barcode = this.mandamiento.codigoBarra;
        let v = this.mandamiento.npe.match(/.{1,4}/g); 
        this.npe = v.join(" "); 
        this.modalService.open(this.modalRecibo,{ size: <any>'lg' });
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

  codigoTipoCuota(codigoTipoCuota){
    var valor = this.tipoCuotas.find(e => e.value === codigoTipoCuota);
    if(valor){
      return valor.code;
    }else{
      return '';
    }
  }

  buscarTrackPlanilla(codigoEstado){
    //console.log(this.track)
    let estadoActual = this.estadoActual;
    let color = '';
    if(estadoActual < codigoEstado){
      //console.log("rojo "+ estadoActual+" "+codigoEstado)
      color = '#DF0101'
    }else{
      if(estadoActual == codigoEstado && estadoActual != '6'){
        //console.log("amarillo" + estadoActual+" "+codigoEstado)
        color = '#01DF01'
      }else{
        if(estadoActual == '6'){
          //console.log("verde ultimo" + estadoActual+" "+codigoEstado)
          color = '#01DF01'
        }else{
          //console.log("verde" + estadoActual+" "+codigoEstado)
          color = '#01DF01'
        }
      }
    }
    return color;
    /*var valor = this.track.includes(codigoEstado);
    //console.log(valor)
    return valor;*/
  }

}
