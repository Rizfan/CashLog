import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { dateTimeFormatter } from '@/lib/customUtils';
import { type Auth, type BreadcrumbItem, type Budget, type Transaction } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArcElement, Chart, Colors, Legend, Tooltip } from 'chart.js';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Pie } from 'react-chartjs-2';
import { type TransactionFormData } from './transaction/form';

Chart.register(ArcElement, Tooltip, Legend, Colors);

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

export default function Dashboard(props: { auth: Auth; transactions: Transaction[]; budgets: Budget[] }) {
    const { data, setData, post, processing, errors } = useForm<TransactionFormData>({
        user_id: props.auth.user.id,
        budget_id: '',
        name: '',
        description: '',
        amount: null,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('transactions.store'), {
            onSuccess: () => {
                setData({
                    user_id: props.auth.user.id,
                    budget_id: '',
                    name: '',
                    description: '',
                    amount: null,
                });
            },
            onError: (errors) => {
                console.error('Terjadi kesalahan:', errors);
            },
        });
    };

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
                    <div className="mb-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>Tambah Transaksi</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <form onSubmit={handleSubmit} className="w-full space-y-4">
                                    <DialogHeader>
                                        <DialogTitle>Tambah Transaksi</DialogTitle>
                                        <DialogDescription>Tambahkan transaksi baru untuk melacak pengeluaran Anda.</DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-2">
                                        <Label>Pilih Sumber Anggaran</Label>
                                        <Select
                                            value={data.budget_id}
                                            onValueChange={(value) => setData('budget_id', value)}
                                            disabled={processing}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih anggaran" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Anggaran</SelectLabel>
                                                    {/* menampilkan budge yang dananya masih tersisa */}
                                                    {props.budgets
                                                        .filter((budget) => {
                                                            const totalSpent = props.transactions
                                                                .filter((transaction) => transaction.budget_id === budget.id)
                                                                .reduce((sum, transaction) => sum + transaction.amount, 0);
                                                            return budget.amount - totalSpent > 0;
                                                        })
                                                        .map((budget) => (
                                                            <SelectItem key={budget.id} value={budget.id}>
                                                                {budget.name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.budget_id} className="mt-2" />
                                        {props.budgets && data.budget_id && (
                                            <div className="text-muted-foreground text-sm">
                                                Jumlah Anggaran Tersisa:{' '}
                                                {(() => {
                                                    const budget = props.budgets.find((budget) => budget.id === data.budget_id);
                                                    if (!budget) return 'Rp0';

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
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nama Transaksi</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoComplete="off"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            disabled={processing}
                                            placeholder="Masukkan nama Transaksi"
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Deskripsi</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            disabled={processing}
                                            placeholder="Masukkan deskripsi Transaksi"
                                        />
                                        <InputError message={errors.description} className="mt-2" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="amount">Jumlah</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            required
                                            value={data.amount || ''}
                                            onChange={(e) => setData('amount', parseFloat(e.target.value))}
                                            disabled={processing}
                                            placeholder="Masukkan jumlah Transaksi"
                                        />
                                        <InputError message={errors.amount} className="mt-2" />
                                    </div>
                                    <input type="hidden" name="user_id" value={data.user_id} />

                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>

                                        <Button type="submit" disabled={processing}>
                                            {processing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                                            Simpan
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
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
