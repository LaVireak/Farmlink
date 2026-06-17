import { ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { supabase } from '../services/auth.service';

// ── Module-level singletons ───────────────────────────────────────────────────
// These refs are created ONCE for the entire app lifetime. Every call to
// useNotifications() returns references to the same objects, so Realtime updates
// received on any page are immediately visible everywhere (header badge, etc.).
const notifications = ref<any[]>([]);
const unreadCount = ref(0);
const isLoading = ref(false);
let realtimeChannel: any = null;
// ─────────────────────────────────────────────────────────────────────────────

export const useNotifications = () => {
    const authStore = useAuthStore();
    const config = useRuntimeConfig();

    const initRealtime = () => {
        if (!authStore.isAuthenticated || realtimeChannel) return;

        const currentUserId = authStore.user?.id;
        if (!currentUserId) return;

        realtimeChannel = supabase.channel(`notifications_realtime_${currentUserId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${currentUserId}`
                },
                (payload) => {
                    try {
                        const data = payload.new;
                        if (data && data.id) {
                            const newNotification = {
                                id: data.id,
                                title: data.title,
                                body: data.body,
                                time: new Date(data.created_at).toLocaleDateString() + ' ' + new Date(data.created_at).toLocaleTimeString(),
                                read: data.is_read,
                                type: data.type,
                                refId: data.ref_id,
                                refType: data.ref_type
                            };

                            // Avoid duplicates
                            if (!notifications.value.find(n => n.id === newNotification.id)) {
                                notifications.value.unshift(newNotification);
                                unreadCount.value++;
                            }
                        }
                    } catch (err) {
                        console.error('Failed to parse realtime message:', err);
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${currentUserId}`
                },
                (payload) => {
                    try {
                        const data = payload.new;
                        if (data && data.id) {
                            const note = notifications.value.find(n => n.id === data.id);
                            if (note) {
                                const wasRead = note.read;
                                note.read = data.is_read;
                                if (!wasRead && data.is_read) {
                                    unreadCount.value = Math.max(0, unreadCount.value - 1);
                                } else if (wasRead && !data.is_read) {
                                    unreadCount.value++;
                                }
                            }
                        }
                    } catch (err) {
                        console.error('Failed to parse realtime update:', err);
                    }
                }
            )
            .subscribe();
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

                // Start Realtime stream if not already open
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
        if (realtimeChannel) {
            supabase.removeChannel(realtimeChannel);
            realtimeChannel = null;
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
