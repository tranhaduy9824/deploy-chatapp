/* eslint-disable @typescript-eslint/no-explicit-any */
export const unReadNotificationsFunc = (notifications: any) => {
  return notifications?.filter((n: any) => n.isRead === false);
};
