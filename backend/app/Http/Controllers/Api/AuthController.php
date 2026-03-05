<?php

namespace App\Http\Controllers\Api;

use App\Filament\Resources\UserResource;
use App\Http\Controllers\Controller;
use App\Models\User;
use Filament\Notifications\Actions\Action;
use Filament\Notifications\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function emailExists(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $exists = User::query()
            ->where('email', $validated['email'])
            ->exists();

        return response()->json([
            'exists' => $exists,
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'email' => ['required', 'email:rfc,dns', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:20', 'regex:/^[+0-9()\-\s]{8,20}$/'],
            'address' => ['nullable', 'string', 'max:255', 'required_if:role,customer'],
            'vaph_number' => ['nullable', 'string', 'max:50'],
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

        if ($validated['role'] === 'driver') {
            $admins = User::query()
                ->where('role', 'admin')
                ->get();

            if ($admins->isNotEmpty()) {
                Notification::make()
                    ->title('Nieuwe chauffeur wacht op goedkeuring')
                    ->body("{$user->name} ({$user->email}) heeft een account aangemaakt.")
                    ->actions([
                        Action::make('review-driver')
                            ->label('Bekijk chauffeur')
                            ->url(UserResource::getUrl('edit', ['record' => $user]))
                            ->markAsRead(),
                    ])
                    ->sendToDatabase($admins);
            }
        }

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

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'email' => ['required', 'email:rfc,dns', 'max:255', "unique:users,email,{$user->id}"],
            'phone' => ['nullable', 'string', 'max:20', 'regex:/^[+0-9()\-\s]{8,20}$/'],
            'address' => ['nullable', 'string', 'max:255'],
            'vaph_number' => ['nullable', 'string', 'max:50'],
            'email_notifications_enabled' => ['nullable', 'boolean'],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'vaph_number' => $validated['vaph_number'] ?? null,
            'email_notifications_enabled' => $validated['email_notifications_enabled'] ?? $user->email_notifications_enabled,
        ]);

        return response()->json([
            'message' => 'Profiel succesvol bijgewerkt.',
            'user' => $user->fresh(),
        ]);
    }

    public function updateNotificationPreferences(Request $request)
    {
        $validated = $request->validate([
            'email_notifications_enabled' => ['required', 'boolean'],
        ]);

        $user = $request->user();
        $user->update([
            'email_notifications_enabled' => $validated['email_notifications_enabled'],
        ]);

        return response()->json([
            'message' => 'Meldingsvoorkeur succesvol bijgewerkt.',
            'user' => $user->fresh(),
        ]);
    }

    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();
        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'message' => 'Je account is verwijderd.',
        ]);
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