'use client';

import { useSelector } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';
import { RootState } from '../redux/store';

export const LoadingOverlay = () => {
    const { loading } = useSelector((state: RootState) => state.payments);

    if (!loading) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
            }}
        >
            <CircularProgress size={60} thickness={4} />
            <Typography
                variant="h6"
                sx={{
                    color: 'white',
                    mt: 2,
                    textAlign: 'center',
                }}
            >
                Cargando...
            </Typography>
        </Box>
    );
}; 