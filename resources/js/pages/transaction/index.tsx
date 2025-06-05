import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Transaction } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions Management',
        href: '/transactions',
    },
];

export default function Index({ transactions }: { transactions: Transaction[] }) {
    const data = transactions
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map((transaction) => ({
            id: transaction.id,
            name: transaction.name,
            source: transaction.budget?.name || 'Tidak ada sumber',
            amount: transaction.amount,
            created_at: transaction.created_at,
            actions: transaction.id,
        }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Budget Planning" />
            <div className="p-6">
                <div className="flex flex-col items-center justify-between lg:flex-row">
                    <div className="mb-4 lg:mb-0">
                        <h1 className="text-2xl font-bold">Catatan Transaksi</h1>

                        <p className="text-muted-foreground mt-2">
                            Kelola dan lacak transaksi Anda dengan mudah. Di sini Anda dapat membuat, mengedit, dan menghapus catatan transaksi.
                        </p>
                    </div>

                    <a href="/transactions/create">
                        <Button>Tambah Data Transaksi</Button>
                    </a>
                </div>
                <DataTable columns={columns} data={data} />
            </div>
        </AppLayout>
    );
}
