"use client";
import { useEffect, useState } from "react";
import { Box, useTheme, TextField, InputAdornment, Button, Stack, Collapse, CircularProgress, Typography } from "@mui/material";
import { Search, Add, FilterList, TableRows } from "@mui/icons-material";
import * as XLSX from 'xlsx';
import { Filters, STATUS_MAP } from "@/app/types/components.types";
import { LazyDynamicForm, LazyModalInformation, LazyPaymentsTable, LazyPaymentFilters } from "@/app/components/LazyComponents";
import { useDispatch, useSelector } from "react-redux";
import { cancelPaymentAndRefresh, searchPayments, setPage, setPageSize, setSelectedPayment } from "@/app/redux/payments.slice";
import { AppDispatch, RootState } from "@/app/redux/store";
import { CancelPaymentBody, GeneratePaymentBody, PaymentRow, ValidPaymentStatus } from "@/app/types/payments.types";
import { CancelPaymentAndRefreshBody } from "@/app/types/form.types";
import moment from 'moment';
import { PaymentsService } from "../api/services/payments.service";

export default function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const { payments, pageSize, loading, error, currentPage, selectedPayment, totalElements } = useSelector((state: RootState) => state.payments);

    const [openModal, setOpenModal] = useState(false);
    const [openPaymentForm, setOpenPaymentForm] = useState(false);
    const [openCancelForm, setOpenCancelForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [reference, setReference] = useState<string | undefined>();
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
            dispatch(searchPayments(filters));
        }
    }, [dispatch, filters]);

    async function handlePaymentSubmit<T>(data: Record<string, T>) {
        try {
            const body: GeneratePaymentBody = {
                externalId: data.externalId as string,
                amount: Number(data.amount),
                description: data.description as string,
                dueDate: moment(data.dueDate as Date).format('YYYY-MM-DD HH:mm:ss'),
                callbackURL: "https://localhost:8080/callback"
            }
            const response = await PaymentsService.generatePayment(body);
            if (response) {
                setReference(response.data.reference);
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleCancelSubmit<T>(data: Record<string, T>) {
        data.status = ValidPaymentStatus.CANCELED as T;
        const body = data as unknown as CancelPaymentBody;
        const reqBody = { body, filters } as CancelPaymentAndRefreshBody;
        dispatch(cancelPaymentAndRefresh(reqBody));
        setOpenCancelForm(false);
    }

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
        dispatch(setPage(0));
    };

    const handleExportExcel = () => {
        const exportData = payments.map(row => ({
            'ID': row.paymentId,
            'Monto': row.amount,
            'Referencia': row.reference,
            'Descripción': row.description,
            'Fecha de Vencimiento': row.dueDate,
            'Status': STATUS_MAP[row.status as keyof typeof STATUS_MAP] || row.status,
            'Descripción de Cancelación': row.cancelDescription || 'N/A',
            'ID Externo': row.externalId
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        ws['!cols'] = [
            { wch: 20 }, { wch: 10 }, { wch: 15 },
            { wch: 30 }, { wch: 20 }, { wch: 15 },
            { wch: 30 }, { wch: 20 }
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Pagos");
        XLSX.writeFile(wb, `pagos_${new Date().toISOString().split('T')[0]}.xlsx`);
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
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenPaymentForm(true)}
                        sx={{ height: '40px', whiteSpace: 'nowrap' }}
                    >
                        Agregar Pago
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<FilterList />}
                        onClick={() => setShowFilters(!showFilters)}
                        sx={{ height: '40px', whiteSpace: 'nowrap' }}
                    >
                        {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="success"
                        disabled={totalElements === 0}
                        onClick={handleExportExcel}
                        startIcon={<TableRows />}
                        sx={{ height: '40px', whiteSpace: 'nowrap' }}
                    >
                        Exportar como Excel
                    </Button>
                </Stack>

                <TextField
                    placeholder="Buscar..."
                    variant="outlined"
                    size="small"
                    disabled={totalElements === 0}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        minWidth: { xs: '100%', sm: '300px' },
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-root': {
                            height: '40px',
                            '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                            },
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

            <Collapse in={showFilters}>
                <LazyPaymentFilters
                    type="table"
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
            </Collapse>

            <LazyPaymentsTable
                data={payments}
                page={currentPage}
                rowsPerPage={pageSize}
                totalItems={totalElements}
                onPageChange={(event, newPage) => dispatch(setPage(newPage))}
                onRowsPerPageChange={(event) => {
                    dispatch(setPageSize(parseInt(event.target.value, 10)));
                    dispatch(setPage(0));
                }}
                onCancelClick={(row: PaymentRow) => {
                    dispatch(setSelectedPayment(row));
                    setOpenCancelForm(true);
                }}
                onViewDetails={(row: PaymentRow) => {
                    dispatch(setSelectedPayment(row));
                    setOpenModal(true);
                }}
            />

            <LazyDynamicForm
                selectedRow={null}
                isOpen={openPaymentForm}
                formType="payment"
                onClose={() => setOpenPaymentForm(false)}
                onSubmit={handlePaymentSubmit}
                reference={reference}
                setReference={() => setReference(undefined)}
            />

            <LazyDynamicForm
                isOpen={openCancelForm}
                formType="cancel"
                onClose={() => setOpenCancelForm(false)}
                onSubmit={handleCancelSubmit}
                selectedRow={selectedPayment}
            />

            {
                selectedPayment && <LazyModalInformation
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    row={selectedPayment}
                />
            }
        </Box>
    );
}