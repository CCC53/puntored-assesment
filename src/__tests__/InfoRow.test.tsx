import { render, screen } from '@testing-library/react';
import InfoRow from '@/app/components/InfoRow';

describe('InfoRow', () => {
    it('debe renderizar el label correctamente', () => {
        render(<InfoRow label="Test Label">Test Content</InfoRow>);
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('debe renderizar el contenido correctamente', () => {
        render(<InfoRow label="Test Label">Test Content</InfoRow>);
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('debe renderizar el contenido como children', () => {
        render(
            <InfoRow label="Test Label">
                <div data-testid="test-child">Child Content</div>
            </InfoRow>
        );
        expect(screen.getByTestId('test-child')).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('debe alinear el contenido al centro por defecto', () => {
        render(<InfoRow label="Test Label">Test Content</InfoRow>);
        const container = screen.getByText('Test Label').parentElement;
        expect(container).toHaveStyle({ alignItems: 'center' });
    });

    it('debe alinear el contenido al inicio cuando alignTop es true', () => {
        render(<InfoRow label="Test Label" alignTop>Test Content</InfoRow>);
        const container = screen.getByText('Test Label').parentElement;
        expect(container).toHaveStyle({ alignItems: 'flex-start' });
    });

    it('debe aplicar los estilos correctos al label', () => {
        render(<InfoRow label="Test Label">Test Content</InfoRow>);
        const label = screen.getByText('Test Label');
        expect(label).toHaveStyle({
            fontSize: '1.1rem',
            color: 'rgba(0, 0, 0, 0.6)',
            minWidth: '180px',
            display: 'inline'
        });
    });

    it('debe mantener el gap entre el label y el contenido', () => {
        render(<InfoRow label="Test Label">Test Content</InfoRow>);
        const container = screen.getByText('Test Label').parentElement;
        expect(container).toHaveStyle({ gap: '8px' }); 
    });
}); 