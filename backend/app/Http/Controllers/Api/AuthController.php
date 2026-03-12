<?php

namespace App\Http\Controllers\Api;

use App\Filament\Resources\UserResource;
use App\Http\Controllers\Controller;
use App\Models\User;
use Filament\Notifications\Actions\Action;
use Filament\Notifications\Notification;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

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
            'email' => ['required', 'email:rfc', 'max:255', 'unique:users,email'],
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

        if ($validated['role'] !== 'driver') {
            $user->sendEmailVerificationNotification();
        }

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
                ? 'Registratie ontvangen. Je account wacht op goedkeuring door een beheerder. Na goedkeuring ontvang je een bevestigingsmail.'
                : 'Registratie gelukt. Controleer je mailbox om je e-mailadres te bevestigen voor je inlogt.',
            'user' => $user,
        ], 201);
    }

    public function registerDriver(Request $request)
    {
        $request->merge(['role' => 'driver']);

        return $this->register($request);
    }

    public function forgotPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email:rfc'],
        ]);

        $status = Password::sendResetLink([
            'email' => $validated['email'],
        ]);

        if ($status === Password::RESET_LINK_SENT || $status === Password::INVALID_USER) {
            return response()->json([
                'message' => 'Als er een account bestaat met dit e-mailadres, ontvangt u een e-mail om uw wachtwoord opnieuw in te stellen.',
            ]);
        }

        return response()->json([
            'message' => 'De resetmail kon momenteel niet verstuurd worden. Probeer het later opnieuw.',
        ], 429);
    }

    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email:rfc'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $status = Password::reset(
            $validated,
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => $password,
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'De resetlink is ongeldig of vervallen. Vraag een nieuwe resetmail aan.',
            ], 422);
        }

        return response()->json([
            'message' => 'Uw wachtwoord is opnieuw ingesteld. U kunt nu inloggen.',
        ]);
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
                'message' => 'Je account is nog niet goedgekeurd door een beheerder.'
            ], 403);
        }

        if ($user->role !== 'driver' && ! $user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Bevestig eerst je e-mailadres voor je inlogt.'
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
        $originalEmail = $user->email;

        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'email' => ['required', 'email:rfc', 'max:255', "unique:users,email,{$user->id}"],
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

        $emailChanged = $validated['email'] !== $originalEmail;

        if ($emailChanged && $user->role !== 'driver') {
            $user->forceFill([
                'email_verified_at' => null,
            ])->save();

            $user->sendEmailVerificationNotification();
        }

        return response()->json([
            'message' => $emailChanged && $user->role !== 'driver'
                ? 'Profiel succesvol bijgewerkt. Controleer je mailbox om je nieuwe e-mailadres te bevestigen.'
                : 'Profiel succesvol bijgewerkt.',
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