function saveNotifications() {
  const settings = {
    workout: {
      enabled: document.getElementById("workoutReminder").checked,
      time: document.getElementById("workoutTime").value
    },
    meal: {
      enabled: document.getElementById("mealReminder").checked,
      time: document.getElementById("mealTime").value
    },
    water: {
      enabled: document.getElementById("waterReminder").checked,
      interval: document.getElementById("waterInterval").value
    },
    sleep: {
      enabled: document.getElementById("sleepReminder").checked,
      time: document.getElementById("sleepTime").value
    }
  };

  localStorage.setItem("notificationSettings", JSON.stringify(settings));
  alert("✅ Notifications Saved!");
}
Notification.requestPermission();

function triggerNotification(title, message) {
  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  }
}
triggerNotification("🏋️ Workout Time", "Time to earn XP!");
