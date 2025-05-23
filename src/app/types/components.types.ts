import { ReactNode } from "react";
import { PaymentRow } from "./payments.types";

export interface PaymentFiltersProps {
    filters: Filters;
    type: 'table' | 'stats';
    onFilterChange: <T extends keyof Filters>(field: T) => (value: Filters[T]) => void;
}

export interface ChipStatusProps {
    value: string;
}

export interface CopyBlockProps {
    text: string;
}

export interface FieldConfig<T> {
    name: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'disabled';
    placeholder?: string;
    required?: boolean;
    validation?: (value: T) => string;
    startAdornment?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    value?: string;
}

export interface DialogProps<T> {
    isOpen: boolean;
    formType?: 'payment' | 'cancel';
    onClose?: () => void;
    onSubmit?: (data: Record<string, T>) => Promise<void>;
    selectedRow: PaymentRow | null;
    reference?: string;
    setReference?: () => void;
}

export interface Filters {
    startCreationDate: Date | null;
    endCreationDate: Date | null;
    startPaymentDate: Date | null;
    endPaymentDate: Date | null;
    status: string;
    page?: number;
    paginate?: number
}

export interface FiltersMapped {
    startCreationDate: string | null;
    endCreationDate: string | null;
    startPaymentDate: string | null;
    endPaymentDate: string | null;
    status: string;
    page?: number;
    paginate?: number;
}

export const STATUS_MAP = {
    '01': 'Creado',
    '02': 'Pagado',
    '03': 'Cancelado',
    '04': 'Expirado'
};

export const STATUS_OPTIONS = [
    { value: '', label: 'Seleccione un status' },
    { value: '01', label: 'Creado' },
    { value: '02', label: 'Pagado' },
    { value: '03', label: 'Cancelado' },
    { value: '04', label: 'Expirado' },
];

export interface ModalInformationProps {
    isOpen: boolean;
    onClose?: () => void;
    row: PaymentRow;
}


export interface PaymentsTableProps {
    data: PaymentRow[];
    page: number;
    rowsPerPage: number;
    totalItems: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onCancelClick: (row: PaymentRow) => void;
    onViewDetails: (row: PaymentRow) => void;
}

export interface InfoRowProps {
    label: string;
    children: ReactNode;
    alignTop?: boolean;
}

export interface PaymentStatsChartProps {
    stats: Record<string, number>;
}
export interface NoDataInfoProps {
    message: string;
}