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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dateFormatter } from '@/lib/customUtils';
import { type BreadcrumbItem, type Budget, type Transaction } from '@/types';
import { Head, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Budget Planning',
        href: '/budgets',
    },
];
const now = new Date();

export default function Index({ budgets }: { budgets: Budget[] }) {
    const handleDelete = (budgetId: string) => {
        router.delete(route('budgets.destroy', budgetId), {
            onSuccess: () => {
                router.reload();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Budget Planning" />
            <div className="p-6">
                <div className="flex flex-col items-center justify-between lg:flex-row">
                    <div className="mb-4 lg:mb-0">
                        <h1 className="text-2xl font-bold">Budget Planning</h1>

                        <p className="text-muted-foreground mt-2">
                            Rencanakan alokasi anggaran Anda dengan mudah. Di sini Anda dapat membuat, mengelola, dan melacak anggaran Anda.
                        </p>
                    </div>

                    <a href="/budgets/create">
                        <Button>Tambah Rencana Anggaran</Button>
                    </a>
                </div>
                <Table className="mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Anggaran</TableHead>
                            <TableHead>
                                Pengeluaran Bulan:{' '}
                                {now.toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                })}
                            </TableHead>
                            <TableHead>Sisa</TableHead>
                            <TableHead>Dibuat Pada</TableHead>
                            <TableHead>Opsi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {budgets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    Tidak ada rencana anggaran yang ditemukan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            budgets.map((budget, index) => (
                                <TableRow key={budget.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{budget.name}</TableCell>
                                    <TableCell>
                                        {budget.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                                    </TableCell>
                                    <TableCell>
                                        {(() => {
                                            const totalSpent =
                                                budget.transactions
                                                    ?.filter((transaction: Transaction) => {
                                                        const date = new Date(transaction.created_at);
                                                        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                                                    })
                                                    .reduce((total: number, transaction: Transaction) => total + transaction.amount, 0) || 0;
                                            return totalSpent.toLocaleString('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                minimumFractionDigits: 0,
                                            });
                                        })()}
                                    </TableCell>
                                    <TableCell>
                                        {(() => {
                                            const totalThisMonth =
                                                budget.transactions
                                                    ?.filter((transaction: Transaction) => {
                                                        const date = new Date(transaction.created_at);
                                                        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                                                    })
                                                    .reduce((total: number, transaction: Transaction) => total + transaction.amount, 0) || 0;
                                            const remaining = budget.amount - totalThisMonth;
                                            return remaining.toLocaleString('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                minimumFractionDigits: 0,
                                            });
                                        })()}
                                    </TableCell>
                                    <TableCell>{dateFormatter(budget.created_at)}</TableCell>
                                    <TableCell className="flex items-center space-x-2">
                                        <a href={`/budgets/${budget.id}/edit`} className="text-blue-600 hover:underline">
                                            <Button>Edit</Button>
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
                                                    <AlertDialogAction onClick={() => handleDelete(budget.id)}>Hapus</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
