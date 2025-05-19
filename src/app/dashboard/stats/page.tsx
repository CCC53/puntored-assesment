"use client";
import { Box, Card, CardContent, Typography } from '@mui/material';

export default function Stats() {
    return (
        <Box>
            <Box 
                sx={{ 
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(2, 1fr)',
                    },
                    gap: 3
                }}
            >
                <Card sx={{ height: '100%' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Monthly Revenue
                        </Typography>
                        <Typography variant="h4">
                            $45,678
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            +12% from last month
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ height: '100%' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Average Transaction Value
                        </Typography>
                        <Typography variant="h4">
                            $123
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            -3% from last month
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ height: '100%' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Customer Satisfaction
                        </Typography>
                        <Typography variant="h4">
                            4.8/5.0
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Based on 1,234 reviews
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ height: '100%' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            New Customers
                        </Typography>
                        <Typography variant="h4">
                            89
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            This month
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}