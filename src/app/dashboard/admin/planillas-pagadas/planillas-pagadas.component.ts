import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { PlanillaService } from 'src/app/core/service/planilla.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IMandamiento } from 'src/app/core/models/planillas/mandamiento';
import { MessageService } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as moment from "moment/moment";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts  from 'pdfmake/build/vfs_fonts';
import { imagenes } from 'src/environments/images';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-planillas-pagadas',
  templateUrl: './planillas-pagadas.component.html',
  providers: [MessageService],
  styleUrls: ['./planillas-pagadas.component.scss']
})
export class PlanillasPagadasComponent implements OnInit {
  @ViewChild("modalComprobante") modalComprobante: ElementRef;
  @ViewChild("modalDocumento") modalDocumento: ElementRef;
  @ViewChild("modalVerDocumento") modalVerDocumento: ElementRef;
  imprimir: any;
  medioscontacto: any = [];
  mandamientos: IMandamiento[];
  loading: boolean = false;
  mandamiento: IMandamiento;
  totalRecords: number = 0;
  barcode: string;
  npe: string;
  bancos: any[];
  verC:any;
  carpetaInstaciada: string;
  actualFile:any = '';
  public response: { dbPath: '' }
  comprobanteForm: FormGroup;
  private lastTableLazyLoadEvent: LazyLoadEvent;
  data:any;
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
  LarutaImagenComprobante: string;
  elCodigoEstado: string;
  constructor(private planillaService: PlanillaService, public modalService: NgbModal, private messageService: MessageService, private formBuilder: FormBuilder) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
  }

  ngOnInit(): void {
    this.obtenerBancos();
    this.carpetaInstaciada = 'comprobantes/'+this.data.CodigoPGR;
    this.comprobanteForm = this.formBuilder.group({
      RutaDocumento: ['',Validators.required],
      NoComprobantePago: ['',Validators.required],
      CodInstitucionFinanciera:['',Validators.required],
      IdTabla: ['',Validators.required]
    });
  }

  obtenerBancos(){
    this.planillaService.listadoBancos().subscribe((result) => {
      this.bancos = result.data;
    });
  }

  obtenerComprobantes(event: LazyLoadEvent){
    this.lastTableLazyLoadEvent = event;
    this.planillaService.obtenerComprobantesPagados(this.data.CodigoPagaduria,event.globalFilter || '',event.first || 0,event.rows || 10,event.sortOrder || 1,event.sortField || 'idControl').subscribe((result) => {
      this.mandamientos = result.data;
      this.totalRecords = result.registros;
    });
  }

  verEditarComprobante(mandamiento: IMandamiento){
    this.verC = mandamiento;
    if(this.verC.codigoEstado == "3"){
      this.elCodigoEstado = "3";
      this.LarutaImagenComprobante = mandamiento.rutaImagenComprobante;
      this.comprobanteForm.patchValue({IdTabla:mandamiento.idControl})
      this.comprobanteForm.patchValue({CodInstitucionFinanciera:parseInt(mandamiento.codInstitucionFinanciera)})
      this.comprobanteForm.patchValue({RutaDocumento:''})
      this.comprobanteForm.patchValue({NoComprobantePago:mandamiento.noComprobantePago})
      this.actualFile = this.verC.rutaImagenComprobante;
      this.modalService.open(this.modalDocumento,{ size: <any>'lg' });
    }else{
      this.actualFile = this.verC.rutaImagenComprobante;
      this.modalService.open(this.modalVerDocumento,{ size: <any>'lg' });
    }
  }

  imprimirComprobante(idEncabezado: number){
    let token:string='d';
    this.planillaService.obtenerPlanilla(idEncabezado,token).subscribe((result)=>{
      if(result['success']){
        this.imprimir = result['data']
        this.medioscontacto = result['data'].mediosContacto;
        //this.modalService.open(this.modalPlanilla,{ size: <any>'xl' });
        //console.log(this.medioscontacto)
        this.imprimir = result['data']
        this.medioscontacto = result['data'].mediosContacto;
        let array = Array();
        let aux = Array();
        aux.push("7. NOMBRE DEL ALIMENTARIO")
        aux.push("8. NOMBRE DEL ALIMENTANTE")
        aux.push("9. No. EXPEDIENTE FISICO")
        aux.push("10. No. EXPEDIENTE ELECTRÓNICO")
        aux.push("11. TIPO DE INGRESO")
        aux.push("12. MONTO")
        aux.push("13. NÚMERO DE IDENTIFICACIÓN")
        array.push(aux)
        for(let i=0; i < this.imprimir.detalles.length; i++){
          let aux = Array();
          aux.push(i+1+". "+this.imprimir.detalles[i].apellidosDemandante+" "+this.imprimir.detalles[i].nombresDemandante)
          aux.push(this.imprimir.detalles[i].apellidosDemandado+" "+this.imprimir.detalles[i].nombresDemandado)
          aux.push(this.imprimir.detalles[i].noExpediente)
          aux.push(this.imprimir.detalles[i].codigoExpediente)
          aux.push(this.codigoTipoCuota(this.imprimir.codigoTipoCuota))
          aux.push("$"+this.imprimir.detalles[i].monto.toFixed(2))
          aux.push(this.imprimir.detalles[i].duIdemandado)

          array.push(aux)
        }
        const fecha = moment();
        //console.log(array)
        const pdfDefinition: any = {
          filename: "planilla_"+this.imprimir.nombreComercial+"_"+this.imprimir.mes+"_"+this.imprimir.anio+".pdf",
          info: {
            title: 'planilla_'+this.imprimir.nombreComercial+"_"+this.imprimir.mes+"_"+this.imprimir.anio+".pdf",
          },
          defaultStyle: {
            fontSize: 7,
          },
          // by default we use portrait, you can change it to landscape if you wish
          pageOrientation: 'landscape',

          // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
          pageMargins: [ 40, 110, 40, 60 ],
          footer: (currentPage, pageCount) => {
            var t = {
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
              
            };
      
            return t;
          },
          header: [
            {
              margin: [ 40, 10, 40, 5 ],
              columns: [
                {
                  table: {
                    widths: [ '10%','90%'],
                    body: [
                      [
                        { image: imagenes.imageTest, width:80, rowSpan:2 },
                        { text: 'Procuraduría General de la República', alignment:'center', fontSize:'18', style:'headers', }
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
                                {text:'CÓDIGO DE EMPRESA: '+this.imprimir.codigoPGR, style:'tableHeader',alignment:'left'},
                                {text:'5. MES A PAGAR: '+this.imprimir.mes, style:'tableHeader',alignment:'left'},
                                {text:'6. AÑO: '+this.imprimir.anio, style:'tableHeader',alignment:'left'},
                              ]
                            ]
                          },
                        }
                      ]
                    ],
                  },
                  layout: 'noBorders'
                },
              ],
            }
          ],
          /*header:{
            margin: [ 40, 40, 40, 20 ],
            
            columns: [
              {
                text: 'Procuraduría General de la República', alignment:'center', fontSize:'18', style:'headers',
              },
            ],
            table:{
              widths : ['*','*','auto'],
              style:'table',
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
            }
          },*/
          content: [
            {
              table:{
                headerRows: 1,
                style: 'tables',
                widths : ['*','*','10%','10%','5%','6%','10%'],
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
                {
                  text: "F. _____________________________",margin:[0,5,0,0],
                },{
                  text: "F. _____________________________",margin:[0,5,0,0],
                }
              ]
            },
            {
              columns: [
                {
                  text: 'CERTIFICO QUE LA INFORMACIÓN SUMINISTRADA EN ESTA PLANILLA ES CORRECTA Y QUE LA MISMA NO ME EXIME DE RESPONSABILIDAD LEGAL POR ERRORES O INEXACTITUDES',fontSize: 6,
                },
                {
                  text:''
                },
                {
                  text: "NOMBRE DEL PAGADOR",fontSize: 6,
                },{
                  text: "FIRMA Y SELLO DEL PAGADOR",fontSize: 6,
                }
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
        
        pdf.open();
        //this.obtenerPlanillas(this.lastTableLazyLoadEvent);
        
        //this.messageService.add({severity:'success', summary: 'Exito', detail:result.message});
      }
    })
    
  }

  buscarBanco(codInstitucionFinanciera){
    let actual = parseInt(codInstitucionFinanciera)
    for (let i = 0; i < this.bancos.length; i++) {
      const element = this.bancos[i];
      //console.log(element.codInstucionFinanciera+" "+" "+codInstitucionFinanciera.trim())
      if (element.codInstucionFinanciera === actual) {
        //console.log(element.codInstucionFinanciera+" "+" "+codInstitucionFinanciera)
        return element.nombreBanco;
      }
    }
    return -1;
    /*console.log(mandamiento.codInstitucionFinanciera)
    var valor = this.bancos.find(e => e.codInstucionFinanciera === mandamiento.codInstitucionFinanciera);
    console.log(valor)
    return valor.nombreBanco;*/
  }

  codigoTipoCuota(codigoTipoCuota){
    var valor = this.tipoCuotas.find(e => e.value === codigoTipoCuota);
    if(valor){
      return valor.code;
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

  buscarEstadoPlanilla(codigoEstado){
    var valor = this.codigoEstados.find(e => e.value === codigoEstado);
    return valor.name;
  }

  buscarTipoCuota(codigoTipoCuota){
    var valor = this.tipoCuotas.find(e => e.value === codigoTipoCuota);
    return valor.name;
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
