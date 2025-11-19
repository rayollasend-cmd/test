/**
 * Analytics Service
 * Handles Firebase Analytics tracking
 */

import analytics from '@react-native-firebase/analytics';

class AnalyticsService {
  /**
   * Initialize analytics
   */
  async initialize(): Promise<void> {
    try {
      await analytics().setAnalyticsCollectionEnabled(true);
      console.log('Analytics initialized');
    } catch (error) {
      console.error('Error initializing analytics:', error);
    }
  }

  /**
   * Log custom event
   */
  async logEvent(
    eventName: string,
    parameters?: Record<string, any>
  ): Promise<void> {
    try {
      await analytics().logEvent(eventName, parameters);
    } catch (error) {
      console.error('Error logging event:', error);
    }
  }

  /**
   * Log user sign up
   */
  async logSignUp(method: string): Promise<void> {
    try {
      await analytics().logSignUp({ method });
    } catch (error) {
      console.error('Error logging sign up:', error);
    }
  }

  /**
   * Log user login
   */
  async logLogin(method: string): Promise<void> {
    try {
      await analytics().logLogin({ method });
    } catch (error) {
      console.error('Error logging login:', error);
    }
  }

  /**
   * Log purchase (transaction)
   */
  async logPurchase(
    transactionId: string,
    amount: number,
    currency: string,
    itemName: string
  ): Promise<void> {
    try {
      await analytics().logPurchase({
        transaction_id: transactionId,
        value: amount,
        currency,
        items: [
          {
            item_name: itemName,
            quantity: 1,
            price: amount,
          },
        ],
      });
    } catch (error) {
      console.error('Error logging purchase:', error);
    }
  }

  /**
   * Log screen view
   */
  async logScreenView(screenName: string): Promise<void> {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenName,
      });
    } catch (error) {
      console.error('Error logging screen view:', error);
    }
  }

  /**
   * Set user properties
   */
  async setUserProperty(
    property: string,
    value: string | number | boolean
  ): Promise<void> {
    try {
      await analytics().setUserProperty(property, String(value));
    } catch (error) {
      console.error('Error setting user property:', error);
    }
  }

  /**
   * Set user ID
   */
  async setUserId(userId: string): Promise<void> {
    try {
      await analytics().setUserId(userId);
    } catch (error) {
      console.error('Error setting user ID:', error);
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
