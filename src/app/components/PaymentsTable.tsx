import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableFooter, TablePagination, Paper, useTheme, useMediaQuery, Box, Typography } from '@mui/material';
import { Cancel, Info, Preview } from "@mui/icons-material";
import { LazyChipStatus } from "./LazyComponents";
import { PaymentsTableProps } from "@/app/types/components.types";

export default function PaymentsTable({
    data,
    page,
    rowsPerPage,
    totalItems,
    onPageChange,
    onRowsPerPageChange,
    onCancelClick,
    onViewDetails
}: PaymentsTableProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Paper sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
            {
                data.length === 0 ? (
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
                            No hay pagos registrados
                        </Typography>
                        <Info sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }} color='primary' />
                    </Box>
                ) : (
                    <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}>
                        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="payments table">
                            <TableHead>
                                <TableRow>
                                    {['ID', 'Monto', 'Referencia', 'Descripción', 'Fecha de vencimiento', 'Status', 'Acciones'].map((header) => (
                                        <TableCell 
                                            key={header} 
                                            sx={{
                                                backgroundColor: theme.palette.primary.main,
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                color: theme.palette.primary.contrastText,
                                                borderBottom: 'none',
                                                ...(header === 'Status' || header === 'Acciones' ? { textAlign: 'center' } : {})
                                            }}
                                        >
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.map((row) => (
                                        <TableRow
                                            key={row.paymentId}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                '&:hover': { backgroundColor: theme.palette.action.hover },
                                            }}
                                        >
                                            <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '1rem' }}>{row.paymentId}</TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '1rem' }}>{row.amount}</TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '1rem' }}>{row.reference}</TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '1rem' }}>{row.description}</TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '1rem' }}>{new Date(row.dueDate).toLocaleString()}</TableCell>
                                            <TableCell align="center" sx={{ whiteSpace: 'nowrap', fontSize: '1rem' }}>
                                                <LazyChipStatus value={row.status} />
                                            </TableCell>
                                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                                <IconButton onClick={() => onViewDetails(row)} color="primary" size={isMobile ? "medium" : "large"}>
                                                    <Preview />
                                                </IconButton>
                                                {row.status === '01' && (
                                                    <IconButton onClick={() => onCancelClick(row)} color="error" size={isMobile ? "medium" : "large"}>
                                                        <Cancel />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 50, 100]}
                                        colSpan={7}
                                        count={totalItems}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={onPageChange}
                                        onRowsPerPageChange={onRowsPerPageChange}
                                        labelRowsPerPage="Elementos por página"
                                        labelDisplayedRows={({ from, to, count, page }) =>
                                            `Página ${page + 1} de ${Math.ceil(count / rowsPerPage)}`
                                        }
                                        sx={{
                                            '.MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-displayedRows': {
                                                fontSize: '1rem'
                                            }
                                        }}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                )
            }
        </Paper>
    );
} 