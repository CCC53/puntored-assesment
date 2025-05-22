import { render, screen } from '@testing-library/react';
import ChipStatus from '@/app/components/ChipStatus';

describe('ChipStatus', () => {
    it('debe mostrar el chip "Creado" con color info para el estado "01"', () => {
        render(<ChipStatus value="01" />);
        const chip = screen.getByText('Creado');
        expect(chip).toBeInTheDocument();
        expect(chip).toHaveClass('MuiChip-label MuiChip-labelMedium css-1dybbl5-MuiChip-label');
    });

    it('debe mostrar el chip "Pagado" con color success para el estado "02"', () => {
        render(<ChipStatus value="02" />);
        const chip = screen.getByText('Pagado');
        expect(chip).toBeInTheDocument();
        expect(chip).toHaveClass('MuiChip-label MuiChip-labelMedium css-1dybbl5-MuiChip-label');
    });

    it('debe mostrar el chip "Cancelado" con color error para el estado "03"', () => {
        render(<ChipStatus value="03" />);
        const chip = screen.getByText('Cancelado');
        expect(chip).toBeInTheDocument();
        expect(chip).toHaveClass('MuiChip-label MuiChip-labelMedium css-1dybbl5-MuiChip-label');
    });

    it('debe mostrar el chip "Expirado" con color warning para el estado "04"', () => {
        render(<ChipStatus value="04" />);
        const chip = screen.getByText('Expirado');
        expect(chip).toBeInTheDocument();
        expect(chip).toHaveClass('MuiChip-label MuiChip-labelMedium css-1dybbl5-MuiChip-label');
    });
}); 