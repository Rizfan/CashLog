<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        // $transactions = Transaction::with(['user', 'budget'])->get();
        $transactions = Auth::user()->transactions()->with('budget')->get();
        return Inertia::render('transaction/index', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $budgets = Auth::user()->budgets()->with('transactions')->get();
        return Inertia::render('transaction/form', [
            'budgets' => $budgets,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request)
    {
        //
        $validated = $request->validated();
        $transaction = Transaction::create([
            'user_id' => Auth::id(),
            'budget_id' => $validated['budget_id'],
            'name' => $validated['name'],
            'description' => $validated['description'],
            'amount' => $validated['amount'],
        ]);
        return redirect()->route('transactions.index')->with('success', 'Transaction created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
        $budgets = Auth::user()->budgets()->get();
        return Inertia::render('transaction/form', [
            'transaction' => $transaction,
            'budgets' => $budgets,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        //
        $validated = $request->validated();
        $transaction->update([
            'budget_id' => $validated['budget_id'],
            'name' => $validated['name'],
            'description' => $validated['description'],
            'amount' => $validated['amount'],
        ]);
        return redirect()->route('transactions.index')->with('success', 'Transaction updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        //
        $transaction->delete();
        return redirect()->route('transactions.index')->with('success', 'Transaction deleted successfully.');
    }
}
