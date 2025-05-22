import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import NoDataInfo from '@/app/components/NoDataInfo';

const theme = createTheme();

const renderWithTheme = (ui: React.ReactElement) => {
    return render(
        <ThemeProvider theme={theme}>
            {ui}
        </ThemeProvider>
    );
};

describe('NoDataInfo', () => {
    it('debe renderizar el mensaje correctamente', () => {
        const message = 'No hay datos disponibles';
        renderWithTheme(<NoDataInfo message={message} />);
        
        expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('debe renderizar el ícono de información', () => {
        renderWithTheme(<NoDataInfo message="Test message" />);
        
        const infoIcon = screen.getByTestId('InfoIcon');
        expect(infoIcon).toBeInTheDocument();
    });

    it('debe aplicar los estilos correctos al contenedor', () => {
        renderWithTheme(<NoDataInfo message="Test message" />);
        
        const paper = screen.getByText('Test message').closest('div[class*="MuiPaper-root"]');
        expect(paper).toHaveClass('MuiPaper-root');
        expect(paper).toHaveClass('MuiPaper-rounded');
        expect(paper).toHaveStyle({
            width: '100%'
        });
    });

    it('debe aplicar los estilos correctos al mensaje', () => {
        renderWithTheme(<NoDataInfo message="Test message" />);
        
        const messageElement = screen.getByText('Test message');
        expect(messageElement).toHaveStyle({
            textAlign: 'center',
            width: '100%'
        });
    });

    it('debe aplicar los estilos correctos al ícono', () => {
        renderWithTheme(<NoDataInfo message="Test message" />);
        
        const infoIcon = screen.getByTestId('InfoIcon');
        expect(infoIcon).toHaveClass('MuiSvgIcon-colorPrimary');
    });

    it('debe mantener el mensaje centrado', () => {
        renderWithTheme(<NoDataInfo message="Test message" />);
        
        const box = screen.getByText('Test message').closest('div[class*="MuiBox-root"]');
        expect(box).toHaveStyle({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        });
    });
}); 