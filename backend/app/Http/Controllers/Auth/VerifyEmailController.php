<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{
    public function __invoke(Request $request, string $id, string $hash)
    {
        $user = User::find($id);

        if (! $user) {
            return redirect()->away($this->frontendLoginUrl('not-found'));
        }

        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return redirect()->away($this->frontendLoginUrl('invalid'));
        }

        if ($user->hasVerifiedEmail()) {
            return redirect()->away($this->frontendLoginUrl('already'));
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return redirect()->away($this->frontendLoginUrl('success'));
    }

    private function frontendLoginUrl(string $status): string
    {
        $frontendUrl = rtrim((string) config('services.frontend.url'), '/');

        return $frontendUrl . '/login?verified=' . urlencode($status);
    }
}