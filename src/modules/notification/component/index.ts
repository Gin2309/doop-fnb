export const groupNotificationsByDate = (notifications: any) => {
  const groups = notifications.reduce((acc, item) => {
    const dateObj = new Date(item.createdAt);
    const date = dateObj.toLocaleDateString();

    let displayDate = date;
    if (dateObj.toDateString() === new Date().toDateString()) {
      displayDate = "Hôm nay";
    } else if (
      dateObj.toDateString() === new Date(Date.now() - 864e5).toDateString()
    ) {
      displayDate = "Hôm qua";
    }

    if (!acc[displayDate]) {
      acc[displayDate] = [];
    }
    acc[displayDate].push(item);
    return acc;
  }, {});

  return groups;
};
