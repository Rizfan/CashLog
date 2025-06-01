<?php

use App\Http\Controllers\BudgetController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $transaction = Auth::user()->transactions()->with('budget')->get();
        $budget = Auth::user()->budgets()->with('transactions')->get();
        return Inertia::render('dashboard', [
            'transactions' => $transaction,
            'budgets' => $budget,
        ]);
    })->name('dashboard');

    Route::resource('budgets', BudgetController::class)->names('budgets');
    Route::resource('transactions', TransactionController::class)->names('transactions');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
