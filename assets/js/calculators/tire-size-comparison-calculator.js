(function() {
  var chartInstance = null;
  var currentTab = 'comparison';
  var lastChartData = null;

  function getInputs() {
    var s1_w = parseFloat(document.getElementById('input_size1_width').value) || 225;
    var s1_ar = parseFloat(document.getElementById('input_size1_ratio').value) || 45;
    var s1_r = parseFloat(document.getElementById('input_size1_rim').value) || 17;

    var s2_w = parseFloat(document.getElementById('input_size2_width').value) || 245;
    var s2_ar = parseFloat(document.getElementById('input_size2_ratio').value) || 40;
    var s2_r = parseFloat(document.getElementById('input_size2_rim').value) || 18;

    var targetSpeed = parseFloat(document.getElementById('input_target_speed').value) || 60;

    return {
      s1_w: s1_w, s1_ar: s1_ar, s1_r: s1_r,
      s2_w: s2_w, s2_ar: s2_ar, s2_r: s2_r,
      targetSpeed: targetSpeed
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

  function calculateTireComparison(inputs) {
    var s1_sw_in = (inputs.s1_w * (inputs.s1_ar / 100)) / 25.4;
    var s1_diam_in = inputs.s1_r + (2 * s1_sw_in);
    var s1_circ_in = s1_diam_in * Math.PI;
    var s1_revs = 63360 / s1_circ_in;

    var s2_sw_in = (inputs.s2_w * (inputs.s2_ar / 100)) / 25.4;
    var s2_diam_in = inputs.s2_r + (2 * s2_sw_in);
    var s2_circ_in = s2_diam_in * Math.PI;
    var s2_revs = 63360 / s2_circ_in;

    var diff_pct = ((s2_diam_in - s1_diam_in) / s1_diam_in) * 100;
    var actual_speed = inputs.targetSpeed * (s2_diam_in / s1_diam_in);

    return {
      s1_sw_in: s1_sw_in,
      s1_diam_in: s1_diam_in,
      s1_revs: s1_revs,
      s2_sw_in: s2_sw_in,
      s2_diam_in: s2_diam_in,
      s2_revs: s2_revs,
      diff_pct: diff_pct,
      actual_speed: actual_speed
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateTireComparison(inputs);

    setOutputText('output_tire1_diameter', res.s1_diam_in.toFixed(2) + ' in (' + (res.s1_diam_in * 25.4).toFixed(0) + ' mm)');
    setOutputText('output_tire2_diameter', res.s2_diam_in.toFixed(2) + ' in (' + (res.s2_diam_in * 25.4).toFixed(0) + ' mm)');
    setOutputText('output_diameter_diff_pct', (res.diff_pct >= 0 ? '+' : '') + res.diff_pct.toFixed(2) + '%');
    setOutputText('output_tire1_sidewall', res.s1_sw_in.toFixed(2) + ' in (' + (res.s1_sw_in * 25.4).toFixed(0) + ' mm)');
    setOutputText('output_tire2_sidewall', res.s2_sw_in.toFixed(2) + ' in (' + (res.s2_sw_in * 25.4).toFixed(0) + ' mm)');
    setOutputText('output_tire1_revs_mile', Math.round(res.s1_revs) + ' revs/mi');
    setOutputText('output_tire2_revs_mile', Math.round(res.s2_revs) + ' revs/mi');
    setOutputText('output_speedo_error', res.actual_speed.toFixed(1) + ' mph');

    var chartData = {
      labels: ['Overall Diameter (in)', 'Sidewall Height (in)', 'Section Width (in)'],
      t1: [parseFloat(res.s1_diam_in.toFixed(2)), parseFloat(res.s1_sw_in.toFixed(2)), parseFloat((inputs.s1_w / 25.4).toFixed(2))],
      t2: [parseFloat(res.s2_diam_in.toFixed(2)), parseFloat(res.s2_sw_in.toFixed(2)), parseFloat((inputs.s2_w / 25.4).toFixed(2))]
    };

    lastChartData = chartData;
    updateCharts(chartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        tire1_diameter: res.s1_diam_in.toFixed(2) + ' in',
        tire2_diameter: res.s2_diam_in.toFixed(2) + ' in',
        diameter_diff_pct: res.diff_pct.toFixed(2) + '%'
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
        datasets: [
          {
            label: 'Tire 1',
            data: data.t1,
            backgroundColor: '#4A90D9'
          },
          {
            label: 'Tire 2',
            data: data.t2,
            backgroundColor: '#fbbf24'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, labels: { color: '#e8edf0' } }
        },
        scales: {
          y: { beginAtZero: true, ticks: { color: '#8899aa' } },
          x: { ticks: { color: '#8899aa' } }
        }
      }
    });
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) updateCharts(lastChartData);
    else updateTool();
  }

  function resetTool() {
    document.getElementById('input_size1_width').value = 225;
    document.getElementById('input_size1_ratio').value = 45;
    document.getElementById('input_size1_rim').value = 17;
    document.getElementById('input_size2_width').value = 245;
    document.getElementById('input_size2_ratio').value = 40;
    document.getElementById('input_size2_rim').value = 18;
    document.getElementById('input_target_speed').value = 60;
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
