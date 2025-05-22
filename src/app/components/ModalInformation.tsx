'use client';
import { useRef } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography, Paper, useTheme, useMediaQuery, IconButton, Box } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { LazyChipStatus, LazyInfoRow } from "./LazyComponents";
import { ModalInformationProps } from "@/app/types/components.types";
import moment from "moment";

export default function ModalInformation({ isOpen, onClose, row }: ModalInformationProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const contentRef = useRef<HTMLDivElement>(null);

    const handleExportPDF = async () => {
        if (!contentRef.current) return;
        
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            
            const opt = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: 'pago.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    logging: true
                },
                jsPDF: { 
                    unit: 'in', 
                    format: 'letter', 
                    orientation: 'portrait'
                }
            };

            html2pdf().set(opt).from(contentRef.current).save();
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        row && (
            <Dialog
                open={isOpen}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        borderRadius: {
                            xs: 0,
                            sm: 2
                        },
                        boxShadow: {
                            xs: 'none',
                            sm: '0 8px 32px rgba(0, 0, 0, 0.08)'
                        },
                        m: {
                            xs: 0,
                            sm: 2
                        },
                        height: {
                            xs: '100%',
                            sm: 'auto'
                        }
                    }
                }}
            >
                <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {isMobile && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${theme.palette.divider}`, px: 2, py: 1 }}>
                            <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: 'primary.main' }}>
                                Información de pago
                            </Typography>
                            <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    )}
                    <div ref={contentRef}>
                        {!isMobile && (
                            <DialogTitle
                                sx={{ fontSize: { sm: '1.35rem', md: '1.5rem' }, fontWeight: 700, pt: 2.5, pb: 2, px: 3, color: 'primary.main', letterSpacing: '-0.02em' }}>
                                Información de pago referenciado
                            </DialogTitle>
                        )}
                        <DialogContent 
                            sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 }, flex: 1, overflow: 'auto' }}>
                            <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, backgroundColor: 'background.paper',borderRadius: { xs: 1, sm: 2 } }}>
                                <Stack spacing={{ xs: 1.5,sm: 2 }}>
                                    <LazyInfoRow label="ID">
                                        <Typography
                                            sx={{ fontWeight: 600, letterSpacing: '-0.01em', color: 'text.primary', fontSize: { xs: '0.9rem', sm: '1rem' }, wordBreak: 'break-all' }}>
                                            {row.paymentId}
                                        </Typography>
                                    </LazyInfoRow>

                                    <LazyInfoRow label="ID externo">
                                        <Typography
                                            sx={{ fontWeight: 600, letterSpacing: '-0.01em', color: 'text.primary', fontSize: { xs: '0.9rem', sm: '1rem' }, wordBreak: 'break-all' }}>
                                            {row.externalId}
                                        </Typography>
                                    </LazyInfoRow>

                                    <LazyInfoRow label="Monto">
                                        <Typography
                                            sx={{ fontWeight: 700, color: 'success.main', letterSpacing: '-0.01em', fontSize: { xs: '1rem', sm: '1.1rem' }}}>
                                            ${row.amount}
                                        </Typography>
                                    </LazyInfoRow>

                                    <LazyInfoRow label="Referencia" alignTop>
                                        <Typography
                                            sx={{
                                                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                                lineHeight: 1.5,
                                                color: 'text.primary',
                                                fontFamily: 'monospace',
                                                backgroundColor: theme.palette.grey[50],
                                                px: { xs: 1, sm: 1.5 },
                                                py: 0.75,
                                                borderRadius: 1,
                                                wordBreak: 'break-all',
                                                width: 'fit-content',
                                                maxWidth: '100%'
                                            }}
                                        >
                                            {row.reference}
                                        </Typography>
                                    </LazyInfoRow>

                                    <LazyInfoRow label="Descripción">
                                        <Typography sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' }, lineHeight: 1.5, color: 'text.primary', wordBreak: 'break-word' }}>
                                            {row.description}
                                        </Typography>
                                    </LazyInfoRow>

                                    <LazyInfoRow label="Fecha de vencimiento">
                                        <Typography sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' }, lineHeight: 1.5, color: 'text.primary', fontWeight: 500 }}>
                                            {moment(row.dueDate).format('DD/MM/YYYY HH:mm')}
                                        </Typography>
                                    </LazyInfoRow>

                                    <LazyInfoRow label="Estado">
                                        <LazyChipStatus value={row.status} />
                                    </LazyInfoRow>

                                    <LazyInfoRow label="Número de autorización">
                                        {row.authorizationNumber}
                                    </LazyInfoRow>

                                    <LazyInfoRow label="Motivo de cancelación">
                                        <Typography
                                            sx={{
                                                fontSize: {
                                                    xs: '0.85rem',
                                                    sm: '0.9rem'
                                                },
                                                lineHeight: 1.5,
                                                color: row.cancelDescription ? 'error.main' : 'text.secondary',
                                                fontStyle: row.cancelDescription ? 'normal' : 'italic',
                                                wordBreak: 'break-word'
                                            }}
                                        >
                                            {row.cancelDescription || "N/A"}
                                        </Typography>
                                    </LazyInfoRow>
                                </Stack>
                            </Paper>
                        </DialogContent>
                    </div>
                    <DialogActions 
                        sx={{ 
                            p: 2,
                            gap: 1.5,
                            mt: 'auto',
                            backgroundColor: theme.palette.background.paper,
                            borderTop: `1px solid ${theme.palette.divider}`,
                            flexDirection: {
                                xs: 'column',
                                sm: 'row'
                            },
                            '& > button': {
                                width: {
                                    xs: '100%',
                                    sm: 'auto'
                                },
                                minWidth: {
                                    sm: '120px'
                                }
                            }
                        }}
                    >
                        {!isMobile && (
                            <Button
                                onClick={onClose}
                                color="secondary"
                                variant="outlined"
                                size="large"
                                sx={{
                                    px: 3,
                                    py: 1,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.9rem'
                                }}
                            >
                                Cerrar
                            </Button>
                        )}
                        <Button
                            onClick={handleExportPDF}
                            color="primary"
                            variant="contained"
                            size="large"
                            sx={{
                                px: 3,
                                py: 1,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                boxShadow: {
                                    xs: 0,
                                    sm: 2
                                },
                                fontSize: '0.9rem'
                            }}
                        >
                            Exportar como PDF
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        )
    );
}