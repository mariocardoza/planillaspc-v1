export interface DetallePlanilla {
  idDetalle: number;
  idEncabezado: number;
  apellidosDemandado?: string;
  nombresDemandado?: string;
  apellidosDemandante?: string;
  nombresDemandante?: string;
  duIdemandado: string;
  monto: number;
  noBeneficiarios: number;
  noTarjeta: string;
  noExpediente: string;
  observaciones: string;
  codigoExpediente: number;
}

export const DetalleColumns = [
    {
      key: 'isSelected',
      type: 'isSelected',
      label: '',
    },
    {
      key: 'firstName',
      type: 'text',
      label: 'DUI',
      required: true,
    },
    {
      key: 'lastName',
      type: 'text',
      label: 'Nombres',
    },
    {
      key: 'email',
      type: 'email',
      label: 'Apellidos',
      required: true,
      pattern: '.+@.+',
    },
    {
      key: 'birthDate',
      type: 'date',
      label: 'Nombres demantante',
    },
    {
      key: 'isEdit',
      type: 'isEdit',
      label: '',
    },
  ];
