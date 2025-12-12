<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\JWTGuard;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'string', 'min:6'],
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        /** @var JWTGuard $guard */
        $guard = auth('api');

        $token = $guard->login($user);

        return $this->respondWithToken($token);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        /** @var JWTGuard $guard */
        $guard = auth('api');

        if (!$token = $guard->attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return $this->respondWithToken($token);
    }

    public function me()
    {
        /** @var JWTGuard $guard */
        $guard = auth('api');

        return response()->json($guard->user());
    }

    /** @var \PHPOpenSourceSaver\JWTAuth\JWTGuard $guard */
    public function logout()
    {
        /** @var JWTGuard $guard */
        $guard = auth('api');

        $guard->logout();

        return response()->json(['message' => 'Logged out']);
    }

    public function refresh()
    {
        /** @var JWTGuard $guard */
        $guard = auth('api');

        return $this->respondWithToken($guard->refresh());
    }

    protected function respondWithToken($token)
    {
        /** @var JWTGuard $guard */
        $guard = auth('api');

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => $guard->factory()->getTTL() * 60,
            'user'         => $guard->user(),
        ]);
    }
}
