    public function update(Request $request, Ride $ride, RideAssignmentService $assignmentService)
    {
        if ($ride->customer_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'service_type' => ['required', 'in:airport,wheelchair,medical,assistance'],
            'pickup_street' => ['required', 'string', 'max:255'],
            'pickup_number' => ['nullable', 'string', 'max:255'],
            'pickup_postcode' => ['required', 'string', 'size:4', 'regex:/^[0-9]{4}$/'],
            'pickup_city' => ['required', 'string', 'max:255'],
            'dropoff_street' => ['required', 'string', 'max:255'],
            'dropoff_number' => ['nullable', 'string', 'max:255'],
            'dropoff_postcode' => ['required', 'string', 'size:4', 'regex:/^[0-9]{4}$/'],
            'dropoff_city' => ['required', 'string', 'max:255'],
            'pickup_datetime' => ['required', 'date', 'after_or_equal:now'],
            'has_return_trip' => ['required', 'boolean'],
            'return_datetime' => ['nullable', 'date', 'required_if:has_return_trip,1', 'after:pickup_datetime'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'assistance_type' => ['nullable', 'in:luchthaven,ziekenhuis'],
        ]);

        $price = $this->calculatePrice(
            serviceType: $data['service_type'],
            assistanceType: $data['assistance_type'] ?? null,
        );

        $ride->update([
            'service_type' => $data['service_type'],
            'pickup_street' => $data['pickup_street'],
            'pickup_number' => $data['pickup_number'] ?? null,
            'pickup_postcode' => $data['pickup_postcode'],
            'pickup_city' => $data['pickup_city'],
            'dropoff_street' => $data['dropoff_street'],
            'dropoff_number' => $data['dropoff_number'] ?? null,
            'dropoff_postcode' => $data['dropoff_postcode'],
            'dropoff_city' => $data['dropoff_city'],
            'pickup_datetime' => $data['pickup_datetime'],
            'return_datetime' => $data['return_datetime'] ?? null,
            'notes' => $data['notes'] ?? null,
            'distance_km' => null,
            'total_price' => $price,
            'status' => 'pending', // reset status
            'driver_id' => null, // reset driver assignment
            'vehicle_id' => null,
        ]);

        $assignedDriver = $assignmentService->assignAutomatically($ride->fresh());
        $ride = $ride->fresh();

        // Notificatie naar admins en klant zoals in store()
        $admins = User::query()
            ->where('role', 'admin')
            ->get();

        if ($admins->isNotEmpty()) {
            Notification::make()
                ->title('Rit gewijzigd door klant')
                ->body($assignedDriver
                    ? "Rit (#{$ride->id}) werd gewijzigd door de klant. Deze werd opnieuw toegewezen aan {$assignedDriver->name} en wacht op bevestiging."
                    : "Rit (#{$ride->id}) werd gewijzigd door de klant. Er is nog geen chauffeur toegewezen.")
                ->icon('heroicon-o-pencil-square')
                ->actions([
                    Action::make('view_ride')
                        ->label('Bekijk rit')
                        ->url(RideResource::getUrl('edit', ['record' => $ride->id]))
                        ->button(),
                ])
                ->sendToDatabase($admins);
        }

        if ($assignedDriver) {
            Notification::make()
                ->title('Chauffeur opnieuw toegewezen')
                ->body("Voor je rit (#{$ride->id}) werd chauffeur {$assignedDriver->name} opnieuw toegewezen. De rit is pas bevestigd zodra de chauffeur dit accepteert.")
                ->icon('heroicon-o-check-circle')
                ->sendToDatabase([$request->user()]);
        }

        return response()->json([
            'message' => $assignedDriver
                ? "Rit gewijzigd. Chauffeur {$assignedDriver->name} werd opnieuw toegewezen en moet de rit nog bevestigen."
                : 'Rit gewijzigd. Er is momenteel geen vrije chauffeur. Een beheerder wijst deze later toe.',
            'ride' => $ride,
        ]);
    }

    public function destroy(Request $request, Ride $ride)
    {
        if ($ride->customer_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $ride->delete();
        return response()->json(['message' => 'Rit geannuleerd.']);
    }
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Filament\Resources\RideResource;
use App\Models\Ride;
use App\Models\User;
use App\Services\RideAssignmentService;
use Carbon\Carbon;
use Filament\Notifications\Actions\Action;
use Filament\Notifications\Notification;
use Illuminate\Http\Request;

class CustomerRideController extends Controller
{
    public function availableDrivers(Request $request, RideAssignmentService $assignmentService)
    {
        $data = $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
        ]);

        $pickupAt = Carbon::parse("{$data['date']} {$data['start_time']}");
        $returnAt = Carbon::parse("{$data['date']} {$data['end_time']}");

        $drivers = $assignmentService->getAvailableDrivers($pickupAt, $returnAt);
        // Toon geen persoonsgegevens aan klant, enkel beschikbaarheid
        $result = $drivers->map(fn ($driver) => [
            'id' => $driver->id,
            'available' => true,
        ]);
        return response()->json([
            'drivers' => $result->values(),
        ]);
    }

    public function index(Request $request)
    {
        return Ride::query()
            ->where('customer_id', $request->user()->id)
            ->orderByDesc('pickup_datetime')
            ->get();
    }

    public function store(Request $request, RideAssignmentService $assignmentService)
    {
        $data = $request->validate([
            'service_type' => ['required', 'in:airport,wheelchair,medical,assistance'],
            'pickup_street' => ['required', 'string', 'max:255'],
            'pickup_number' => ['nullable', 'string', 'max:255'],
            'pickup_postcode' => ['required', 'string', 'size:4', 'regex:/^[0-9]{4}$/'],
            'pickup_city' => ['required', 'string', 'max:255'],
            'dropoff_street' => ['required', 'string', 'max:255'],
            'dropoff_number' => ['nullable', 'string', 'max:255'],
            'dropoff_postcode' => ['required', 'string', 'size:4', 'regex:/^[0-9]{4}$/'],
            'dropoff_city' => ['required', 'string', 'max:255'],
            'pickup_datetime' => ['required', 'date', 'after_or_equal:now'],
            'has_return_trip' => ['required', 'boolean'],
            'return_datetime' => ['nullable', 'date', 'required_if:has_return_trip,1', 'after:pickup_datetime'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'assistance_type' => ['nullable', 'in:luchthaven,ziekenhuis'],
        ]);

        $price = $this->calculatePrice(
            serviceType: $data['service_type'],
            assistanceType: $data['assistance_type'] ?? null,
        );

        $pickupAt = Carbon::parse($data['pickup_datetime']);

        $ride = Ride::create([
            'customer_id' => $request->user()->id,
            'driver_id' => null,
            'vehicle_id' => null,
            'service_type' => $data['service_type'],
            'pickup_street' => $data['pickup_street'],
            'pickup_number' => $data['pickup_number'] ?? null,
            'pickup_postcode' => $data['pickup_postcode'],
            'pickup_city' => $data['pickup_city'],
            'dropoff_street' => $data['dropoff_street'],
            'dropoff_number' => $data['dropoff_number'] ?? null,
            'dropoff_postcode' => $data['dropoff_postcode'],
            'dropoff_city' => $data['dropoff_city'],
            'pickup_datetime' => $data['pickup_datetime'],
            'return_datetime' => $data['return_datetime'] ?? null,
            'notes' => $data['notes'] ?? null,
            'distance_km' => null,
            'total_price' => $price,
            'status' => 'pending',
        ]);

        $assignedDriver = $assignmentService->assignAutomatically($ride->fresh());
        $ride = $ride->fresh();

        $admins = User::query()
            ->where('role', 'admin')
            ->get();

        if ($admins->isNotEmpty()) {
            Notification::make()
                ->title('Nieuwe ritaanvraag')
                ->body($assignedDriver
                    ? "Er is een nieuwe rit (#{$ride->id}) aangemaakt door {$request->user()->name}. Deze werd automatisch toegewezen aan {$assignedDriver->name} en wacht nog op bevestiging door de chauffeur."
                    : "Er is een nieuwe rit (#{$ride->id}) aangemaakt door {$request->user()->name}.")
                ->icon('heroicon-o-bell-alert')
                ->actions([
                    Action::make('view_ride')
                        ->label('Bekijk rit')
                        ->url(RideResource::getUrl('edit', ['record' => $ride->id]))
                        ->button(),
                ])
                ->sendToDatabase($admins);
        }

        if ($assignedDriver) {
            Notification::make()
                ->title('Chauffeur automatisch toegewezen')
                ->body("Voor je rit (#{$ride->id}) werd chauffeur {$assignedDriver->name} automatisch toegewezen. De rit is pas bevestigd zodra de chauffeur dit zelf accepteert.")
                ->icon('heroicon-o-check-circle')
                ->sendToDatabase([$request->user()]);
        }

        return response()->json([
            'message' => $assignedDriver
                ? "Rit aangevraagd. Chauffeur {$assignedDriver->name} werd automatisch toegewezen en moet de rit nog bevestigen."
                : 'Rit aangevraagd. Er is momenteel geen vrije chauffeur. Een beheerder wijst deze later toe.',
            'ride' => $ride,
        ], 201);
    }

    private function calculatePrice(string $serviceType, ?string $assistanceType): float
    {
        $basePrice = match ($serviceType) {
            'airport' => 55,
            'wheelchair' => 60,
            'medical' => 50,
            'assistance' => 65,
            default => 50,
        };

        $assistanceExtra = match ($assistanceType) {
            'luchthaven' => 15,
            'ziekenhuis' => 10,
            default => 0,
        };

        return (float) ($basePrice + $assistanceExtra);
    }
}
