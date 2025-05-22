import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DynamicForm from '@/app/components/DynamicForm';
import { paymentFields, cancelFields } from '@/app/types/fields.types';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PaymentRow, ValidPaymentStatus } from '@/app/types/payments.types';

jest.mock('@/app/components/LazyComponents', () => ({
    LazyCopyBlock: ({ text }: { text: string }) => <div data-testid="copy-block">{text}</div>
}));

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();
const mockSetReference = jest.fn();

const mockPaymentRow: PaymentRow = {
    paymentId: 123,
    externalId: 'EXT123',
    amount: 100,
    reference: 'TEST-REF',
    description: 'Test payment',
    dueDate: '2024-05-23',
    paymentDate: '2024-05-22',
    status: ValidPaymentStatus.CREATED,
    authorizationNumber: 'AUTH123',
    cancelDescription: '',
    callBackURL: 'https://example.com/callback',
    callbackACKID: 'ACK123'
};

const defaultProps = {
    isOpen: true,
    formType: 'payment' as const,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    selectedRow: null,
    reference: undefined,
    setReference: mockSetReference
};

const renderWithDateProvider = (ui: React.ReactElement) => {
    return render(
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            {ui}
        </LocalizationProvider>
    );
};

const getInputByLabel = (label: string) => {
    try {
        return screen.getByRole('textbox', { name: label });
    } catch {
        try {
            return screen.getByRole('spinbutton', { name: label });
        } catch {
            try {
                return screen.getByRole('group', { name: label });
            } catch {
                throw new Error(`Could not find input with label "${label}" as textbox, spinbutton, or group`);
            }
        }
    }
};

describe('DynamicForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza el formulario de pago correctamente', () => {
        renderWithDateProvider(<DynamicForm {...defaultProps} />);
        
        paymentFields.forEach(field => {
            const input = getInputByLabel(field.label);
            expect(input).toBeInTheDocument();
        });

        expect(screen.getByText('Crear Pago')).toBeInTheDocument();
    });

    it('renderiza el formulario de cancelación correctamente', () => {
        renderWithDateProvider(
            <DynamicForm {...defaultProps} formType="cancel" selectedRow={mockPaymentRow} />
        );

        cancelFields.forEach(field => {
            const input = getInputByLabel(field.label);
            expect(input).toBeInTheDocument();
        });

        expect(screen.getByText('Confirmar Cancelación')).toBeInTheDocument();
    });

    it('muestra el diálogo de confirmación para el formulario de cancelación', async () => {
        renderWithDateProvider(
            <DynamicForm {...defaultProps} formType="cancel" selectedRow={mockPaymentRow} />
        );

        const cancelReasonInput = getInputByLabel('Motivo de Cancelación');
        fireEvent.change(cancelReasonInput, { target: { value: 'Test cancel reason' } });

        const submitButton = screen.getByText('Confirmar Cancelación');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('¿Está seguro que desea cancelar este pago? Esta acción no se puede deshacer.')).toBeInTheDocument();
        });
    });

    it('maneja el cierre del formulario correctamente', () => {
        renderWithDateProvider(<DynamicForm {...defaultProps} />);
        
        const closeButton = screen.getByText('Cancelar');
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('muestra la referencia en el bloque de copia cuando se proporciona', () => {
        const testReference = 'TEST-REF-123';
        renderWithDateProvider(
            <DynamicForm {...defaultProps} reference={testReference} />
        );

        expect(screen.getByTestId('copy-block')).toHaveTextContent(testReference);
    });

    it('reinicia el formulario cuando se cierra', async () => {
        const { rerender } = renderWithDateProvider(<DynamicForm {...defaultProps} />);
   
        const firstField = paymentFields[0];
        const input = getInputByLabel(firstField.label);
        fireEvent.change(input, { target: { value: 'test value' } });

        rerender(
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DynamicForm {...defaultProps} isOpen={false} />
            </LocalizationProvider>
        );

        rerender(
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DynamicForm {...defaultProps} isOpen={true} />
            </LocalizationProvider>
        );

        const resetInput = getInputByLabel(firstField.label);
        expect(resetInput).toHaveValue('');
    });
}); 