import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EVENT_PUBLISHER } from 'src/core/token';
import { Notification } from './notification.entity';
import { NotificationType } from '../common/enums/notification-type.enum';

type EventPublisher = { publish: (event: string, payload: any) => void };

@Injectable()
export class NotificationsService {
    constructor(
        @Inject(EVENT_PUBLISHER)
        private readonly publisher: EventPublisher,
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
    ) { }

    notify(event: string, payload: any) {
        this.publisher.publish(event, payload);
        return { ok: true };
    }

    async createNotification(userId: string, type: NotificationType, title: string, message: string, metadata?: any): Promise<Notification> {
        let refId: string | undefined;
        let refType: string | undefined;

        if (metadata?.orderId) {
            refId = metadata.orderId;
            refType = 'order';
        }

        const notification = this.notificationRepository.create({
            userId,
            type,
            title,
            body: message,
            refId,
            refType,
        });

        const saved = await this.notificationRepository.save(notification);
        
        // Broadcast the real-time event so frontend gets it instantly if connected
        this.notify(`notification:${userId}`, saved);

        return saved;
    }

    async getUserNotifications(userId: string, limit: number = 20, offset: number = 0) {
        const [notifications, total] = await this.notificationRepository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });

        const unreadCount = await this.notificationRepository.count({
            where: { userId, isRead: false },
        });

        return {
            data: notifications,
            total,
            unreadCount,
            limit,
            offset,
        };
    }

    async markAsRead(id: string, userId: string): Promise<Notification> {
        const notification = await this.notificationRepository.findOne({ where: { id, userId } });
        if (!notification) {
            throw new NotFoundException(`Notification not found`);
        }
        
        if (!notification.isRead) {
            notification.isRead = true;
            return this.notificationRepository.save(notification);
        }
        return notification;
    }

    async markAllAsRead(userId: string): Promise<void> {
        await this.notificationRepository.update(
            { userId, isRead: false },
            { isRead: true }
        );
    }
}
