'use client';
import { Box, Typography } from '@mui/material';
import { InfoRowProps } from "@/app/types/components.types";

export default function InfoRow({ label, children, alignTop = false }: InfoRowProps) {
    return (
        <Box sx={{ display: 'flex', alignItems: alignTop ? 'flex-start' : 'center', gap: 1 }}>
            <Typography
                sx={{
                    fontSize: '1.1rem',
                    color: 'text.secondary',
                    minWidth: '180px',
                    display: 'inline'
                }}
            >
                {label}
            </Typography>
            {children}
        </Box>
    )
}