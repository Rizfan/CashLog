import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dateTimeFormatter } from '@/lib/customUtils';
import { type BreadcrumbItem, type Budget, type Transaction } from '@/types';
import { Head } from '@inertiajs/react';
import { ArcElement, Chart, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';
Chart.register(ArcElement, Tooltip, Legend);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const now = new Date();
const options = {
    responsive: true,
    plugins: {
        legend: { position: 'top' as const, fullsize: true, align: 'center' as const },
        tooltip: { enabled: true },
        title: {
            display: true,
        },
    },
};

export default function Dashboard(props: { transactions: Transaction[]; budgets: Budget[] }) {
    const transactionChartData = {
        title: 'Pengeluaran',
        labels: props.budgets.map((budget: Budget) => budget.name),
        datasets: [
            {
                label: 'Pengeluaran',
                // menampilkan total pengeluaran tiap budget
                data: props.budgets.map((budget: Budget) => {
                    const totalSpent = props.transactions
                        .filter((transaction: Transaction) => {
                            const date = new Date(transaction.created_at);
                            return (
                                date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear() && transaction.budget_id === budget.id
                            );
                        })
                        .reduce((sum: number, transaction: Transaction) => sum + transaction.amount, 0);
                    return totalSpent;
                }),
                backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
                borderWidth: 1,
            },
        ],
    };

    const budgetChartData = {
        labels: props.budgets.map((budget: Budget) => budget.name),
        datasets: [
            {
                label: 'Anggaran',
                data: props.budgets.map((budget: Budget) => budget.amount),
                backgroundColor: ['rgb(75, 192, 192)', 'rgb(153, 102, 255)', 'rgb(255, 159, 64)'],
                borderWidth: 1,
            },
        ],
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-6">
                <div className="flex flex-col items-center justify-between lg:flex-row">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground mt-2">
                            Pantau dan kelola keuangan Anda dengan mudah. Di sini Anda dapat melihat ringkasan transaksi dan anggaran.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="dark:bg-sidebar rounded-lg bg-white p-4 shadow-md">
                        <h2 className="mb-4 text-lg font-semibold">
                            Pengeluaran Bulan:{' '}
                            {now.toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                            })}
                        </h2>
                        {props.transactions.length > 0 ? (
                            <Pie data={transactionChartData} options={options} />
                        ) : (
                            <PlaceholderPattern className="h-64" />
                        )}
                        {/* total pengeluaran */}
                        <div className="text-muted-foreground mt-4 text-center text-sm">
                            Total Pengeluaran:
                            {props.transactions
                                .filter((transaction) => {
                                    const date = new Date(transaction.created_at);
                                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                                })
                                .reduce((total, transaction) => total + transaction.amount, 0)
                                .toLocaleString('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0,
                                })}
                        </div>
                    </div>

                    <div className="dark:bg-sidebar rounded-lg bg-white p-4 shadow-md">
                        <h2 className="mb-4 text-lg font-semibold">
                            Anggaran Bulan:{' '}
                            {now.toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                            })}
                        </h2>
                        {props.budgets.length > 0 ? <Pie data={budgetChartData} options={options} /> : <PlaceholderPattern className="h-64" />}
                        {/* total anggaran */}
                        <div className="text-muted-foreground mt-4 text-center text-sm">
                            Total Anggaran Bulanan:
                            {props.budgets
                                .reduce((total, budget) => total + budget.amount, 0)
                                .toLocaleString('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0,
                                })}
                        </div>
                    </div>

                    <div className="dark:bg-sidebar h-fit rounded-lg bg-white p-4 shadow-md">
                        <h2 className="mb-4 text-lg font-semibold">
                            Sisa Anggaran Bulan:{' '}
                            {now.toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                            })}
                        </h2>
                        {props.budgets.length > 0 ? (
                            <ul className="space-y-2">
                                {props.budgets.map((budget) => {
                                    const totalSpent = props.transactions
                                        .filter((transaction) => {
                                            const date = new Date(transaction.created_at);
                                            return (
                                                date.getMonth() === now.getMonth() &&
                                                date.getFullYear() === now.getFullYear() &&
                                                transaction.budget_id === budget.id
                                            );
                                        })
                                        .reduce((sum, transaction) => sum + transaction.amount, 0);
                                    const remaining = budget.amount - totalSpent;
                                    return (
                                        <li key={budget.id} className="flex justify-between">
                                            <span>{budget.name}</span>
                                            <span>
                                                {remaining.toLocaleString('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                    minimumFractionDigits: 0,
                                                })}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <PlaceholderPattern className="h-64" />
                        )}
                        {/* total sisa anggaran */}
                        <div className="text-muted-foreground mt-4 text-center text-sm">
                            Total Sisa Anggaran:
                            {props.budgets
                                .reduce((total, budget) => {
                                    const totalSpent = props.transactions
                                        .filter((transaction) => {
                                            const date = new Date(transaction.created_at);
                                            return (
                                                date.getMonth() === now.getMonth() &&
                                                date.getFullYear() === now.getFullYear() &&
                                                transaction.budget_id === budget.id
                                            );
                                        })
                                        .reduce((sum, transaction) => sum + transaction.amount, 0);
                                    return total + (budget.amount - totalSpent);
                                }, 0)
                                .toLocaleString('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0,
                                })}
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <h2 className="mb-4 text-lg font-semibold">Catatan Transaksi</h2>
                    {props.transactions.length > 0 ? (
                        <ul className="space-y-4">
                            {props.transactions
                                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                .slice(0, 5)
                                .map((transaction) => (
                                    <li key={transaction.id} className="dark:bg-sidebar rounded-lg bg-white p-4 shadow">
                                        <h3 className="text-md font-semibold">{transaction.name}</h3>
                                        <p className="text-muted-foreground text-sm">
                                            Jumlah:
                                            {transaction.amount.toLocaleString('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                minimumFractionDigits: 0,
                                            })}
                                        </p>
                                        <p className="text-muted-foreground text-sm">Dibuat pada: {dateTimeFormatter(transaction.created_at)}</p>
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground">Tidak ada transaksi yang ditemukan.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
