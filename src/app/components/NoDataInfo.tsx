import { Info } from "@mui/icons-material";
import { Box, Paper, Typography } from "@mui/material";
import { NoDataInfoProps } from "@/app/types/components.types";

export default function NoDataInfo({ message }: NoDataInfoProps) {
    return (
        <Paper sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
            <Box sx={{
                width: '100%',
                maxWidth: { xs: '100%', sm: 650 },
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                px: 2,
                py: 2,
                mx: 'auto',
            }}>
                <Typography sx={{
                    fontSize: { xs: '1.2rem', sm: '1.6rem' },
                    fontWeight: 700,
                    color: 'primary.main',
                    textAlign: 'center',
                    width: '100%'
                }}>
                    { message }
                </Typography>
                <Info sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }} color='primary' />
            </Box>
        </Paper>
    )
} 