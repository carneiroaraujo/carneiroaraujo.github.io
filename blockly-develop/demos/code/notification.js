let notifications = [];
function createNotification(message) {
  let id = notifications.length + 1;
  let notification = document.createElement("div");
  notification.classList.add("toast");
  notification.setAttribute("id", "toast" + id);
  let body = document.createElement("div");
  body.classList.add("toast-body");
  body.innerText = message;
  notification.appendChild(body);
  let container = document.getElementById("notification-container");
  container.appendChild(notification);
  notification.classList.add("visible");
  setTimeout(() => {
    notification.classList.remove("visible");
    setTimeout(() => {
      container.removeChild(notification);
      notifications.splice(notifications.indexOf(notification), 1);
    }, 500);
  }, 5000);
  notifications.push(notification);
}
function addNotification(message) {
    const notificationContainer = document.getElementById("notification-container");
    const notification = document.createElement("div");
    notification.classList.add("toast");
    const id = Date.now();
    notification.setAttribute("id", "toast" + id);
    const body = document.createElement("div");
    body.classList.add("toast-body");
    body.innerText = message;
    notification.appendChild(body);
    notificationContainer.appendChild(notification);
    notification.classList.add("visible");
    
    // Remove the notification after 5 seconds
    setTimeout(() => {
      notification.classList.remove("visible");
      setTimeout(() => {
        notificationContainer.removeChild(notification);
      }, 500);
    }, 5000);
  }
  