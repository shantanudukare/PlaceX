import Notification from "../models/Notification.model.js";

export const createNotification = async ({
  recipient,
  title,
  message,
  type = "GENERAL",
  relatedJob = null,
  relatedApplication = null,
}) => {
  return await Notification.create({
    recipient,
    title,
    message,
    type,
    relatedJob,
    relatedApplication,
  });
};

export const createBulkNotifications = async (notifications = []) => {
  if (!notifications.length) return [];
  return await Notification.insertMany(notifications);
};