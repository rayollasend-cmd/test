/**
 * Notification Service
 * Handles push notifications with Firebase Cloud Messaging and Notifee
 */

import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

class NotificationService {
  /**
   * Initialize notifications
   */
  async initialize(): Promise<void> {
    try {
      // Create default channel for Android
      await notifee.createChannel({
        id: 'default',
        name: 'Default',
        importance: 4, // High importance
        sound: 'default',
        vibration: true,
        badge: true,
      });

      // Create high priority channel for transactions
      await notifee.createChannel({
        id: 'transactions',
        name: 'Transactions',
        importance: 5, // Max importance
        sound: 'default',
        vibration: true,
        badge: true,
      });
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  /**
   * Request notification permissions
   */
  async requestPermission(): Promise<boolean> {
    try {
      const authStatus = await messaging().requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Get FCM token
   */
  async getFCMToken(): Promise<string> {
    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      throw error;
    }
  }

  /**
   * Listen to foreground messages
   */
  onMessageReceived(
    callback: (message: any) => void
  ): () => void {
    return messaging().onMessage(async (remoteMessage) => {
      console.log('Message received in foreground:', remoteMessage);
      callback(remoteMessage);

      // Display notification using Notifee
      await this.displayNotification(remoteMessage);
    });
  }

  /**
   * Display notification on screen
   */
  private async displayNotification(remoteMessage: any): Promise<void> {
    try {
      const channelId = remoteMessage.data?.channelId || 'default';

      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        data: remoteMessage.data,
        android: {
          channelId,
          smallIcon: 'icon_0',
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      });
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  }

  /**
   * Handle notification press
   */
  onNotificationPressed(
    callback: (message: any) => void
  ): () => void {
    return notifee.onForegroundEvent(({ type, detail }) => {
      if (type === 1) { // PRESS event
        callback(detail.notification?.data);
      }
    });
  }

  /**
   * Listen to background messages
   */
  onBackgroundMessage(
    callback: (message: any) => void
  ): void {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message received in background:', remoteMessage);
      callback(remoteMessage);
    });
  }

  /**
   * Unsubscribe from a topic
   */
  async subscribeToTopic(topic: string): Promise<void> {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error('Error subscribing to topic:', error);
    }
  }

  /**
   * Unsubscribe from a topic
   */
  async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
    }
  }

  /**
   * Send local notification
   */
  async sendLocalNotification(
    title: string,
    body: string,
    data?: Record<string, string>
  ): Promise<void> {
    try {
      await notifee.displayNotification({
        title,
        body,
        data,
        android: {
          channelId: 'default',
          smallIcon: 'icon_0',
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
