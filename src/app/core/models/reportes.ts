export interface IReportes {
    
}

export interface IPlanillaReport {
    titulo: string;
    orientacion: string;
    firma?: string;
    pie?: string;
    secciones: IReportSeccion[];
}

export interface IReportSeccion {
    codigo: string;
    titulo: string;
    columnas?: IReportColumna[];
    operaciones?: any[];
    data?: any[];
}

export interface IReportColumna {
    codigo: string;
    encabezado: string;
    tipo: string;
    alineado: string;
    resaltar: boolean;
}
