'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Box, Paper, Typography, Grid, Card, CardContent, useTheme } from '@mui/material';
import { PaymentStatsChartProps } from '@/app/types/components.types';

Chart.register(...registerables);

export default function PaymentStatsChart({ stats }: PaymentStatsChartProps) {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);
    const theme = useTheme();

    const totalPayments = Object.values(stats).reduce((sum, count) => sum + count, 0);

    useEffect(() => {
        if (!chartRef.current) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        const labels = Object.keys(stats);
        const data = Object.values(stats);
        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Número de pagos',
                    data: data,
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(75, 192, 192, 0.8)', 
                        'rgba(255, 99, 132, 0.8)', 
                        'rgba(255, 206, 86, 0.8)', 
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                    ],
                    borderWidth: 2,
                    borderRadius: 5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            padding: 20
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribución del status de los pagos',
                        font: {
                            size: 18,
                            weight: 'bold'
                        },
                        padding: {
                            top: 10,
                            bottom: 20
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [stats]);

    return (
        <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3 } }}>
            <Typography 
                variant="h4" 
                sx={{ 
                    mb: 4, 
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: theme.palette.primary.main
                }}
            >
                Estadísticas de Pagos
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {Object.entries(stats).map(([status, count]) => (
                    <Grid item xs={12} sm={6} md={3} key={status}>
                        <Card 
                            elevation={3}
                            sx={{ 
                                height: '100%',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)'
                                }
                            }}
                        >
                            <CardContent>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        mb: 1,
                                        color: theme.palette.text.secondary,
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {status}
                                </Typography>
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: 'bold',
                                        color: theme.palette.primary.main
                                    }}
                                >
                                    {count}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        mt: 1,
                                        color: theme.palette.text.secondary
                                    }}
                                >
                                    {((count / totalPayments) * 100).toFixed(1)}% del total
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Paper 
                elevation={3} 
                sx={{ 
                    p: { xs: 2, sm: 3 },
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    height: { xs: '500px', sm: '600px' },
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Box 
                    sx={{ 
                        position: 'relative',
                        flex: 1,
                        width: '100%',
                        minHeight: { xs: '400px', sm: '500px' }
                    }}
                >
                    <canvas ref={chartRef} />
                </Box>
            </Paper>
        </Box>
    );
}