(function() {
  var chartInstance = null;

  function getInputs() {
    return {
      base_psi: parseFloat(document.getElementById('input_base_psi').value) || 32,
      base_temp: parseFloat(document.getElementById('input_base_temp').value) || 70,
      current_temp: parseFloat(document.getElementById('input_current_temp').value) || 30,
      cargo_weight: parseFloat(document.getElementById('input_cargo_weight').value) || 0,
      towing_weight: parseFloat(document.getElementById('input_towing_weight').value) || 0,
      max_vehicle_payload: parseFloat(document.getElementById('input_max_vehicle_payload').value) || 1500,
      max_tire_psi: parseFloat(document.getElementById('input_max_tire_psi').value) || 50
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

  function calculatePressure(inp) {
    var temp_diff = inp.base_temp - inp.current_temp;
    var temp_adj = temp_diff / 10.0; // +1 PSI per 10 F drop

    var total_load = inp.cargo_weight + inp.towing_weight;
    var load_ratio = Math.min(1.0, total_load / Math.max(1, inp.max_vehicle_payload));
    var load_adj = load_ratio * 6.0; // Max 6 PSI boost for full payload

    var un capped = inp.base_psi + temp_adj + load_adj;
    var rec_cold_psi = Math.min(uncapped, inp.max_tire_psi);
    var net_diff = rec_cold_psi - inp.base_psi;

    return {
      rec_cold_psi: rec_cold_psi,
      temp_adj: temp_adj,
      load_adj: load_adj,
      max_tire_psi: inp.max_tire_psi,
      net_diff: net_diff
    };
  }

  function updateTool() {
    var inp = getInputs();
    var res = calculatePressure(inp);

    setOutputText('output_rec_cold_psi', res.rec_cold_psi.toFixed(1) + ' PSI');
    setOutputText('output_temp_adjustment', (res.temp_adj >= 0 ? '+' : '') + res.temp_adj.toFixed(1) + ' PSI');
    setOutputText('output_load_adjustment', '+' + res.load_adj.toFixed(1) + ' PSI');
    setOutputText('output_max_safe_psi', res.max_tire_psi.toFixed(0) + ' PSI Limit');
    setOutputText('output_psi_difference', (res.net_diff >= 0 ? '+' : '') + res.net_diff.toFixed(1) + ' PSI');

    var chartData = {
      labels: ['OEM Baseline', 'Temp Adjustment', 'Load Adjustment', 'Target Cold PSI'],
      values: [inp.base_psi, parseFloat(res.temp_adj.toFixed(1)), parseFloat(res.load_adj.toFixed(1)), parseFloat(res.rec_cold_psi.toFixed(1))]
    };

    updateCharts(chartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        rec_cold_psi: res.rec_cold_psi.toFixed(1) + ' PSI',
        temp_adjustment: res.temp_adj.toFixed(1) + ' PSI',
        load_adjustment: res.load_adj.toFixed(1) + ' PSI'
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
          label: 'PSI Value',
          data: data.values,
          backgroundColor: ['#4A90D9', '#fbbf24', '#4ade80', '#D95B43']
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
    document.getElementById('input_base_psi').value = 32;
    document.getElementById('input_base_temp').value = 70;
    document.getElementById('input_current_temp').value = 30;
    document.getElementById('input_cargo_weight').value = 500;
    document.getElementById('input_towing_weight').value = 0;
    document.getElementById('input_max_vehicle_payload').value = 1500;
    document.getElementById('input_max_tire_psi').value = 50;
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
