import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Budget, type Transaction } from '@/types';
import { Head, router } from '@inertiajs/react';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Budget Planning',
        href: '/budgets',
    },
];
const now = new Date();

export default function Index({ budgets }: { budgets: Budget[] }) {
    const data = budgets.map((budget) => ({
        id: budget.id,
        name: budget.name,
        amount: budget.amount,
        expenses:
            budget.transactions
                ?.filter((transaction: Transaction) => {
                    const date = new Date(transaction.created_at);
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                })
                .reduce((total: number, transaction: Transaction) => total + transaction.amount, 0) || 0,
        created_at: budget.created_at,
    }));

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
                <DataTable data={data as any} columns={columns} />
            </div>
        </AppLayout>
    );
}
