import { vi } from 'vitest';

export const isNotificationAPISupported = vi.fn();
export const requestNotificationPermission = vi.fn();
export const sendNotification = vi.fn();
export const shouldPromptNotificationPermission = vi.fn();
