import React, { useMemo } from 'react';
import InboxIcon from '@mui/icons-material/Inbox';
import { Button } from '@/components/ui/button';

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
  emptyMessage = 'Aucune donnée trouvée',
  getRowId,
}: Readonly<DataTableProps<T>>) {
  const rowKey = useMemo(() => {
    if (!getRowId) return undefined;
    return new Map(data.map((row, index) => [row, getRowId(row, index)]));
  }, [data, getRowId]);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                  className="px-4 py-3 font-bold text-gray-700 bg-gray-50 border-b-2 border-gray-200"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} align="center" className="py-12">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <InboxIcon sx={{ fontSize: 48 }} />
                    <p className="text-base">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const key = rowKey ? rowKey.get(row) : index;
                return (
                  <tr
                    key={key}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    {columns.map((column) => (
                      <td key={column.id} align={column.align || 'left'} className="px-4 py-3">
                        {column.render(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {totalCount > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <div className="text-sm text-gray-600">
            {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, totalCount)} sur{' '}
            {totalCount}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={(page + 1) * rowsPerPage >= totalCount}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const DataTable = React.memo(DataTableInner) as {
  <T>(
    props: DataTableProps<T> & { getRowId?: (row: T, index: number) => string | number }
  ): React.ReactElement;
  displayName: string;
};

(DataTable as React.FC<{ displayName?: string }>).displayName = 'DataTable';

export default DataTable;
