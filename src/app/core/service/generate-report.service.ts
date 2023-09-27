import { Injectable } from '@angular/core';
import htmlToPdfmake from 'html-to-pdfmake';
import {Img, PdfMakeWrapper} from "pdfmake-wrapper";
import pdfFonts from 'src/assets/fonts/expressway-font';
import { IPlanillaReport, IReportSeccion, IReportColumna } from 'src/app/core/models/reportes';
import * as moment from "moment/moment";
import { endpoint } from 'src/environments/endpoint';

@Injectable({
  providedIn: 'root'
})
export class GenerateReportService {

  constructor() { }

  async build (data: IPlanillaReport): Promise<void> {
    // Inicialización de fuentes
    PdfMakeWrapper.setFonts(pdfFonts, {
      expressway: {
        normal: 'expressway-regular.ttf',
        bold: 'expressway-bold.ttf',
        italics: 'expressway-italic.otf',
        bolditalics: 'expressway-bold-italic.otf'
      }
    });
    PdfMakeWrapper.useFont('expressway');

    // Construcción del objeto para trabajar con los PDF
    const pdf = await this.pageConfig(data.orientacion);

    // Título del reporte
    pdf.add({
      text: data.titulo,
      style: 'titulo'
    });

    // Secciones de reporte
    pdf.add(this.seccionesTabla(data.secciones));

    // Incluir firma
    if (data.firma !== null && data.firma !== undefined) {
      pdf.add(htmlToPdfmake(data.firma));
    }

    // Crear PDF
    pdf.create().open();
  }

  private styles(): any {
    return {
      titulo: {
        bold: true,
        fontSize: 14,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      titulo2: {
        fontSize: 13,
        margin: [0, 0, 0, 5],
        color: '#666666'
      },
      titulo3: {
        fontSize: 11,
        margin: [0, 0, 0, 5],
      },
      titulo4: {
        fontSize: 11,
        margin: [0, 0, 0, 5],
        color: '#777777'
      },
      bold: {
        bold: true
      },
      empty: {
        italics: true,
        margin: [0, 0, 0, 25],
        color: '#888888'
      },
      headerLeft: {
        bold: true,
        alignment: 'left'
      },
      headerCenter: {
        bold: true,
        alignment: 'center'
      },
      headerRight: {
        bold: true,
        alignment: 'right'
      },
      left: {
        alignment: 'left'
      },
      right: {
        alignment: 'right'
      },
      center: {
        alignment: 'center'
      },
      fillLeft: {
        fillColor: '#ccff00',
        alignment: 'left'
      },
      fillCenter: {
        fillColor: '#ccff00',
        alignment: 'center'
      },
      fillRight: {
        fillColor: '#ccff00',
        alignment: 'right'
      },
    };
  }

  private recursiveBodyTabla (seccion: any[], columnas: IReportColumna[], iteracion: number): any {
    let response: any;

    // Evaluar si no hay datos
    if (seccion.length === 0) {
      return {
        text: 'Planillas',
        style: 'empty'
      };
    }

    // Evaluar si existe el nivel data en el hijo
    if (seccion[0].data !== null && seccion[0].data !== undefined) {
      // Existe un hijo
      const seccionCuerpo: any[] = [];
      seccion.forEach((sec) => {
        const titulo = {
          text: sec.encabezado + ': ' + sec.valor,
          style: 'titulo3'
        };

        const tituloTotales = sec.operaciones.length > 0 ? {
          text: 'Totales',
          style: 'titulo4'
        } : {};

        const tituloData = iteracion === 0 || sec.data.length === 0 ? {} : {
          text: 'Contenido',
          style: 'titulo4'
        };

        // Construir data
        const data = this.recursiveBodyTabla(sec.data, columnas, (iteracion + 1));

        // Construir tabla para resultados
        const cuerpo: any[] = [];
        const headers: any[] = [];
        headers.push({
          text: sec.encabezado + ': ' + sec.valor,
          style: 'header'
        });

        columnas.forEach((columna) => {
          headers.push({
            text: columna.encabezado,
            style: 'header'
          });
        });

        cuerpo.push(headers);

        sec.operaciones.forEach((fila) => {
          const filaCuerpo: any[] = [];
          filaCuerpo.push({
            text: fila['opn']
          });

          columnas.forEach((columna) => {
            filaCuerpo.push({
              text: fila[columna.encabezado]
            });
          });
          cuerpo.push(filaCuerpo);
        });

        let tabla: any = {};

        if (sec.operaciones.length > 0) {
          tabla = this.buildTable(cuerpo, true);

          tabla.table.widths.push('auto');
          columnas.forEach((columna) => {
            tabla.table.widths.push(columna.tipo !== 'T' && columnas.length > 1 ? 'auto' : '*');
          });
        }

        seccionCuerpo.push([titulo, tituloTotales, tabla, tituloData, data]);
      });
      response = seccionCuerpo;
    } else {
      // No existe hijo
      const cuerpo: any[] = [];
      const headers: any[] = [];
      headers.push({
        text: '#',
        style: 'header'
      });

      columnas.forEach((columna) => {
        headers.push({
          text: columna.encabezado,
          style: columna.alineado === 'D' ? 'headerRight' : columna.alineado === 'C' ? 'headerCenter' : 'headerLeft'
        });
      });

      cuerpo.push(headers);

      // Construcción de data de la tabla
      seccion.forEach((fila, i) => {
        const filaCuerpo: any[] = [];

        // Columna correlativo
        if (fila['opn'] !== undefined) {
          filaCuerpo.push({
            text: fila['opn']
          });
        } else {
          filaCuerpo.push({
            text: (i + 1).toString(10)
          });
        }

        // Cuerpo de la tabla
        columnas.forEach((columna) => {
          let estilo: string;
          if (columna.resaltar) {
            estilo = columna.alineado === 'D'
              ? 'fillRight' : columna.alineado === 'C' ? 'fillCenter' : 'fillLeft' ;
          } else {
            estilo = columna.alineado === 'D'
              ? 'right' : columna.alineado === 'C' ? 'center' : 'left';
          }
          filaCuerpo.push({
            text: fila[columna.encabezado],
            style: estilo
          });
        });
        cuerpo.push(filaCuerpo);
      })

      const tabla: any = this.buildTable(cuerpo, false);

      tabla.table.widths.push('auto');
      columnas.forEach((columna) => {
        tabla.table.widths.push(columna.tipo !== 'T' && columnas.length > 1 ? 'auto' : '*');
      });

      response = tabla;
    }

    return response;
  }

  private async pageConfig(orientacion: string): Promise<PdfMakeWrapper> {
    const pdf = new PdfMakeWrapper();

    // Tamaño y orientación del papel
    pdf.pageSize('letter');

    let backgroundImage: string;
    let backgroundWidth: number;

    if (orientacion === 'H') {
      pdf.pageOrientation('landscape');
      pdf.pageMargins([40, 105, 40, 80]);
      //backgroundImage = 'fondo_membrete_h.jpg';
      backgroundWidth = 767;
    } else {
      pdf.pageMargins([40, 140, 40, 80]);
      //backgroundImage = 'fondo_membrete.jpg';
      backgroundWidth = 590;
    }

    // Fondo
    const url = endpoint.current.images + '/' + backgroundImage;
    pdf.images({
      fondo: await new Img(url).build()
    });

    pdf.background({
      image: 'fondo',
      width: backgroundWidth,
      absolutePosition: { x: 10, y: 0 }
    });

    // Estilos
    pdf.defaultStyle({
      fontSize: 10
    });
    pdf.styles(this.styles());

    // Pie de página
    const fecha = moment();
    const footer = (currentPage, pageCount) => {
      return [
        {
          margin: [40 , 0],
          columns: [
            {
              text: 'Generado el ' + fecha.format('DD/MM/YYYY HH:mm')+', Usuario: '+JSON.parse(localStorage.getItem('SIAPUser')).usernombre+'('+JSON.parse(localStorage.getItem('SIAPUser')).usercodigo.trim()+')',
              fontSize: 8,
              width: 400
            },
            {
              text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
              alignment: 'right',
              fontSize: 8
            }
          ]
        }
      ];
    };
    pdf.footer(footer);

    return pdf;
  }

  private buildTable(cuerpo: any, headerBold: boolean): any {
    return {
      margin: [0, 0, 0, 25],
      table: {
        widths: [],
        headerRows: 1,
        body: cuerpo
      },
      layout: {
        hLineWidth(i, node) {
          return (i === 1) ? 1 : 0;
        },
        vLineWidth(i, node) {
          return 0;
        },
        fillColor(i, node) {
          if (i === 0) {
            return headerBold ? '#888888' : '#bbbbbb';
          } else {
            return (i % 2 === 0) ? '#eeeeee' : null;
          }
        }
      }
    };
  }

  private seccionesTabla (secciones: IReportSeccion[]): any[] {
    const response: any[] = [];

    // Recorrer las secciones
    secciones.forEach((seccion) => {
      // Encabezado de sección
      const encabezado = {
        text: seccion.titulo.toUpperCase(),
        style: 'titulo2'
      }

      let cuerpo;
      let encabezadoResultado: any = {};
      let cuerpoResultado: any = {};
      if (seccion.data !== null) {
        if (seccion.operaciones !== null && seccion.operaciones.length > 0) {
          // Encabezados de tablas para resultados totales
          encabezadoResultado = {
            text: 'Resultados totales',
            style: 'titulo4'
          };

          // Construir tabla para resultados totales
          const tbody: any[] = [];
          const headers: any[] = [];
          headers.push({
            text: 'Operación',
            style: 'header'
          });

          seccion.columnas.forEach((columna) => {
            headers.push({
              text: columna.encabezado,
              style: 'header'
            });
          });

          tbody.push(headers);

          seccion.operaciones.forEach((fila) => {
            const filaCuerpo: any[] = [];
            filaCuerpo.push({
              text: fila['opn']
            });

            seccion.columnas.forEach((columna) => {
              filaCuerpo.push({
                text: fila[columna.encabezado]
              });
            });
            tbody.push(filaCuerpo);
          });
          cuerpoResultado = this.buildTable(tbody, true);

          cuerpoResultado.table.widths.push('auto');
          seccion.columnas.forEach((columna) => {
            cuerpoResultado.table.widths.push(columna.tipo !== 'T' && seccion.columnas.length > 1 ? 'auto' : '*');
          });
        }
        cuerpo = this.recursiveBodyTabla(seccion.data, seccion.columnas, 0);
      } else {
        cuerpo = {
          text: 'Planillas empty',
          style: 'empty'
        }
      }

      // Agregar sección
      response.push([encabezado, encabezadoResultado, cuerpoResultado, cuerpo]);
    });

    return response;
  }
}
