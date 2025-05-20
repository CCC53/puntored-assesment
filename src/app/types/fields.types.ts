import { FieldConfig } from "@/app/types/components.types";

export const paymentFields: FieldConfig[] = [
    {
        name: 'externalId',
        label: 'Identificador único de pago autogenerado',
        type: 'disabled',
    },
    {
        name: 'amount',
        label: 'Monto',
        type: 'number',
        placeholder: '0.00',
        required: true,
        startAdornment: '$',
        validation: (value: string) => {
            if (!value) return 'El monto es requerido';
            const amount = parseFloat(value);
            if (isNaN(amount) || amount <= 0) return 'Ingrese un monto válido mayor a 0';
            return '';
        }
    },
    {
        name: 'dueDate',
        label: 'Fecha de Vencimiento',
        type: 'date',
        required: true,
        validation: (value: Date | null) => {
            if (!value) return 'La fecha de vencimiento es requerida';
            if (value < new Date()) return 'La fecha debe ser posterior a hoy';
            return '';
        }
    },
    {
        name: 'description',
        label: 'Concepto de Pago',
        type: 'text',
        placeholder: 'Ingrese el concepto del pago',
        required: true,
        minLength: 3,
        maxLength: 255,
        validation: (value: string) => {
            if (!value) return 'El concepto de pago es requerido';
            if (value.length < 3) return 'El concepto debe tener al menos 3 caracteres';
            if (value.length > 255) return 'El concepto no puede tener más de 200 caracteres';
            return '';
        }
    }
];

export const cancelFields: FieldConfig[] = [
    {
        name: 'reference',
        label: 'ID de Referencia',
        type: 'disabled'
    },
    {
        name: 'updateDescription',
        label: 'Motivo de Cancelación',
        type: 'text',
        required: true,
        placeholder: 'Ingrese el motivo de la cancelación',
        minLength: 10,
        maxLength: 500,
        validation: (value: string) => {
            if (!value) return 'El motivo de cancelación es requerido';
            if (value.length < 10) return 'El motivo debe tener al menos 10 caracteres';
            if (value.length > 500) return 'El motivo no puede tener más de 500 caracteres';
            return '';
        }
    }
];