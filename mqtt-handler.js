// mqtt-handler.js

const options = {
  username: 'ronal',
  password: 'ronaltama12345'
};

const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', options);

client.on('connect', () => {
  console.log('MQTT Connected');

  // Subscribe ke semua topic dari elemen yang memiliki data-topic
  document.querySelectorAll('[data-topic]').forEach((el) => {
    const topic = el.getAttribute('data-topic');
    client.subscribe(topic, (err) => {
      if (err) {
        console.error(`Failed to subscribe to ${topic}`, err);
      }
    });
  });
});

client.on('message', (topic, message) => {
  const payload = message.toString();
  const elements = document.querySelectorAll(`[data-topic="${topic}"]`);
  elements.forEach((el) => {
    el.checked = payload === "1";
  });
});

client.on('error', (err) => {
  console.error('MQTT Connection Error:', err);
});

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-topic]').forEach((el) => {
    el.addEventListener('change', () => {
      const topic = el.getAttribute('data-topic');
      const value = el.checked ? "1" : "0";
      client.publish(topic, value);
    });
  });
});
