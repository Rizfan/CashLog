<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Validation\UnauthorizedException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request; // Tambahkan ini
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
        $exceptions->renderable(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) { // Periksa apakah request berasal dari API
                return response()->json([
                    'error' => true,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], Response::HTTP_UNAUTHORIZED); // Gunakan konstanta Response
            }
        });
    })->create();
