<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $notifications = $user->notifications()
            ->latest()
            ->limit(20)
            ->get()
            ->map(function (DatabaseNotification $notification) {
                $firstAction = $notification->data['actions'][0] ?? null;

                return [
                    'id' => $notification->id,
                    'title' => $notification->data['title'] ?? 'Melding',
                    'body' => $notification->data['body'] ?? null,
                    'url' => is_array($firstAction) ? ($firstAction['url'] ?? null) : null,
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at,
                ];
            })
            ->values();

        return response()->json([
            'items' => $notifications,
            'unread_count' => $user->unreadNotifications()->count(),
        ]);
    }

    public function markAsRead(Request $request, DatabaseNotification $notification)
    {
        if ((int) $notification->notifiable_id !== (int) $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $notification->markAsRead();

        return response()->json(['ok' => true]);
    }
}
