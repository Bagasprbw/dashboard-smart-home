
const options = {
  username: 'ronal',
  password: 'ronaltama12345'
};

const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', options);

client.on('connect', () => {
  console.log('MQTT Connected');

  // Subscribe semua elemen yang punya data-topic-status
  document.querySelectorAll('[data-topic-status]').forEach((el) => {
    const topic = el.getAttribute('data-topic-status');
    client.subscribe(topic, (err) => {
      if (err) console.error('Failed to subscribe to', topic);
    });
  });

  // Suhu (jika ada)
  document.querySelectorAll('[data-topic-temp]').forEach((el) => {
    const topic = el.getAttribute('data-topic-temp');
    client.subscribe(topic);
  });
});

client.on('message', (topic, message) => {
  const payload = message.toString();

  // Update tombol switch status
  document.querySelectorAll('[data-topic-status]').forEach((el) => {
    if (el.getAttribute('data-topic-status') === topic) {
      el.checked = payload === '1';
    }
  });

  // Update suhu (jika ada)
  document.querySelectorAll('[data-topic-temp]').forEach((el) => {
    if (el.getAttribute('data-topic-temp') === topic) {
      el.textContent = `${payload}°C`;
    }
  });
});

// Saat user mengganti switch
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-topic]').forEach((el) => {
    el.addEventListener('change', () => {
      const topicSet = el.getAttribute('data-topic');
      const topicStatus = el.getAttribute('data-topic-status');
      const value = el.checked ? '1' : '0';

      // Publish ke topic /set
      client.publish(topicSet, value, { retain: true });

      // Publish juga ke /status (optional jika perangkat tidak feedback otomatis)
      if (topicStatus) {
        client.publish(topicStatus, value, { retain: true });
      }
    });
  });
});

client.on('error', (err) => {
  console.error('MQTT error:', err);
});
