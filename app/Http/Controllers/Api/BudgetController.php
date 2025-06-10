<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBudgetRequest;
use App\Http\Requests\UpdateBudgetRequest;
use App\Http\Resources\ApiResource;
use App\Models\Budget;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\UnauthorizedException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class BudgetController extends Controller
{
    //
    public function index()
    {
        try {
            $budgets = Auth::user()->budgets()->with('transactions')->get();
            return new ApiResource(false, 'success', 'Budgets retrieved successfully.', $budgets);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'status' => 'error',
                'message' => 'Failed to retrieve budgets: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(StoreBudgetRequest $request)
    {
        try {
            $validator = $request->validated();

            $budget = Budget::create($validator);
            if ($budget) {
                return new ApiResource(false, 'success', 'Budget created successfully.', $budget);
            } else {
                return response()->json([
                    'error' => true,
                    'status' => 'error',
                    'message' => 'Failed to create budget.',
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'status' => 'error',
                'message' => 'Failed to create budget: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(Budget $budget)
    {
        return new ApiResource(false, 'success', 'Budget retrieved successfully.', $budget);
    }

    public function update(UpdateBudgetRequest $request, Budget $budget)
    {
        try {
            $validator = $request->validated();

            $budget->update($validator);
            if (!$budget) {
                return response()->json([
                    'error' => true,
                    'status' => 'error',
                    'message' => 'Failed to update budget.',
                ], 500);
            }
            return response()->json([
                'error' => false,
                'status' => 'success',
                'message' => 'Budget updated successfully.',
                'budget' => $budget,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'status' => 'error',
                'message' => 'Failed to update budget: ' . $e->getMessage(),
            ], 500);
        }
    }
    public function destroy(Budget $budget)
    {
        try {
            $budget->delete();
            return response()->json([
                'error' => false,
                'status' => 'success',
                'message' => 'Budget deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'status' => 'error',
                'message' => 'Failed to delete budget: ' . $e->getMessage(),
            ], 500);
        }
    }
}
