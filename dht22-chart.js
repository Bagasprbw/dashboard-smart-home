// dht22-chart.js

// Ambil elemen HTML yang menyimpan topik
const container = document.getElementById('dhtChartContainer');
const topicTemp = container.dataset.topicTemp;
const topicHum = container.dataset.topicHum;

const tempData = [];
const humData = [];
const timeLabels = [];

const ctx = document.getElementById('dhtChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: timeLabels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: tempData,
        borderColor: '#b02a37',
        backgroundColor: 'rgba(176, 42, 55, 0.1)',
        yAxisID: 'y',
        tension: 0.4
      },
      {
        label: 'Humidity (%)',
        data: humData,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        yAxisID: 'y1',
        tension: 0.4
      }
    ]
  },
  options: {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    stacked: false,
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Temperature (°C)'
        }
      },
      y1: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Humidity (%)'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  }
});

// MQTT logic
client.subscribe(topicTemp);
client.subscribe(topicHum);

client.on('message', (topic, message) => {
  const value = parseFloat(message.toString());
  const timestamp = new Date().toLocaleTimeString();

  if (topic === topicTemp) {
    if (tempData.length > 20) {
      tempData.shift();
      timeLabels.shift();
    }
    tempData.push(value);
    timeLabels.push(timestamp);
  }

  if (topic === topicHum) {
    if (humData.length > 20) {
      humData.shift();
    }
    humData.push(value);
  }

  chart.update();
});
