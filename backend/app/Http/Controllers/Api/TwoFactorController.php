<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use PragmaRX\Google2FA\Google2FA;
use Illuminate\Support\Facades\Crypt;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Writer;
use App\Models\User;

class TwoFactorController extends Controller
{
    
    public function setup(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();
        $user->google2fa_secret = Crypt::encrypt($secret);
        $user->save();

        $qrData = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        
        $renderer = new ImageRenderer(
            new RendererStyle(200),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        try {
            $qrSvg = $writer->writeString($qrData);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Fout bij genereren QR-code', 'error' => $e->getMessage()], 500);
        }
        return response()->json([
            'secret' => $secret,
            'qr_svg' => $qrSvg,
        ]);
    }

   
    public function enable(Request $request)
    {
        /** @var \App\Models\User 
        $user = Auth::user();
        $validator = Validator::make($request->all(), [
            'code' => 'required|digits:6',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => 'Ongeldige code'], 422);
        }
        try {
            $google2fa = new Google2FA();
            $secret = Crypt::decrypt($user->google2fa_secret);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Fout bij decryptie van secret', 'error' => $e->getMessage()], 500);
        }
        if (!$google2fa->verifyKey($secret, $request->input('code'))) {
            return response()->json(['message' => 'Code klopt niet'], 422);
        }
        $user->two_factor_enabled = true;
        $user->save();
        return response()->json(['message' => '2FA geactiveerd']);
    }

    // 3. Verifieer 2FA-code bij login
    public function verify(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $validator = Validator::make($request->all(), [
            'code' => 'required|digits:6',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => 'Ongeldige code'], 422);
        }
        try {
            $google2fa = new Google2FA();
            $secret = Crypt::decrypt($user->google2fa_secret);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Fout bij decryptie van secret', 'error' => $e->getMessage()], 500);
        }
        if (!$google2fa->verifyKey($secret, $request->input('code'))) {
            return response()->json(['message' => 'Code klopt niet'], 422);
        }
       
        session(['2fa_passed' => true]);
        return response()->json(['message' => '2FA correct']);
    }

   
    public function disable(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->google2fa_secret = null;
        $user->two_factor_enabled = false;
        $user->save();
        return response()->json(['message' => '2FA uitgeschakeld']);
    }
}
