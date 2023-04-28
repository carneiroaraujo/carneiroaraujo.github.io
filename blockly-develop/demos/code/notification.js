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
