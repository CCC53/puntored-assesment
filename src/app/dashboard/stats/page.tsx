"use client";
import { useEffect, useState } from "react";
import { Box, useTheme, TextField, InputAdornment, Button, Stack, Collapse, CircularProgress, Typography } from "@mui/material";
import { Search, Add, FilterList, TableRows } from "@mui/icons-material";
import * as XLSX from 'xlsx';
import { Filters, STATUS_MAP } from "@/app/types/components.types";
import { LazyDynamicForm, LazyModalInformation, LazyPaymentsTable, LazyPaymentFilters } from "@/app/components/LazyComponents";
import { useDispatch, useSelector } from "react-redux";
import { searchPayments, setPage, setPageSize, setSelectedPayment } from "@/app/redux/payments.slice";
import { RootState } from "@/app/redux/store";
import { PaymentRow } from "@/app/types/payments.types";

export default function Dashboard() {
    const dispatch = useDispatch();
    const { payments, pageSize, loading, error, currentPage, selectedPayment, totalElements } = useSelector((state: RootState) => state.payments);

    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        startCreationDate: null,
        endCreationDate: null,
        startPaymentDate: null,
        endPaymentDate: null,
        status: ''
    });
    
    const theme = useTheme();

    const hasValidFilters = (filters: Filters): boolean => {
        const hasValidDateRange = (
            (filters.startCreationDate !== null && filters.endCreationDate !== null) ||
            (filters.startPaymentDate !== null && filters.endPaymentDate !== null)
        );
        
        const hasValidStatus = filters.status !== '';
        
        return hasValidDateRange && hasValidStatus;
    };

    useEffect(() => {
        if (hasValidFilters(filters)) {
            // @ts-ignore - Known issue with Redux Toolkit types
            dispatch(searchPayments(filters));
        }
    }, [dispatch, filters]);


    const handleFilterChange = (field: keyof Filters) => (value: any) => {
        let processedValue = value;
        if (field === 'endCreationDate' || field === 'endPaymentDate') {
            if (value) {
                const date = new Date(value);
                date.setHours(23, 59, 0, 0);
                processedValue = date;
            }
        }
        setFilters(prev => ({
            ...prev,
            [field]: processedValue
        }));
        dispatch(setPage(0));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mb: 3 }}
                justifyContent="space-between"
                alignItems={{ xs: 'stretch', sm: 'center' }}
            >
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{
                        flexWrap: { xs: 'wrap', md: 'nowrap' },
                        gap: { xs: 1, md: 2 }
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<FilterList />}
                        onClick={() => setShowFilters(!showFilters)}
                        sx={{ height: '40px', whiteSpace: 'nowrap' }}
                    >
                        {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                    </Button>
                </Stack>
            </Stack>

            <Collapse in={showFilters}>
                <LazyPaymentFilters 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
            </Collapse>
        </Box>
    );
}