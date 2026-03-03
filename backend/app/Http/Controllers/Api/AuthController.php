<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // 🔐 LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Ongeldige login gegevens.'
            ], 401);
        }

        // Oude tokens verwijderen (optioneel maar proper)
        $user->tokens()->delete();

        // Nieuw token maken
        $token = $user->createToken('react-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    // 👤 ME (wie is ingelogd)
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // 🚪 LOGOUT
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Succesvol uitgelogd.'
        ]);
    }
}