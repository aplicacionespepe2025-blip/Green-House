export interface InventoryNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  plantId?: string;
  type: 'restock' | 'new_plant' | 'low_stock' | 'system';
  read: boolean;
}

// Pleasant gentle chime synthesizer using Web Audio API
function playChimeSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Gentle cheerful ascending arpeggio notes (F5 -> A5 -> C6)
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(698.46, now);
    osc.frequency.setValueAtTime(880.00, now + 0.12);
    osc.frequency.setValueAtTime(1046.50, now + 0.24);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.65);
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Este navegador no soporta Notificaciones Web.');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.error('Error solicitando permisos de notificación:', e);
    return 'denied';
  }
}

export function getNotificationPermissionStatus(): NotificationPermission {
  if (!('Notification' in window)) return 'denied';
  return Notification.permission;
}

export function dispatchInventoryNotification(
  title: string,
  body: string,
  options?: { plantId?: string; type?: InventoryNotification['type'] }
): InventoryNotification {
  const notificationItem: InventoryNotification = {
    id: 'notif-' + Date.now().toString(36),
    title,
    body,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    plantId: options?.plantId,
    type: options?.type || 'restock',
    read: false,
  };

  // Play sound
  playChimeSound();

  // Try browser push notification if permitted
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=128&q=80',
        badge: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=128&q=80',
      });
    } catch (e) {
      console.warn('Push notification delivery handled in-app:', e);
    }
  }

  return notificationItem;
}
