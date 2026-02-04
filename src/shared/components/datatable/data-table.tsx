import { type Table as TanstackTable, flexRender } from "@tanstack/react-table";
import * as React from "react";
import { DataTablePagination } from "./data-table-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/shared/components/global/ui/table";
import { cn } from "@/src/shared/lib/utils";

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
    table: TanstackTable<TData>;
    onRowClick?: (data: TData) => void;
    onRowDoubleClick?: (data: TData) => void;
    isPaginationVisible?: boolean;
    floatingBar?: React.ReactNode | null;
    isLoading?: boolean;
    error?: any;
}

export function DataTable<TData>({ table, children, floatingBar, onRowClick, onRowDoubleClick, isLoading, error, isPaginationVisible = true, className }: DataTableProps<TData>) {
    return (
        <div>
            {children}
            <div className={cn("rounded-lg border shadow-sm overflow-x-auto", className)}       >
                <Table className="min-w-full">
                    <TableHeader className="bg-[#F9FAFB]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-sm font-medium">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={`loading-${index}`}>
                                    {table.getAllColumns().map((column, colIndex) => {
                                        const widths = ['w-full', 'w-3/4', 'w-1/2', 'w-2/3', 'w-4/5'];
                                        const width = widths[colIndex % widths.length];
                                        return (
                                            <TableCell key={column.id} className="h-16">
                                                <div
                                                    className={`h-4 bg-gray-200 rounded ${width} relative overflow-hidden`}
                                                    style={{
                                                        background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
                                                        backgroundSize: '200% 100%',
                                                        animation: 'shimmer 2s infinite'
                                                    }}
                                                />
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : error ? (
                            // Error state
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-red-600">Erro ao carregar dados</p>
                                        <p className="text-sm text-gray-500">{error?.message || "Tente novamente mais tarde"}</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            // Data rows
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                                    onDoubleClick={onRowDoubleClick ? () => onRowDoubleClick(row.original) : undefined}
                                    className={onRowDoubleClick ? "cursor-pointer hover:bg-[#F9FAFB]" : undefined}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            // Empty state
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                    Sem resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col gap-2.5">
                <DataTablePagination table={table} isVisible={isPaginationVisible} />
                {table.getFilteredSelectedRowModel().rows.length > 0 && floatingBar}
            </div>
        </div>
    );
}
