import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableFooter, TablePagination, Paper, useTheme, useMediaQuery } from "@mui/material";
import { Cancel, Preview } from "@mui/icons-material";
import { LazyChipStatus } from "./LazyComponents";
import { PaymentsTableProps } from "../utils/types/components/components";

export default function PaymentsTable({
    filteredRows,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    onCancelClick,
    onViewDetails
}: PaymentsTableProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Paper sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="payments table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                            {['ID', 'Monto', 'Referencia', 'Descripción', 'Fecha de vencimiento', 'Status', 'Acciones'].map((header) => (
                                <TableCell key={header} sx={{
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    color: theme.palette.primary.contrastText,
                                    ...(header === 'Status' || header === 'Acciones' ? { textAlign: 'center' } : {})
                                }}>
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : filteredRows
                        ).map((row) => (
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
                                <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '1rem' }}>{row.dueDate}</TableCell>
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
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[10, 50, 100]}
                                colSpan={7}
                                count={filteredRows.length}
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
        </Paper>
    );
} 