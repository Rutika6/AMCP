import Notification from '../models/Notification.js';

// GET /notifications
export async function getNotifications(req, res) {
  const notifications = await Notification.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(notifications.map((n) => n.toJSON()));
}

// PUT /notifications/:notificationId/read
export async function markAsRead(req, res) {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.notificationId, userId: req.user._id },
    { read: true },
    { new: true }
  );
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  res.json(notification.toJSON());
}

// PUT /notifications/read-all
export async function markAllAsRead(req, res) {
  await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
  res.json({ message: 'All notifications marked as read' });
}
