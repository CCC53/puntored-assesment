"use client";

import { useEffect, Suspense } from 'react';
import Image from 'next/image';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';

const Button = dynamic(() => import('@mui/material/Button'), { ssr: false });
const Typography = dynamic(() => import('@mui/material/Typography'), { ssr: false });
const Container = dynamic(() => import('@mui/material/Container'), { ssr: false });

const LoadingFallback = () => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
    </Box>
);

export default function Error({ error }: { error: Error & { digest?: string } }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <Suspense fallback={<LoadingFallback />}>
            <Container>
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: 4,
                        py: 8,
                    }}
                >
                    <Image
                        src="https://www.bancamia.com.co/wp-content/uploads/2024/10/logo-punto-red-negro-comprimida.png"
                        alt="Logo"
                        width={200}
                        height={100}
                        style={{ objectFit: 'contain' }}
                    />
                    
                    <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 700, color: 'error.main' }}>
                        500
                    </Typography>
                    
                    <Typography variant="h4" sx={{ mb: 2, color: 'text.secondary' }}>
                        Error del Servidor
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px', color: 'text.secondary' }}>
                        Lo sentimos, algo salió mal en nuestro servidor. Por favor, intenta de nuevo más tarde.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2 }}>          
                        <Button
                            variant="outlined"
                            onClick={() => window.location.href = '/dashboard'}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                            }}
                        >
                            Ir al Dashboard
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Suspense>
    );
} 