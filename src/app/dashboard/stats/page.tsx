"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FilterList, Info } from "@mui/icons-material";
import { Box, Button, Stack, Collapse, Typography } from "@mui/material";
import { Filters } from "@/app/types/components.types";
import { LazyNoDataInfo, LazyPaymentFilters, LazyPaymentStatsChart } from "@/app/components/LazyComponents";
import { AppDispatch, RootState } from "@/app/redux/store";
import { countPaymentsForStats } from "@/app/redux/payments.slice";

export default function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const { totalPayments } = useSelector((state: RootState) => state.payments);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        startCreationDate: null,
        endCreationDate: null,
        startPaymentDate: null,
        endPaymentDate: null,
        status: ''
    });

    const hasValidFilters = (filters: Filters): boolean => {
        const hasValidDateRange = (
            (filters.startCreationDate !== null && filters.endCreationDate !== null) ||
            (filters.startPaymentDate !== null && filters.endPaymentDate !== null)
        );
        return hasValidDateRange;
    };

    useEffect(() => {
        if (hasValidFilters(filters)) {
            dispatch(countPaymentsForStats(filters));
        }
    }, [filters, dispatch]);

    const handleFilterChange = <K extends keyof Filters>(field: K) => (value: Filters[K]) => {
        let processedValue = value;
        if (field === 'endCreationDate' || field === 'endPaymentDate') {
            if (value) {
                const date = new Date(value);
                date.setHours(23, 59, 0, 0);
                processedValue = date as Filters[K];
            }
        }
        setFilters(prev => ({
            ...prev,
            [field]: processedValue
        }));
    };

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
                    type="stats"
                />
            </Collapse>
            {hasValidFilters(filters) ? <LazyPaymentStatsChart stats={totalPayments} /> : <LazyNoDataInfo message="No hay estadísticas por mostrar"/>}
        </Box>
    );
}