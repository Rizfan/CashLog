import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type Auth, type BreadcrumbItem, type Budget, type Transaction } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

type TransactionFormData = {
    user_id: string;
    budget_id: string;
    name: string;
    description: string;
    amount: number;
};

export default function Form(props: { auth: Auth; budgets: Budget[] | null; transaction?: Transaction | null }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Transactions Management',
            href: '/transactions',
        },
        {
            title: props.transaction ? 'Edit Transaction' : 'Create Transaction',
            href: props.transaction ? `/transactions/${props.transaction.id}/edit` : '/transactions/create',
        },
    ];

    const { data, setData, post, processing, errors } = useForm<TransactionFormData>({
        user_id: props.auth.user.id,
        budget_id: props.transaction?.budget_id || '',
        name: props.transaction?.name || '',
        description: props.transaction?.description || '',
        amount: props.transaction?.amount || 0,
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (props.transaction) {
            post(route('transactions.update', props.transaction.id), {
                method: 'put',
                headers: {
                    'X-HTTP-Method-Override': 'PUT',
                },
                onSuccess: () => {
                    setData({
                        user_id: props.auth.user.id,
                        budget_id: '',
                        name: '',
                        description: '',
                        amount: 0,
                    });
                },
            });
        } else {
            post(route('transactions.store'), {
                onSuccess: () => {
                    setData({
                        user_id: props.auth.user.id,
                        budget_id: '',
                        name: '',
                        description: '',
                        amount: 0,
                    });
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Budget" />
            <div className="p-6">
                <h1 className="mb-4 text-2xl font-bold">Buat data tranksaksi anda</h1>
                <form onSubmit={handleSubmit} className="w-1/2 space-y-4">
                    <div className="grid gap-2">
                        <Label>Pilih Sumber Anggaran</Label>
                        <Select value={data.budget_id} onValueChange={(value) => setData('budget_id', value)} disabled={processing} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih anggaran" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Anggaran</SelectLabel>
                                    {props.budgets?.map((budget) => (
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

                                    const now = new Date();
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
                            autoFocus
                            autoComplete="off"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Masukkan nama Transaksi"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Deskripsi Transaksi</Label>
                        <Textarea
                            id="description"
                            required
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            disabled={processing}
                            placeholder="Masukkan deskripsi Transaksi"
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Jumlah Transaksi</Label>
                        <Input
                            id="amount"
                            type="number"
                            required
                            value={data.amount}
                            onChange={(e) => setData('amount', parseFloat(e.target.value))}
                            disabled={processing}
                            placeholder="Masukkan jumlah Transaksi"
                        />
                        <InputError message={errors.amount} className="mt-2" />
                    </div>
                    <input type="hidden" name="user_id" value={data.user_id} />
                    <Button type="submit" disabled={processing}>
                        Simpan
                        {processing && <LoaderCircle className="ml-2 animate-spin" />}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
