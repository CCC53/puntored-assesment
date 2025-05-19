"use client";

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';

// Lazy load Material-UI components
const Button = dynamic(() => import('@mui/material/Button'), { ssr: false });
const Typography = dynamic(() => import('@mui/material/Typography'), { ssr: false });
const Container = dynamic(() => import('@mui/material/Container'), { ssr: false });

const LoadingFallback = () => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
    </Box>
);

export default function NotFound() {
    const router = useRouter();

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
                    
                    <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 700, color: 'primary.main' }}>
                        404
                    </Typography>
                    
                    <Typography variant="h4" sx={{ mb: 2, color: 'text.secondary' }}>
                        Página no encontrada
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px', color: 'text.secondary' }}>
                        Lo sentimos, la página que estás buscando no existe o ha sido movida.
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => router.push('/dashboard')}
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1.1rem',
                        }}
                    >
                        Volver al Dashboard
                    </Button>
                </Box>
            </Container>
        </Suspense>
    );
} 