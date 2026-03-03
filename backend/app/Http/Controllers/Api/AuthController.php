<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255', 'required_if:role,customer'],
            'vaph_number' => ['nullable', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'in:driver,customer'],
        ]);

        $approvalStatus = $validated['role'] === 'driver' ? 'pending' : 'approved';

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'vaph_number' => $validated['vaph_number'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'approval_status' => $approvalStatus,
        ]);

        return response()->json([
            'message' => $validated['role'] === 'driver'
                ? 'Registratie ontvangen. Je account wacht op goedkeuring door een admin.'
                : 'Registratie gelukt. Je kan meteen inloggen.',
            'user' => $user,
        ], 201);
    }

    public function registerDriver(Request $request)
    {
        $request->merge(['role' => 'driver']);

        return $this->register($request);
    }

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

        if ($user->role === 'driver' && $user->approval_status !== 'approved') {
            return response()->json([
                'message' => 'Je account is nog niet goedgekeurd door een admin.'
            ], 403);
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