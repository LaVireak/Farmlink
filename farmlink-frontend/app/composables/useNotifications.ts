import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth.store';
export const useNotifications = () => {
    const notifications = ref([]);
    const unreadCount = ref(0);
    const isLoading = ref(false);
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const fetchNotifications = async () => {
        if (!authStore.isAuthenticated) return;
        isLoading.value = true;
        try {
            const data = await $fetch(`${config.public.apiUrl}/notifications`, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`
                }
            });
            if (data && data.data) {
                notifications.value = data.data.map(n => ({
                    id: n.id,
                    title: n.title,
                    body: n.message,
                    time: new Date(n.createdAt).toLocaleDateString() + ' ' + new Date(n.createdAt).toLocaleTimeString(),
                    read: n.isRead,
                    type: n.type,
                    metadata: n.metadata
                }));
                unreadCount.value = data.unreadCount;
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            isLoading.value = false;
        }
    };
    const markAsRead = async (id) => {
        if (!authStore.isAuthenticated) return;
        try {
            await $fetch(`${config.public.apiUrl}/notifications/${id}/read`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${authStore.token}`
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
                    Authorization: `Bearer ${authStore.token}`
                }
            });
            notifications.value.forEach(n => n.read = true);
            unreadCount.value = 0;
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };
    return {
        notifications,
        unreadCount,
        isLoading,
        fetchNotifications,
        markAsRead,
        markAllAsRead
    };
};
