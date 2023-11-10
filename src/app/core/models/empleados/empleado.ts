export interface IEmpleado {
    idPersona: number;
    idRegistro: number;
    duiPasaporte?: string;
    nombres?: string;
    apellidos?: string;
    codigoExpediente?: number;
    expedienteFisico?: string;
    rutaDocumento?: string;
    tipoDocumentoI?: string;
    nombreDocumento?: string;
}
