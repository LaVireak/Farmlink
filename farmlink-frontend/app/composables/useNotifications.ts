import { ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';

// ── Module-level singletons ───────────────────────────────────────────────────
// These refs are created ONCE for the entire app lifetime. Every call to
// useNotifications() returns references to the same objects, so SSE updates
// received on any page are immediately visible everywhere (header badge, etc.).
const notifications = ref<any[]>([]);
const unreadCount = ref(0);
const isLoading = ref(false);
let eventSource: EventSource | null = null;
// ─────────────────────────────────────────────────────────────────────────────

export const useNotifications = () => {
    const authStore = useAuthStore();
    const config = useRuntimeConfig();

    const initRealtime = () => {
        if (!authStore.isAuthenticated || eventSource) return;

        const token = authStore.accessToken;
        const url = `${config.public.apiUrl}/notifications/stream?token=${token}`;

        eventSource = new EventSource(url);

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data && data.id) {
                    const newNotification = {
                        id: data.id,
                        title: data.title,
                        body: data.body,
                        time: new Date(data.createdAt).toLocaleDateString() + ' ' + new Date(data.createdAt).toLocaleTimeString(),
                        read: data.isRead,
                        type: data.type,
                        refId: data.refId,
                        refType: data.refType
                    };

                    // Avoid duplicates
                    if (!notifications.value.find(n => n.id === newNotification.id)) {
                        notifications.value.unshift(newNotification);
                        unreadCount.value++;
                    }
                }
            } catch (err) {
                console.error('Failed to parse SSE message:', err);
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            eventSource?.close();
            eventSource = null;
            // Auto-reconnect after 5 seconds
            setTimeout(() => initRealtime(), 5000);
        };
    };

    const fetchNotifications = async () => {
        if (!authStore.isAuthenticated) return;
        isLoading.value = true;
        try {
            const data = await $fetch<any>(`${config.public.apiUrl}/notifications`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`
                }
            });
            if (data && data.data) {
                notifications.value = data.data.map((n: any) => ({
                    id: n.id,
                    title: n.title,
                    body: n.body,
                    time: new Date(n.createdAt).toLocaleDateString() + ' ' + new Date(n.createdAt).toLocaleTimeString(),
                    read: n.isRead,
                    type: n.type,
                    refId: n.refId,
                    refType: n.refType
                }));
                unreadCount.value = data.unreadCount;

                // Start SSE stream if not already open
                initRealtime();
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const markAsRead = async (id: string) => {
        if (!authStore.isAuthenticated) return;
        try {
            await $fetch(`${config.public.apiUrl}/notifications/${id}/read`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`
                }
            });
            const note = notifications.value.find(n => n.id === id);
            if (note && !note.read) {
                note.read = true;
                unreadCount.value = Math.max(0, unreadCount.value - 1);
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!authStore.isAuthenticated) return;
        try {
            await $fetch(`${config.public.apiUrl}/notifications/read-all`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`
                }
            });
            notifications.value.forEach(n => n.read = true);
            unreadCount.value = 0;
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const closeRealtime = () => {
        if (eventSource) {
            eventSource.close();
            eventSource = null;
        }
    };

    return {
        notifications,
        unreadCount,
        isLoading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        initRealtime,
        closeRealtime
    };
};
