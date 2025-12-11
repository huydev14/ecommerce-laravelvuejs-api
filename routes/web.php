<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Serve Vue SPA for all routes
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
