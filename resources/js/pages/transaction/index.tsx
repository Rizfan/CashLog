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
                {/* <Table className="mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Sumber Dana</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Jumlah</TableHead>
                            <TableHead>Dibuat Pada</TableHead>
                            <TableHead>Opsi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    Tidak ada rencana anggaran yang ditemukan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            // transaksi berdasarkan yang terakhir dibuat
                            transactions
                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                .map((transaction, index) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{transaction.budget.name}</TableCell>
                                        <TableCell>{transaction.name}</TableCell>
                                        <TableCell>Rp {transaction.amount.toLocaleString()}</TableCell>
                                        <TableCell>{dateFormatter(transaction.created_at)}</TableCell>
                                        <TableCell className="flex items-center space-x-2">
                                            <a href={`/transactions/${transaction.id}/edit`}>
                                                <Button variant="outline">Edit</Button>
                                            </a>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive">Hapus</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Hapus Transaksi</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(transaction.id)}>Hapus</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                        )}
                    </TableBody>
                </Table> */}
                <DataTable columns={columns} data={data as any} />
            </div>
        </AppLayout>
    );
}
