<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Http\Requests\StoreBudgetRequest;
use App\Http\Requests\UpdateBudgetRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use function Termwind\render;

class BudgetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Inertia::render('budget/index', [
            'budgets' => Auth::user()->budgets()->with('transactions')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('budget/form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBudgetRequest $request)
    {
        //
        $budget = Budget::create($request->validated());
        return redirect()->route('budgets.index')->with('success', 'Budget created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Budget $budget)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Budget $budget)
    {
        //
        return Inertia::render('budget/form', [
            'budget' => $budget,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBudgetRequest $request, Budget $budget)
    {
        //
        $budget->update($request->validated());
        return redirect()->route('budgets.index')->with('success', 'Budget updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Budget $budget)
    {
        //
        $budget->delete();
        return redirect()->route('budgets.index')->with('success', 'Budget deleted successfully.');
    }
}
