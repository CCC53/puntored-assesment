import { Box, Paper, Stack, Typography, FormControl, InputLabel, Select, MenuItem, useTheme } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers';
import { PaymentFiltersProps, STATUS_OPTIONS } from "../utils/types/components/components";

export default function PaymentFilters({ filters, onFilterChange }: PaymentFiltersProps) {
    const theme = useTheme();

    const hasCreationDateRange = filters.startCreationDate !== null || filters.endCreationDate !== null;
    const hasPaymentDateRange = filters.startPaymentDate !== null || filters.endPaymentDate !== null;

    const isCreationDateRangeRequired = hasCreationDateRange || (!hasPaymentDateRange && !filters.status);
    const isPaymentDateRangeRequired = hasPaymentDateRange || (!hasCreationDateRange && !filters.status);

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
                        onChange={(newValue) => onFilterChange('startCreationDate')(newValue)}
                        slotProps={{
                            textField: {
                                size: 'small',
                                fullWidth: true,
                                required: isCreationDateRangeRequired,
                                error: isCreationDateRangeRequired && !filters.startCreationDate,
                                helperText: isCreationDateRangeRequired && !filters.startCreationDate ? 'Campo requerido' : ''
                            }
                        }}
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '48%', md: '23%' } }}>
                    <DatePicker
                        label="Fecha final de creación"
                        value={filters.endCreationDate}
                        onChange={(newValue) => onFilterChange('endCreationDate')(newValue)}
                        slotProps={{
                            textField: {
                                size: 'small',
                                fullWidth: true,
                                required: isCreationDateRangeRequired,
                                error: isCreationDateRangeRequired && !filters.endCreationDate,
                                helperText: isCreationDateRangeRequired && !filters.endCreationDate ? 'Campo requerido' : ''
                            }
                        }}
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '48%', md: '23%' } }}>
                    <DatePicker
                        label="Fecha inicial de pago"
                        value={filters.startPaymentDate}
                        onChange={(newValue) => onFilterChange('startPaymentDate')(newValue)}
                        slotProps={{
                            textField: {
                                size: 'small',
                                fullWidth: true,
                                required: isPaymentDateRangeRequired,
                                error: isPaymentDateRangeRequired && !filters.startPaymentDate,
                                helperText: isPaymentDateRangeRequired && !filters.startPaymentDate ? 'Campo requerido' : ''
                            }
                        }}
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '48%', md: '23%' } }}>
                    <DatePicker
                        label="Fecha final de pago"
                        value={filters.endPaymentDate}
                        onChange={(newValue) => onFilterChange('endPaymentDate')(newValue)}
                        slotProps={{
                            textField: {
                                size: 'small',
                                fullWidth: true,
                                required: isPaymentDateRangeRequired,
                                error: isPaymentDateRangeRequired && !filters.endPaymentDate,
                                helperText: isPaymentDateRangeRequired && !filters.endPaymentDate ? 'Campo requerido' : ''
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