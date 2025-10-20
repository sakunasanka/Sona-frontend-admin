// Notification types
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  MESSAGE = 'message'
}

// Notification interface matching backend response
export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    total: number;
    unreadCount: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unreadCount: number;
  };
}

export interface NotificationAPIResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}

import API from './api';

class NotificationAPI {
  /**
   * Get all user notifications
   */
  async getUserNotifications(): Promise<NotificationsResponse> {
    const response = await API.get<NotificationsResponse>('/notifications');
    return response.data;
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<UnreadCountResponse> {
    const response = await API.get<UnreadCountResponse>('/notifications/unread-count');
    return response.data;
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: number): Promise<NotificationAPIResponse> {
    const response = await API.put<NotificationAPIResponse>(
      `/notifications/${notificationId}/read`,
      {}
    );
    return response.data;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<NotificationAPIResponse> {
    const response = await API.put<NotificationAPIResponse>(
      '/notifications/mark-all-read',
      {}
    );
    return response.data;
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: number): Promise<NotificationAPIResponse> {
    const response = await API.delete<NotificationAPIResponse>(
      `/notifications/${notificationId}`
    );
    return response.data;
  }

  /**
   * Send a notification (admin only)
   */
  async sendNotification(payload: {
    userId: number;
    type: NotificationType;
    title: string;
    message: string;
    relatedURL?: string;
  }): Promise<NotificationAPIResponse> {
    const response = await API.post<NotificationAPIResponse>(
      '/notifications/send',
      payload
    );
    return response.data;
  }
}

export const notificationAPI = new NotificationAPI();
export default notificationAPI;