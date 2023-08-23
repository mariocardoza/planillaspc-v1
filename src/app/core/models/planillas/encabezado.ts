export interface IEncabezado {
    idEncabezado?: number | 0;
    periodo: number;
    codigoEstado: string;
    codigoPagaduria: string;
    codigoPGR: string;
    codigoTipoCuota: string;
    observacion: string;
    noMandamiento: string;
    monto: number;
}

export interface IPlanillaRequest{
    filtro: IEncabezado
}
