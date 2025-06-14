import type { NotificationInstance } from 'antd/es/notification/interface';

let notifier: NotificationInstance | null = null;

export function setNotifier(n: NotificationInstance) {
    notifier = n;
}

export function getNotifier(): NotificationInstance {
    if (!notifier) throw new Error('notifier not set. Did you forget to call setNotifier()?');
    return notifier;
}
