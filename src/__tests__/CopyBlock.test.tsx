import { render, screen, fireEvent, act } from '@testing-library/react';
import CopyBlock from '@/app/components/CopyBlock';

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

jest.useFakeTimers();

describe('CopyBlock', () => {
    const mockText = 'Texto de prueba';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debe renderizar el texto proporcionado', () => {
        render(<CopyBlock text={mockText} />);
        expect(screen.getByText(mockText)).toBeInTheDocument();
    });

    it('debe mostrar el botón de copiar', () => {
        render(<CopyBlock text={mockText} />);
        const copyButton = screen.getByLabelText('Copy to clipboard');
        expect(copyButton).toBeInTheDocument();
    });

    it('debe copiar el texto al portapapeles cuando se hace clic en el botón', async () => {
        render(<CopyBlock text={mockText} />);
        const copyButton = screen.getByLabelText('Copy to clipboard');

        await act(async () => {
            fireEvent.click(copyButton);
        });

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockText);
    });

    it('debe mostrar el ícono de check después de copiar', async () => {
        render(<CopyBlock text={mockText} />);
        const copyButton = screen.getByLabelText('Copy to clipboard');

        await act(async () => {
            fireEvent.click(copyButton);
        });

        expect(screen.getByTestId('CheckIcon')).toBeInTheDocument();
    });

    it('debe volver al ícono de copiar después de 2 segundos', async () => {
        render(<CopyBlock text={mockText} />);
        const copyButton = screen.getByLabelText('Copy to clipboard');

        await act(async () => {
            fireEvent.click(copyButton);
        });

        expect(screen.getByTestId('CheckIcon')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(screen.getByTestId('ContentCopyIcon')).toBeInTheDocument();
    });

    it('debe manejar errores al copiar', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        (navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(new Error('Copy failed'));

        render(<CopyBlock text={mockText} />);
        const copyButton = screen.getByLabelText('Copy to clipboard');

        await act(async () => {
            fireEvent.click(copyButton);
        });

        expect(consoleSpy).toHaveBeenCalledWith('Copy failed:', expect.any(Error));
        consoleSpy.mockRestore();
    });
}); 