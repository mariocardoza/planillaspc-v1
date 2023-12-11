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
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import * as moment from "moment/moment";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts  from 'pdfmake/build/vfs_fonts';
import { imagenes } from 'src/environments/images';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  sello: any;
  unafecha: any;
  medioscontacto: any = [];
  data:any;
  loading:boolean = false;
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
    {value:'2', name:'Pendiente de emitir mandamiento de pago'},
    {value:'3', name:'Mandamiento de pago emitido'},
    {value:'4', name:'Anulada'},
    {value:'5', name:'Pago completado'},
    {value:'6', name:'Finalizada'},
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
    this.planillaService.obtenerPlanillas(this.data.CodigoEmpresa,1,event.globalFilter || '',event.first || 0,event.rows || 10,event.sortOrder || 1,event.sortField || 'fechaHoraRegistro').subscribe((result) => {
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
    let total = 0;
    this.loading = true;
    this.planillaService.obtenerPlanilla(idEncabezado,token).subscribe((result)=>{
      if(result['success']){
        this.imprimir = result['data']
        this.unafecha =  this.imprimir.fechaEnvio;
        this.medioscontacto = result['data'].mediosContacto;
        //this.modalService.open(this.modalPlanilla,{ size: <any>'xl' });
        //console.log(this.medioscontacto)
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
          this.imprimirPDF(array);
         }, 10000);
        
        
        
        //this.obtenerPlanillas(this.lastTableLazyLoadEvent);
        
        //this.messageService.add({severity:'success', summary: 'Exito', detail:result.message});
      }
    })
    
  }

  laFecha(date){
    moment.locale('es');
    let now;
    if(date){
      now = moment(date);
    }else{
      now= moment();
    }
    
    //formato por defecto
    console.log(now)

    //formato predefinido, hay más opciones (ver enlace anterior)
    console.log(now.format('LL'));

    //formato pedido por el OP (los meses en español empiezan por minúscula)
    return now.format('DD MMM YYYY');
  }


  imprimirPDF(array){
    
    const tabla = document.getElementById('sellito');
    const DATA: HTMLElement = tabla!;
    /*const doc = new jsPDF('p', 'pt', '');
    const options = {
      background: 'white',
      scale: 3
    };*/
    html2canvas(DATA, {}).then((canvas) => {
      
      this.sello = canvas.toDataURL('image/PNG');

      

      //setInterval(this.generarArray(array), 5000);
      setTimeout(() => { 
        this.generarArray(array);
       }, 1000);
      
      //console.log(img)
      //this.sello = img;
      //return img
      //console.log(img)

      // Add image Canvas to PDF
      /*const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(this.sello);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(this.sello, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');*/
      //return doc;
    }).then((docResult) => {
      //docResult.save(`${new Date().toISOString()}_mandamiento_pago.pdf`);
    });
  }

  generarArray(array){
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
                          image: this.sello, width:160, rowSpan:2,
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

  isMedios(tipoMedio) {
    let medio = this.medioscontacto.find(o => o.codigoTipoMedioContacto === tipoMedio);
    if(medio){
      return medio.medioContactoPersona
    }else{
      return '';
    }
  }

  createPDF(){
    let token = 'ghgshgsdhg';
    this.planillaService.obtenerPlanilla(1,token).subscribe((result)=>{
      if(result['success']){
        
      }
    })
    
  }

  
  

}
