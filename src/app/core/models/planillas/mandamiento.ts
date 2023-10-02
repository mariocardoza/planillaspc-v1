export interface IMandamiento {
    idEncabezado?: number;
    idControl?: number;
    codigoTipoCuota: string;
    descripcion: string;
    fechaHora: Date;
    monto: number;
    noMandamiento: number;
    nombrePA: string;
    codigoBarra: string;
    codigoPGR: number;
    npe: string;
    nombreComercial?: string;
    rutaImagenComprobante?: string;
    codInstitucionFinanciera?: string;
    codigoTipoComprobante?: string;
    noComprobantePago?: string;
    observacion?: string;
    nit?: string;
    codigoEstado?: string;
}
