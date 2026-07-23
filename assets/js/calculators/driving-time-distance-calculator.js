(function() {
  var chartInstance = null;

  function getInputs() {
    return {
      distance: parseFloat(document.getElementById('input_distance').value) || 450,
      avg_speed: parseFloat(document.getElementById('input_avg_speed').value) || 65,
      rest_interval: parseFloat(document.getElementById('input_rest_interval').value) || 2.5,
      rest_duration: parseFloat(document.getElementById('input_rest_duration').value) || 20,
      start_hour: parseInt(document.getElementById('input_start_hour').value) || 8,
      start_minute: parseInt(document.getElementById('input_start_minute').value) || 0
    };
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function formatHoursMins(totalHours) {
    var hrs = Math.floor(totalHours);
    var mins = Math.round((totalHours - hrs) * 60);
    if (mins === 60) { hrs += 1; mins = 0; }
    return hrs + ' hrs ' + mins + ' mins';
  }

  function calculateTime(inp) {
    var pure_hours = inp.distance / Math.max(1, inp.avg_speed);
    var num_stops = Math.floor(pure_hours / Math.max(0.5, inp.rest_interval));
    if (pure_hours <= inp.rest_interval) num_stops = 0;

    var total_rest_hours = (num_stops * inp.rest_duration) / 60.0;
    var total_trip_hours = pure_hours + total_rest_hours;

    var start_minutes_total = (inp.start_hour * 60) + inp.start_minute;
    var arrival_minutes_total = start_minutes_total + Math.round(total_trip_hours * 60);

    var arrival_day_offset = Math.floor(arrival_minutes_total / (24 * 60));
    var rem_minutes = arrival_minutes_total % (24 * 60);
    var arr_hour_24 = Math.floor(rem_minutes / 60);
    var arr_min = rem_minutes % 60;

    var ampm = arr_hour_24 >= 12 ? 'PM' : 'AM';
    var arr_hour_12 = arr_hour_24 % 12;
    if (arr_hour_12 === 0) arr_hour_12 = 12;

    var arr_min_str = arr_min < 10 ? '0' + arr_min : arr_min;
    var eta_str = arr_hour_12 + ':' + arr_min_str + ' ' + ampm;
    if (arrival_day_offset > 0) {
      eta_str += ' (+' + arrival_day_offset + ' day' + (arrival_day_offset > 1 ? 's' : '') + ')';
    }

    return {
      pure_hours: pure_hours,
      num_stops: num_stops,
      total_rest_hours: total_rest_hours,
      total_trip_hours: total_trip_hours,
      eta_str: eta_str
    };
  }

  function updateTool() {
    var inp = getInputs();
    var res = calculateTime(inp);

    setOutputText('output_pure_driving_time', formatHoursMins(res.pure_hours));
    setOutputText('output_total_trip_duration', formatHoursMins(res.total_trip_hours));
    setOutputText('output_num_rest_stops', res.num_stops + ' stops');
    setOutputText('output_total_rest_minutes', Math.round(res.total_rest_hours * 60) + ' mins total break');
    setOutputText('output_estimated_arrival', res.eta_str);

    var chartData = {
      labels: ['Pure Driving Time (hrs)', 'Rest Break Time (hrs)', 'Total Elapsed Trip (hrs)'],
      values: [parseFloat(res.pure_hours.toFixed(2)), parseFloat(res.total_rest_hours.toFixed(2)), parseFloat(res.total_trip_hours.toFixed(2))]
    };

    updateCharts(chartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        pure_driving_time: formatHoursMins(res.pure_hours),
        total_trip_duration: formatHoursMins(res.total_trip_hours),
        estimated_arrival: res.eta_str
      });
    }
  }

  function updateCharts(data) {
    var ctx = document.getElementById('chartCanvas');
    if (!ctx) return;
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    if (!data) return;

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Duration (Hours)',
          data: data.values,
          backgroundColor: ['#4A90D9', '#fbbf24', '#4ade80']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, ticks: { color: '#8899aa' } },
          x: { ticks: { color: '#8899aa' } }
        }
      }
    });
  }

  function switchChartTab(tabId) {
    updateTool();
  }

  function resetTool() {
    document.getElementById('input_distance').value = 450;
    document.getElementById('input_avg_speed').value = 65;
    document.getElementById('input_rest_interval').value = 2.5;
    document.getElementById('input_rest_duration').value = 20;
    document.getElementById('input_start_hour').value = 8;
    document.getElementById('input_start_minute').value = 0;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      el.addEventListener('input', updateTool);
      el.addEventListener('change', updateTool);
    });
    setTimeout(updateTool, 150);
  });
})();
