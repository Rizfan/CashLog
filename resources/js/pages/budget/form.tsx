import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type Auth, type BreadcrumbItem, type Budget } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

type BudgetFormData = {
    user_id: string;
    name: string;
    description: string;
    amount: number;
};

export default function Form(props: { auth: Auth; budget?: Budget | null }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Budget Planning',
            href: '/budgets',
        },
        {
            title: props.budget ? 'Edit Budget' : 'Create Budget',
            href: props.budget ? `/budgets/${props.budget.id}/edit` : '/budgets/create',
        },
    ];

    const { data, setData, post, processing, errors } = useForm<BudgetFormData>({
        user_id: props.auth.user.id,
        name: props.budget?.name || '',
        description: props.budget?.description || '',
        amount: props.budget?.amount || 0,
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (props.budget) {
            post(route('budgets.update', props.budget.id), {
                method: 'put',
                headers: {
                    'X-HTTP-Method-Override': 'PUT',
                },
                onSuccess: () => {
                    setData({
                        user_id: props.auth.user.id,
                        name: '',
                        description: '',
                        amount: 0,
                    });
                },
            });
        } else {
            post(route('budgets.store'), {
                onSuccess: () => {
                    setData({
                        user_id: props.auth.user.id,
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
                <h1 className="mb-4 text-2xl font-bold">Buat Rencana Alokasi Anggaran</h1>
                <form onSubmit={handleSubmit} className="w-1/2 space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama Anggaran</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Masukkan nama anggaran"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea
                            id="description"
                            required
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            disabled={processing}
                            placeholder="Masukkan deskripsi anggaran"
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Jumlah Anggaran</Label>
                        <Input
                            id="amount"
                            type="number"
                            required
                            value={data.amount}
                            onChange={(e) => setData('amount', parseFloat(e.target.value))}
                            disabled={processing}
                            placeholder="Masukkan jumlah anggaran"
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
