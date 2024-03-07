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
import { FileDownloadService } from 'src/app/shared/file-download/file-download.service';
import { saveAs } from 'file-saver';
import { DashboardService } from 'src/app/core/service/dashboard.service';
import { IUsuarios } from 'src/app/core/models/usuarios/usuarios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-recibos-ingreso',
  templateUrl: './recibos-ingreso.component.html',
  providers: [MessageService],
  styleUrls: ['./recibos-ingreso.component.scss']
})
export class RecibosIngresoComponent implements OnInit {
  @ViewChild("modalComprobante") modalComprobante: ElementRef;
  @ViewChild("modalDocumento") modalDocumento: ElementRef;
  @ViewChild("modalVerDocumento") modalVerDocumento: ElementRef;
  @ViewChild("modalPresentacion") modalPresentacion: ElementRef;
  @ViewChild("modalRecibo") modalRecibo: ElementRef;
  @ViewChild("modalEstados") modalEstados: ElementRef;
  a = moment().subtract(-1, 'day').format("YYYY-MM-DD");
  unafecha: any;
  hoy = moment();
  empresas: IUsuarios[];
  usuarios: any;
  imprimir: any;
  medioscontacto: any = [];
  mandamientos: IMandamiento[];
  loading: boolean = false;
  mandamiento: IMandamiento;
  totalRecords: number = 0;
  barcode: string;
  npe: string;
  bancos: any[];
  sello: any;
  verC:any;
  carpetaInstaciada: string;
  actualFile:any = '';
  public response: { dbPath: '' }
  comprobanteForm: FormGroup;
  reciboIngresoForm: FormGroup;
  filterForm: FormGroup;
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
  estadoActual:string;
  LarutaImagenComprobante: string;
  elCodigoEstado: string;

  constructor(private planillaService: PlanillaService,private dashboardService: DashboardService, public modalService: NgbModal, private messageService: MessageService, private formBuilder: FormBuilder, private fileService: FileDownloadService) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data.CodigoRol == 'U'){
      window.location.href = 'dashboard';
    }
    
  }

  obtenerEmpresas(){
    let token = "gdfd";
    this.dashboardService.usersActiveAsync(token,this.data.CodigoRol,this.data.CodigoPagaduria,0,1000).subscribe((res) => {
      if(res.success){
        this.empresas = res.data;
        this.usuarios = this.empresas.map(e => ({
          code: e.codigoEmpresa,
          name: e.nombreComercial
        }))
      }
    });
  }

  verTrack(id){
    let token = "ggf";
    this.planillaService.obtenerPlanilla(id,token).subscribe((result) => {
      if(result['success']){
        this.estadoActual = result['data'].codigoEstado;
      }  
    })
    this.modalService.open(this.modalEstados,{ size: <any>'md' });
  }

  finalizarPlanilla(idEncabezado: number){
    this.reciboIngresoForm.patchValue({IdEncabezado:idEncabezado});
    this.reciboIngresoForm.patchValue({CodigoUsuario:this.data.Email});
    this.modalService.open(this.modalPresentacion,{ size: <any>'md' });
    /*this.planillaService.reciboIngreso(idEncabezado).subscribe((res) => {
      if(res.success){
        
      }
    });*/
  }

  onReciboIngreso(){
    const data = {
      ...this.reciboIngresoForm.value
    }
    this.loading = true;
    this.planillaService.reciboIngreso(data).subscribe((res) => {
      if(res.errorNumber == 0){
        this.loading = false;
        this.messageService.add({severity:'success', summary: 'Exito', detail:'Se agregó correctamente el recibo de ingreso'})
        this.modalService.dismissAll();
        this.obtenerComprobantes();
      }else{
        this.loading = false;
        this.messageService.add({sticky: true,severity:'error', summary: 'Error', detail:res.errorMessage})
      }
    });
  }

  ngOnInit(): void {
    this.obtenerEmpresas();
    this.obtenerBancos();
    this.obtenerComprobantes();
    this.carpetaInstaciada = 'comprobantes/'+this.data.CodigoPGR;
    this.comprobanteForm = this.formBuilder.group({
      RutaDocumento: ['',Validators.required],
      NoComprobantePago: ['',Validators.required],
      CodInstitucionFinanciera:['',Validators.required],
      IdTabla: ['',Validators.required]
    });

    this.reciboIngresoForm = this.formBuilder.group({
      CodigoUsuario: ['',Validators.required],
      NumeroRemesaPresentada: ['',Validators.required],
      FechaRemesaPresentada:['',Validators.required],
      IdEncabezado: ['',Validators.required]
    });

    this.filterForm = this.formBuilder.group({
      empresa:['','']
    });
  }

  buscar(){
    if(this.filterForm.value.empresa){
      let empresa = this.filterForm.value.empresa;
      this.planillaService.obtenerComprobantesPagados(this.data.CodigoPagaduria,this.data.CodigoRol,'6','', empresa, 0, 1000, 1,'fechaHora').subscribe((result) => {
        this.mandamientos = result.data;
        this.totalRecords = result.registros;
      });
    }
  }

  limpiar(){
    this.planillaService.obtenerComprobantesPagados(this.data.CodigoPagaduria,this.data.CodigoRol,'6','', '', 0, 1000, 1,'fechaHora').subscribe((result) => {
      this.mandamientos = result.data;
      this.totalRecords = result.registros;
    });
  }

  obtenerBancos(){
    this.planillaService.listadoBancos().subscribe((result) => {
      this.bancos = result.data;
    });
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
        aux.push({ text: 'N°', bold: true, fontSize: 8})
        aux.push({text:"7. NOMBRE DEL ALIMENTANTE (DEMANDADO)", bold:true})
        aux.push({text:"8. NOMBRE DEL ALIMENTARIO (DEMANDANTE)", bold:true})
        aux.push({ text:"9. No. EXPEDIENTE FISICO", bold:true})
        aux.push({ text:"10. No. EXPEDIENTE ELECTRÓNICO", bold:true})
        aux.push({ text:"11. TIPO DE INGRESO", bold:true})
        aux.push({ text:"12. MONTO", bold:true})
        aux.push({ text:"13. NÚMERO DE IDENTIFICACIÓN", bold:true})
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
          footer.push({ text:"$"+total.toFixed(2), bold:true})
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
                        { text: 'PROCURADURÍA GENERAL DE LA REPÚBLICA', alignment:'center', fontSize:'18', style:'headers', bold:true },
                        {
                          image: this.sello, width:150, rowSpan:2,
                        }
                      ],[
                        '',
                        {
                          table:{
                            widths : ['*','*','20%'],
                            style:'headers',
                            body:[
                              [
                                [{text: '1. NOMBRE DE LA EMPRESA O INSTITUCIÓN: ',style:'tableHeader',rowSpan:2,alignment:'left', bold:true},this.imprimir.nombreComercial],
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

  reciboIngreso(idEncabezado: number){
    this.planillaService.imprimirComprobante(idEncabezado).subscribe((result)=>{
      if(result.success){
        this.mandamiento = result.data;
        this.barcode = this.mandamiento.codigoBarra;
        let v = this.mandamiento.npe.match(/.{1,4}/g); 
        this.npe = v.join(" "); 
        this.modalService.open(this.modalRecibo,{ size: <any>'lg' });
        //this.messageService.add({severity:'success', summary: 'Exito', detail:result.message});
      }
    })
  }

  imprimirReciboIngreso(){
    const tabla = document.getElementById('contenido');
    const DATA: HTMLElement = tabla!;
    const doc = new jsPDF('p', 'pt', 'letter');
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
      //docResult.save(`${new Date().toISOString()}_mandamiento_pago.pdf`);
      window.open(docResult.output('bloburl'), '_blank');

    });
  }

  obtenerComprobantes(){
    //this.lastTableLazyLoadEvent = event;
    this.planillaService.obtenerComprobantesPagados(this.data.CodigoPagaduria,this.data.CodigoRol,'6','', '', 0, 1000, 1,'fechaHora').subscribe((result) => {
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
      this.comprobanteForm.patchValue({RutaDocumento:mandamiento.rutaImagenComprobante})
      this.comprobanteForm.patchValue({NoComprobantePago:mandamiento.noComprobantePago})
      this.actualFile = this.verC.rutaImagenComprobante;
      this.modalService.open(this.modalDocumento,{ size: <any>'lg' });
    }else{
      this.comprobanteForm.patchValue({RutaDocumento:mandamiento.rutaImagenComprobante})
      this.actualFile = this.verC.rutaImagenComprobante;
      this.modalService.open(this.modalVerDocumento,{ size: <any>'lg' });
    }
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

  downloadURLFile() {
    let strUrlFile = this.comprobanteForm.controls.RutaDocumento.value;
    let filename = strUrlFile.substring(strUrlFile.lastIndexOf('\\')+1);
    this.fileService.downloadFile(strUrlFile).subscribe(response => {
			saveAs(response, filename);
		}), error => this.messageService.add({severity:'error', summary: 'Error', detail:''}), () => this.messageService.add({severity:'success', summary: 'Exito', detail:''})
  }

  buscarTrackPlanilla(codigoEstado){
    //console.log(this.track)
    let color = '';
    let estadoActual = this.estadoActual;
    if(estadoActual < codigoEstado){
      //console.log("rojo "+ estadoActual+" "+codigoEstado)
      color = '#DF0101'
    }else{
      if(estadoActual == codigoEstado && estadoActual != '6'){
        //console.log("amarillo" + estadoActual+" "+codigoEstado)
        color = '#dee314'
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
