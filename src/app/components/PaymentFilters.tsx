import { Box, Paper, Stack, Typography, FormControl, InputLabel, Select, MenuItem, useTheme } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers';
import { PaymentFiltersProps, STATUS_OPTIONS } from "../types/components.types";
import { differenceInDays } from 'date-fns';
import { useState } from 'react';

export default function PaymentFilters({ filters, onFilterChange }: PaymentFiltersProps) {
    const theme = useTheme();
    const [dateErrors, setDateErrors] = useState({
        startCreationDate: '',
        endCreationDate: '',
        startPaymentDate: '',
        endPaymentDate: ''
    });

    const hasCreationDateRange = filters.startCreationDate !== null || filters.endCreationDate !== null;
    const hasPaymentDateRange = filters.startPaymentDate !== null || filters.endPaymentDate !== null;

    const isCreationDateRangeRequired = hasCreationDateRange || (!hasPaymentDateRange && !filters.status);
    const isPaymentDateRangeRequired = hasPaymentDateRange || (!hasCreationDateRange && !filters.status);

    const validateDateRange = (startDate: Date | null, endDate: Date | null) => {
        if (startDate && endDate) {
            const daysDifference = differenceInDays(endDate, startDate);
            return daysDifference <= 31;
        }
        return true;
    };

    const handleDateChange = (field: 'startCreationDate' | 'endCreationDate' | 'startPaymentDate' | 'endPaymentDate') => (value: Date | null) => {
        let isValid = true;
        let errorMessage = '';

        if (field === 'endCreationDate' && filters.startCreationDate && value) {
            isValid = validateDateRange(filters.startCreationDate, value);
            if (!isValid) {
                errorMessage = 'El rango de fechas no puede ser mayor a un mes';
            }
        } else if (field === 'startCreationDate' && filters.endCreationDate && value) {
            isValid = validateDateRange(value, filters.endCreationDate);
            if (!isValid) {
                errorMessage = 'El rango de fechas no puede ser mayor a un mes';
            }
        } else if (field === 'endPaymentDate' && filters.startPaymentDate && value) {
            isValid = validateDateRange(filters.startPaymentDate, value);
            if (!isValid) {
                errorMessage = 'El rango de fechas no puede ser mayor a un mes';
            }
        } else if (field === 'startPaymentDate' && filters.endPaymentDate && value) {
            isValid = validateDateRange(value, filters.endPaymentDate);
            if (!isValid) {
                errorMessage = 'El rango de fechas no puede ser mayor a un mes';
            }
        }

        if (isValid) {
            onFilterChange(field)(value);
            setDateErrors(prev => ({ ...prev, [field]: '' }));
        } else {
            setDateErrors(prev => ({ ...prev, [field]: errorMessage }));
        }
    };

    return (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: theme.palette.text.secondary }}>
                Filtros Avanzados
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.secondary }}>
                * Se requiere completar al menos un rango de fechas (creación o pago) y seleccionar un status
            </Typography>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                sx={{ mb: 2 }}
                flexWrap="wrap"
                useFlexGap
            >
                <Box sx={{ width: { xs: '100%', sm: '48%', md: '23%' } }}>
                    <DatePicker
                        label="Fecha inicial de creación"
                        value={filters.startCreationDate}
                        onChange={handleDateChange('startCreationDate')}
                        slotProps={{
                            textField: {
                                size: 'small',
                                fullWidth: true,
                                required: isCreationDateRangeRequired,
                                error: (isCreationDateRangeRequired && !filters.startCreationDate) || !!dateErrors.startCreationDate,
                                helperText: dateErrors.startCreationDate || (isCreationDateRangeRequired && !filters.startCreationDate ? 'Campo requerido' : '')
                            }
                        }}
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '48%', md: '23%' } }}>
                    <DatePicker
                        label="Fecha final de creación"
                        value={filters.endCreationDate}
                        onChange={handleDateChange('endCreationDate')}
                        slotProps={{
                            textField: {
                                size: 'small',
                                fullWidth: true,
                                required: isCreationDateRangeRequired,
                                error: (isCreationDateRangeRequired && !filters.endCreationDate) || !!dateErrors.endCreationDate,
                                helperText: dateErrors.endCreationDate || (isCreationDateRangeRequired && !filters.endCreationDate ? 'Campo requerido' : '')
                            }
                        }}
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '48%', md: '23%' } }}>
                    <DatePicker
                        label="Fecha inicial de pago"
                        value={filters.startPaymentDate}
                        onChange={handleDateChange('startPaymentDate')}
                        slotProps={{
                            textField: {
                                size: 'small',
                                fullWidth: true,
                                required: isPaymentDateRangeRequired,
                                error: (isPaymentDateRangeRequired && !filters.startPaymentDate) || !!dateErrors.startPaymentDate,
                                helperText: dateErrors.startPaymentDate || (isPaymentDateRangeRequired && !filters.startPaymentDate ? 'Campo requerido' : '')
                            }
                        }}
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '48%', md: '23%' } }}>
                    <DatePicker
                        label="Fecha final de pago"
                        value={filters.endPaymentDate}
                        onChange={handleDateChange('endPaymentDate')}
                        slotProps={{
                            textField: {
                                size: 'small',
                                fullWidth: true,
                                required: isPaymentDateRangeRequired,
                                error: (isPaymentDateRangeRequired && !filters.endPaymentDate) || !!dateErrors.endPaymentDate,
                                helperText: dateErrors.endPaymentDate || (isPaymentDateRangeRequired && !filters.endPaymentDate ? 'Campo requerido' : '')
                            }
                        }}
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '48%', md: '23%' } }}>
                    <FormControl fullWidth size="small" error={!filters.status}>
                        <InputLabel id="status-select-label" required>Status</InputLabel>
                        <Select
                            labelId="status-select-label"
                            value={filters.status}
                            label="Estatus del pago"
                            onChange={(e) => onFilterChange('status')(e.target.value)}
                            required
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Stack>
        </Paper>
    );
} 