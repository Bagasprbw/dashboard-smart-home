const options = {
  username: 'ronal',
  password: 'ronaltama12345'
};

const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', options);

client.on('connect', () => {
  console.log('MQTT Connected');

  // Subscribe semua elemen dengan data-topic-status
  document.querySelectorAll('[data-topic-status]').forEach((el) => {
    const statusTopic = el.getAttribute('data-topic-status');
    client.subscribe(statusTopic, (err) => {
      if (err) {
        console.error(`Failed to subscribe to ${statusTopic}`, err);
      }
    });
  });

  // Subscribe khusus untuk status deteksi asap
  client.subscribe('kitchen/smoke/status', (err) => {
    if (err) {
      console.error('Failed to subscribe to kitchen/smoke/status', err);
    }
  });
});

client.on('message', (topic, message) => {
  const payload = message.toString();

  // Update elemen switch dari topic STATUS
  document.querySelectorAll('[data-topic-status]').forEach((el) => {
    if (el.getAttribute('data-topic-status') === topic) {
      el.checked = payload === "1";
    }
  });

  // Update deteksi asap
  if (topic === 'kitchen/smoke/status') {
    const statusEl = document.querySelector(".smoke-status");
    if (!statusEl) return;

    if (payload === "1") {
      statusEl.textContent = "Smoke Detected!";
      statusEl.classList.add("smoke-alert");

      if (Notification.permission === "granted") {
        new Notification("⚠️ Smoke Detected!", {
          body: "Asap terdeteksi di dapur. Periksa segera.",
          icon: "assets/smoke-icon.png"
        });
      }
    } else {
      statusEl.textContent = "No Smoke";
      statusEl.classList.remove("smoke-alert");
    }
  }
});

client.on('error', (err) => {
  console.error('MQTT Connection Error:', err);
});

window.addEventListener('DOMContentLoaded', () => {
  // Minta izin notifikasi saat load
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  // Publish ketika elemen data-topic berubah
  document.querySelectorAll('[data-topic]').forEach((el) => {
    el.addEventListener('change', () => {
      const topic = el.getAttribute('data-topic');
      const value = el.checked ? "1" : "0";
      client.publish(topic, value);
    });
  });
});
