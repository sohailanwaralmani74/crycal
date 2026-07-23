(function() {
  var chartInstance = null;

  function getInputs() {
    return {
      current_width: parseFloat(document.getElementById('input_current_width').value) || 8.0,
      current_offset: parseFloat(document.getElementById('input_current_offset').value) || 45,
      new_width: parseFloat(document.getElementById('input_new_width').value) || 9.0,
      new_offset: parseFloat(document.getElementById('input_new_offset').value) || 35
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

  function calculateOffset(inp) {
    // Backspacing = (Width / 2) + (Offset / 25.4) + 0.5
    var curr_bs = (inp.current_width / 2.0) + (inp.current_offset / 25.4) + 0.5;
    var new_bs = (inp.new_width / 2.0) + (inp.new_offset / 25.4) + 0.5;

    // Inner clearance change in mm = ((new_w - curr_w)*25.4/2) + (new_off - curr_off)
    var inner_change_mm = ((inp.new_width - inp.current_width) * 25.4 / 2.0) + (inp.new_offset - inp.current_offset);

    // Outer extension change in mm = ((new_w - curr_w)*25.4/2) - (new_off - curr_off)
    var outer_change_mm = ((inp.new_width - inp.current_width) * 25.4 / 2.0) - (inp.new_offset - inp.current_offset);

    var summary = "";
    if (outer_change_mm > 0) {
      summary = "Extends " + outer_change_mm.toFixed(1) + " mm further out towards fender.";
    } else {
      summary = "Tucks " + Math.abs(outer_change_mm).toFixed(1) + " mm further inside fender.";
    }

    return {
      curr_bs: curr_bs,
      new_bs: new_bs,
      inner_change_mm: inner_change_mm,
      outer_change_mm: outer_change_mm,
      summary: summary
    };
  }

  function updateTool() {
    var inp = getInputs();
    var res = calculateOffset(inp);

    setOutputText('output_current_backspacing', res.curr_bs.toFixed(2) + ' in');
    setOutputText('output_new_backspacing', res.new_bs.toFixed(2) + ' in');
    setOutputText('output_inner_clearance_change', (res.inner_change_mm >= 0 ? '+' : '') + res.inner_change_mm.toFixed(1) + ' mm (' + (res.inner_change_mm >= 0 ? 'less' : 'more') + ' room)');
    setOutputText('output_outer_extension_change', (res.outer_change_mm >= 0 ? '+' : '') + res.outer_change_mm.toFixed(1) + ' mm (' + (res.outer_change_mm >= 0 ? 'outward' : 'inward') + ')');
    setOutputText('output_fitment_summary', res.summary);

    var chartData = {
      labels: ['Current Backspacing (in)', 'New Backspacing (in)', 'Outer Extension (mm/10)'],
      values: [parseFloat(res.curr_bs.toFixed(2)), parseFloat(res.new_bs.toFixed(2)), parseFloat((res.outer_change_mm / 10.0).toFixed(2))]
    };

    updateCharts(chartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        current_backspacing: res.curr_bs.toFixed(2) + ' in',
        new_backspacing: res.new_bs.toFixed(2) + ' in',
        outer_extension_change: res.outer_change_mm.toFixed(1) + ' mm'
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
          label: 'Wheel Position Metric',
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
    document.getElementById('input_current_width').value = 8.0;
    document.getElementById('input_current_offset').value = 45;
    document.getElementById('input_new_width').value = 9.0;
    document.getElementById('input_new_offset').value = 35;
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
