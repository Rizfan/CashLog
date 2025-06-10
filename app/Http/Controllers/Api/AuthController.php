<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'error' => false,
            'status' => 'success',
            'message' => 'Registration successful.'
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email or password is incorrect.'],
            ]);
        }

        // Buat token untuk mobile app
        $token = $user->createToken('mobile-token')->plainTextToken;

        return response()->json([
            'error' => false,
            'status' => 'success',
            'message' => 'Login successful.',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function user(Request $request)
    {
        try {
            $user = $request->user();
            return response()->json([
                'error' => false,
                'status' => 'success',
                'message' => 'User retrieved successfully.',
                'user' => $user,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'status' => 'error',
                'message' => 'Failed to retrieve user: ' . $e->getMessage(),
            ], 500);
        } catch (AuthenticationException $e) {
            return response()->json([
                'error' => true,
                'status' => 'error',
                'message' => 'Unauthorized: ' . $e->getMessage(),
            ], 401);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully.']);
    }
}
