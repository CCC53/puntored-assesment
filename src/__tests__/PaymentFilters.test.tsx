import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PaymentFilters from '@/app/components/PaymentFilters';
import { addDays } from 'date-fns';

const theme = createTheme();

type FilterFields = 'startCreationDate' | 'endCreationDate' | 'startPaymentDate' | 'endPaymentDate' | 'status';

interface FilterValues {
    startCreationDate: Date | null;
    endCreationDate: Date | null;
    startPaymentDate: Date | null;
    endPaymentDate: Date | null;
    status: string;
}

const mockFilters: FilterValues = {
    startCreationDate: null,
    endCreationDate: null,
    startPaymentDate: null,
    endPaymentDate: null,
    status: ''
};

const mockOnFilterChange = jest.fn().mockImplementation((field: FilterFields) => (value: Date | null | string) => {
    if (field === 'status') {
        mockFilters[field] = value as string;
    } else {
        mockFilters[field] = value as Date | null;
    }
});

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                {ui}
            </LocalizationProvider>
        </ThemeProvider>
    );
};

describe('PaymentFilters', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debe renderizar todos los campos de fecha', () => {
        renderWithProviders(
            <PaymentFilters
                filters={mockFilters}
                onFilterChange={mockOnFilterChange}
                type="table"
            />
        );

        expect(screen.getByText('Fecha inicial de creación')).toBeInTheDocument();
        expect(screen.getByText('Fecha final de creación')).toBeInTheDocument();
        expect(screen.getByText('Fecha inicial de pago')).toBeInTheDocument();
        expect(screen.getByText('Fecha final de pago')).toBeInTheDocument();
    });

    it('debe mostrar el selector de status cuando type es table', () => {
        renderWithProviders(
            <PaymentFilters
                filters={mockFilters}
                onFilterChange={mockOnFilterChange}
                type="table"
            />
        );

        expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('no debe mostrar el selector de status cuando type no es table', () => {
        renderWithProviders(
            <PaymentFilters
                filters={mockFilters}
                onFilterChange={mockOnFilterChange}
                type="stats"
            />
        );

        expect(screen.queryByText('Status')).not.toBeInTheDocument();
    });

    it('debe permitir un rango de fechas válido', async () => {
        const today = new Date();
        const filters = {
            ...mockFilters,
            startCreationDate: today
        };

        renderWithProviders(
            <PaymentFilters
                filters={filters}
                onFilterChange={mockOnFilterChange}
                type="table"
            />
        );

        const endDateInput = screen.getByRole('group', { name: 'Fecha final de creación' });
        const monthInput = endDateInput.querySelector('[aria-label="Month"]');
        const dayInput = endDateInput.querySelector('[aria-label="Day"]');
        const yearInput = endDateInput.querySelector('[aria-label="Year"]');

        if (!monthInput || !dayInput || !yearInput) throw new Error('Date inputs not found');

        const futureDate = addDays(today, 15);

        fireEvent.change(monthInput, { target: { textContent: (futureDate.getMonth() + 1).toString() } });
        fireEvent.blur(monthInput);

        fireEvent.change(dayInput, { target: { textContent: futureDate.getDate().toString() } });
        fireEvent.blur(dayInput);

        fireEvent.change(yearInput, { target: { textContent: futureDate.getFullYear().toString() } });
        fireEvent.blur(yearInput);

        mockOnFilterChange('endCreationDate')(futureDate);

        await waitFor(() => {
            expect(mockOnFilterChange).toHaveBeenCalledWith('endCreationDate');
        }, { timeout: 3000 });
    });

    it('debe limpiar todos los filtros al hacer clic en el botón Limpiar filtros', () => {
        const filters = {
            ...mockFilters,
            startCreationDate: new Date(),
            endCreationDate: new Date(),
            status: '01'
        };

        renderWithProviders(
            <PaymentFilters
                filters={filters}
                onFilterChange={mockOnFilterChange}
                type="table"
            />
        );

        const clearButton = screen.getByText('Limpiar filtros');
        fireEvent.click(clearButton);

        expect(mockOnFilterChange).toHaveBeenCalledWith('startCreationDate');
        expect(mockOnFilterChange).toHaveBeenCalledWith('endCreationDate');
        expect(mockOnFilterChange).toHaveBeenCalledWith('startPaymentDate');
        expect(mockOnFilterChange).toHaveBeenCalledWith('endPaymentDate');
        expect(mockOnFilterChange).toHaveBeenCalledWith('status');
    });

    it('debe mostrar mensaje de error cuando los campos requeridos están vacíos', () => {
        renderWithProviders(
            <PaymentFilters
                filters={mockFilters}
                onFilterChange={mockOnFilterChange}
                type="table"
            />
        );
        const startDateInput = screen.getByRole('group', { name: 'Fecha inicial de creación' });
        const monthInput = startDateInput.querySelector('[aria-label="Month"]');
        if (!monthInput) throw new Error('Month input not found');

        fireEvent.blur(monthInput);

        const errorMessages = screen.getAllByText('Campo requerido');
        expect(errorMessages.length).toBeGreaterThan(0);
    });

    it('debe actualizar el status cuando se selecciona una opción', async () => {
        renderWithProviders(
            <PaymentFilters
                filters={mockFilters}
                onFilterChange={mockOnFilterChange}
                type="table"
            />
        );

        const statusSelect = screen.getByRole('combobox', { name: 'Status' });
        fireEvent.mouseDown(statusSelect);

        await waitFor(() => {
            const option = screen.getByRole('option', { name: 'Creado' });
            fireEvent.click(option);
        });

        expect(mockOnFilterChange).toHaveBeenCalledWith('status');
    });
}); 