"use client";

import { Suspense, ReactNode } from 'react';
import { Provider } from "react-redux";
import dynamic from 'next/dynamic';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import theme from './theme';
import { store } from './redux/store';

const ThemeProvider = dynamic(() => import('@mui/material/styles').then(mod => mod.ThemeProvider), { ssr: false });
const LocalizationProvider = dynamic(() => import('@mui/x-date-pickers').then(mod => mod.LocalizationProvider), { ssr: false });
const CssBaseline = dynamic(() => import('@mui/material/CssBaseline'), { ssr: false });

const LoadingFallback = () => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
    </Box>
);

interface ProvidersProps {
    children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <CssBaseline />
                        {children}
                    </LocalizationProvider>
                </ThemeProvider>
            </Provider>
        </Suspense>
    );
} 