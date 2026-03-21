<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Ride;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request, $rideId)
    {
        $request->validate([
            'stars' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $ride = Ride::findOrFail($rideId);

        
        if ($ride->customer_id !== Auth::id()) {
            return response()->json(['message' => 'Niet toegestaan'], 403);
        }

        // Check of er al een review is
        if ($ride->review) {
            return response()->json(['message' => 'Review bestaat al'], 409);
        }

        $review = Review::create([
            'ride_id' => $ride->id,
            'customer_id' => $ride->customer_id,
            'driver_id' => $ride->driver_id,
            'stars' => $request->stars,
            'comment' => $request->comment,
        ]);

        return response()->json($review, 201);
    }

    // Haal alle reviews op voor een chauffeur
    public function forDriver($driverId)
    {
        $reviews = Review::where('driver_id', $driverId)->latest()->get();
        return response()->json($reviews);
    }
}
