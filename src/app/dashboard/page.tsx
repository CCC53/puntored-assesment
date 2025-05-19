"use client";
import { useState } from "react";
import { Box, useTheme, TextField, InputAdornment, Button, Stack, Collapse } from "@mui/material";
import { Search, Add, FilterList, TableRows } from "@mui/icons-material";
import * as XLSX from 'xlsx';
import { Filters, STATUS_MAP } from "../utils/types/components/components";
import { LazyDynamicForm, LazyModalInformation, LazyPaymentsTable, LazyPaymentFilters } from "../components/LazyComponents";

const data = {
    "responseCode": 200,
    "responseMessage": "Payments retrieved successfully",
    "data": {
        "content": [
            {
                "paymentId": 622,
                "amount": 100.0,
                "reference": "PRV1250518EB481C8B53C6A05D4C48",
                "description": "Payment description",
                "dueDate": "2025-05-30 11:59:00",
                "status": "01",
                "callBackURL": "https://localhost:8080/callback",
                "callbackACKID": "",
                "cancelDescription": "",
                "externalId": "12332"
            }
        ],
        "page": {
            "size": 10,
            "number": 0,
            "totalElements": 1,
            "totalPages": 1
        }
    }
};

export default function Dashboard() {
    const [page, setPage] = useState(data.data.page.number);
    const [openModal, setOpenModal] = useState(false);
    const [openPaymentForm, setOpenPaymentForm] = useState(false);
    const [openCancelForm, setOpenCancelForm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(data.data.page.size);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        startCreationDate: null,
        endCreationDate: null,
        startPaymentDate: null,
        endPaymentDate: null,
        status: ''
    });
    
    const theme = useTheme();

    const handlePaymentSubmit = async (data: Record<string, any>) => {
        console.log('Payment form data:', data);
        setOpenPaymentForm(false);
    };

    const handleCancelSubmit = async (data: Record<string, any>) => {
        console.log('Cancel form data:', data);
        setOpenCancelForm(false);
    };

    const handleFilterChange = (field: keyof Filters) => (value: any) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
        setPage(0);
    };

    const filteredRows = data.data.content.filter((row: any) => {
        const matchesSearch = Object.values(row).some((value: any) =>
            value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );

        const matchesFilters =
            (!filters.startCreationDate || new Date(row.dueDate) >= filters.startCreationDate) &&
            (!filters.endCreationDate || new Date(row.dueDate) <= filters.endCreationDate) &&
            (!filters.startPaymentDate || new Date(row.dueDate) >= filters.startPaymentDate) &&
            (!filters.endPaymentDate || new Date(row.dueDate) <= filters.endPaymentDate) &&
            (!filters.status || row.status === filters.status);

        return matchesSearch && matchesFilters;
    });

    const handleExportExcel = () => {
        const exportData = filteredRows.map(row => ({
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
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
            </Collapse>

            <LazyPaymentsTable
                filteredRows={filteredRows}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                }}
                onCancelClick={(row) => {
                    setSelectedRow(row);
                    setOpenCancelForm(true);
                }}
                onViewDetails={(row) => {
                    setSelectedRow(row);
                    setOpenModal(true);
                }}
            />

            <LazyDynamicForm
                isOpen={openPaymentForm}
                formType="payment"
                onClose={() => setOpenPaymentForm(false)}
                onSubmit={handlePaymentSubmit}
            />

            <LazyDynamicForm
                isOpen={openCancelForm}
                formType="cancel"
                onClose={() => setOpenCancelForm(false)}
                onSubmit={handleCancelSubmit}
                selectedRow={selectedRow}
            />

            <LazyModalInformation 
                isOpen={openModal} 
                onClose={() => setOpenModal(false)} 
                row={selectedRow} 
            />
        </Box>
    );
}