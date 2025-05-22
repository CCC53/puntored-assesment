import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import ModalInformation from '@/app/components/ModalInformation';
import { ValidPaymentStatus } from '@/app/types/payments.types';

jest.mock('@/app/components/LazyComponents', () => ({
    LazyChipStatus: ({ value }: { value: string }) => <div data-testid="chip-status">{value}</div>,
    LazyInfoRow: ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div data-testid="info-row">
            <span data-testid="info-label">{label}</span>
            {children}
        </div>
    )
}));

jest.mock('html2pdf.js', () => ({
    __esModule: true,
    default: () => ({
        set: () => ({
            from: () => ({
                save: jest.fn()
            })
        })
    })
}));

const mockRow = {
    paymentId: 123,
    externalId: 'EXT123',
    amount: 100,
    reference: '5125241022DAE2EFABBFFE22A3CB67',
    description: 'Test payment',
    dueDate: '2025-05-23',
    paymentDate: '2025-05-22',
    status: ValidPaymentStatus.CREATED,
    authorizationNumber: 'AUTH123',
    cancelDescription: '',
    callBackURL: 'https://example.com/callback',
    callbackACKID: 'ACK123'
};

const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    row: mockRow
};

const theme = createTheme();

const renderWithTheme = (ui: React.ReactElement) => {
    return render(
        <ThemeProvider theme={theme}>
            {ui}
        </ThemeProvider>
    );
};

describe('ModalInformation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debe renderizar el modal cuando isOpen es true', () => {
        renderWithTheme(<ModalInformation {...defaultProps} />);
        expect(screen.getByText('Información de pago referenciado')).toBeInTheDocument();
    });

    it('no debe renderizar el modal cuando isOpen es false', () => {
        renderWithTheme(<ModalInformation {...defaultProps} isOpen={false} />);
        expect(screen.queryByText('Información de pago referenciado')).not.toBeInTheDocument();
    });

    it('debe mostrar la información del pago correctamente', () => {
        renderWithTheme(<ModalInformation {...defaultProps} />);
        
        expect(screen.getByText('123')).toBeInTheDocument();
        expect(screen.getByText('EXT123')).toBeInTheDocument(); 
        expect(screen.getByText('$100')).toBeInTheDocument();
        expect(screen.getByText('5125241022DAE2EFABBFFE22A3CB67')).toBeInTheDocument();
        expect(screen.getByText('Test payment')).toBeInTheDocument();
        expect(screen.getByText('23/05/2025 00:00')).toBeInTheDocument();
        expect(screen.getByTestId('chip-status')).toHaveTextContent(ValidPaymentStatus.CREATED);
        expect(screen.getByText('AUTH123')).toBeInTheDocument();
    });

    it('debe mostrar N/A para campos opcionales vacíos', () => {
        const rowWithoutOptionalFields = {
            ...mockRow,
            authorizationNumber: '',
            cancelDescription: ''
        };

        renderWithTheme(<ModalInformation {...defaultProps} row={rowWithoutOptionalFields} />);
        
        expect(screen.getAllByText('N/A')).toHaveLength(2);
    });

    it('debe llamar onClose cuando se hace clic en el botón Cerrar', () => {
        renderWithTheme(<ModalInformation {...defaultProps} />);
        
        const closeButton = screen.getByText('Cerrar');
        fireEvent.click(closeButton);
        
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('debe llamar handleExportPDF cuando se hace clic en Exportar como PDF', () => {
        renderWithTheme(<ModalInformation {...defaultProps} />);
        
        const exportButton = screen.getByText('Exportar como PDF');
        fireEvent.click(exportButton);
        expect(exportButton).toBeEnabled();
    });

    it('debe mostrar el motivo de cancelación cuando existe', () => {
        const rowWithCancelDescription = {
            ...mockRow,
            cancelDescription: 'Payment cancelled by user'
        };

        renderWithTheme(<ModalInformation {...defaultProps} row={rowWithCancelDescription} />);
        
        expect(screen.getByText('Payment cancelled by user')).toBeInTheDocument();
    });

    it('debe mostrar los labels correctos para cada campo', () => {
        renderWithTheme(<ModalInformation {...defaultProps} />);
        
        const labels = [
            'ID',
            'ID externo',
            'Monto',
            'Referencia',
            'Descripción',
            'Fecha de vencimiento',
            'Estado',
            'Número de autorización',
            'Motivo de cancelación'
        ];

        const infoLabels = screen.getAllByTestId('info-label');
        expect(infoLabels).toHaveLength(labels.length);
        
        infoLabels.forEach((label, index) => {
            expect(label).toHaveTextContent(labels[index]);
        });
    });
}); 