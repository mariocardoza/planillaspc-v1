export interface DetallePlanilla {
  isSelected: boolean;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  isEdit: boolean;
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
