import { ColumnDef } from '@tanstack/react-table';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { dateFormatter } from '@/lib/customUtils';
import { type Budget } from '@/types';
import { router } from '@inertiajs/react';
import { ArrowUpDown } from 'lucide-react';

const handleDelete = (budgetId: string) => {
    router.delete(route('budgets.destroy', budgetId), {
        onSuccess: () => {
            router.reload();
        },
    });
};
const now = new Date();

export const columns: ColumnDef<Budget>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    #
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Nama
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => row.getValue('name') || '-',
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Anggaran
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) =>
            (row.getValue('amount') as number).toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }),
    },
    {
        accessorKey: 'expenses',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Pengeluaran Bulan:{' '}
                    {now.toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                    })}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) =>
            (row.getValue('expenses') as number).toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }) || '-',
    },
    {
        accessorKey: 'remaining',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Sisa Anggaran
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) =>
            ((row.getValue('amount') as number) - (row.getValue('expenses') as number)).toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }) || '-',
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Dibuat Pada
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => dateFormatter(row.getValue('created_at')),
    },
    {
        id: 'actions',
        header: 'Opsi',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <a href={`/budgets/${row.getValue('id')}/edit`}>
                    <Button variant="secondary">Edit</Button>
                </a>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Hapus</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Rencana Anggaran</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus rencana anggaran ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(row.getValue('id'))}>Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        ),
    },
];
