(function() {
  var chartInstance = null;

  function getInputs() {
    return {
      oem_width: parseFloat(document.getElementById('input_oem_width').value) || 205,
      oem_aspect: parseFloat(document.getElementById('input_oem_aspect').value) || 55,
      oem_rim: parseFloat(document.getElementById('input_oem_rim').value) || 16,
      target_upsize: parseInt(document.getElementById('input_target_upsize').value) || 1,
      new_width: parseFloat(document.getElementById('input_new_width').value) || 225,
      new_aspect: parseFloat(document.getElementById('input_new_aspect').value) || 45
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

  function calculatePlusSize(inp) {
    var oem_sw_in = (inp.oem_width * (inp.oem_aspect / 100)) / 25.4;
    var oem_diam_in = inp.oem_rim + (2 * oem_sw_in);

    var plus_rim = inp.oem_rim + inp.target_upsize;
    var new_sw_in = (inp.new_width * (inp.new_aspect / 100)) / 25.4;
    var new_diam_in = plus_rim + (2 * new_sw_in);

    var pct_diff = ((new_diam_in - oem_diam_in) / oem_diam_in) * 100;
    var speedo_60 = 60.0 * (new_diam_in / oem_diam_in);

    var status = "";
    if (Math.abs(pct_diff) <= 1.0) {
      status = "Optimal Fit (Within ±1%)";
    } else if (Math.abs(pct_diff) <= 3.0) {
      status = "Acceptable (Within ±3%)";
    } else {
      status = "Out of Spec (> ±3% Limit)";
    }

    return {
      oem_diam_in: oem_diam_in,
      new_diam_in: new_diam_in,
      pct_diff: pct_diff,
      speedo_60: speedo_60,
      status: status
    };
  }

  function updateTool() {
    var inp = getInputs();
    var res = calculatePlusSize(inp);

    setOutputText('output_oem_diameter', res.oem_diam_in.toFixed(2) + ' in');
    setOutputText('output_new_diameter', res.new_diam_in.toFixed(2) + ' in');
    setOutputText('output_diameter_pct_diff', (res.pct_diff >= 0 ? '+' : '') + res.pct_diff.toFixed(2) + '%');
    setOutputText('output_fitment_status', res.status);
    setOutputText('output_speedo_reading_60', res.speedo_60.toFixed(1) + ' mph');

    var chartData = {
      labels: ['OEM Diameter (in)', 'Plus Sized Diameter (in)'],
      values: [parseFloat(res.oem_diam_in.toFixed(2)), parseFloat(res.new_diam_in.toFixed(2))]
    };

    updateCharts(chartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        oem_diameter: res.oem_diam_in.toFixed(2) + ' in',
        new_diameter: res.new_diam_in.toFixed(2) + ' in',
        fitment_status: res.status
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
          label: 'Overall Height (inches)',
          data: data.values,
          backgroundColor: ['#4A90D9', '#4ade80']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: false, min: Math.floor(Math.min(data.values[0], data.values[1]) - 2), ticks: { color: '#8899aa' } },
          x: { ticks: { color: '#8899aa' } }
        }
      }
    });
  }

  function switchChartTab(tabId) {
    updateTool();
  }

  function resetTool() {
    document.getElementById('input_oem_width').value = 205;
    document.getElementById('input_oem_aspect').value = 55;
    document.getElementById('input_oem_rim').value = 16;
    document.getElementById('input_target_upsize').value = "1";
    document.getElementById('input_new_width').value = 225;
    document.getElementById('input_new_aspect').value = 45;
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
