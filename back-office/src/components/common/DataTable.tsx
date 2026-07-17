import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

export interface Column<T> {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  emptyMessage?: string;
  getRowId?: (row: T, index: number) => string | number;
}

function DataTableInner<T>({
  columns,
  data,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  emptyMessage = 'Aucune donnée trouvée',
  getRowId,
}: DataTableProps<T>) {
  const rowKey = useMemo(() => {
    if (!getRowId) return undefined;
    return new Map(data.map((row, index) => [row, getRowId(row, index)]));
  }, [data, getRowId]);

  return (
    <Paper elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{
                    minWidth: column.minWidth,
                    fontWeight: 700,
                    backgroundColor: '#f9fafb',
                    color: '#374151',
                    borderBottom: '2px solid #e5e7eb',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                  <Box className="flex flex-col items-center gap-2 text-gray-400">
                    <InboxIcon sx={{ fontSize: 48 }} />
                    <Typography variant="body1">{emptyMessage}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const key = rowKey ? rowKey.get(row) : index;
                return (
                  <TableRow
                    key={key}
                    hover
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                      transition: 'background-color 0.15s',
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align || 'left'}>
                        {column.render(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {totalCount > 0 && (
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Lignes par page :"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
          }
          sx={{
            borderTop: '1px solid #e5e7eb',
            '.MuiTablePagination-toolbar': { px: 2 },
          }}
        />
      )}
    </Paper>
  );
}

const DataTable = React.memo(DataTableInner) as {
  <T>(props: DataTableProps<T> & { getRowId?: (row: T, index: number) => string | number }): React.ReactElement;
  displayName: string;
};

(DataTable as React.FC<{ displayName?: string }>).displayName = 'DataTable';

export default DataTable;
