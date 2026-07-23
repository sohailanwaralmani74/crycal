(function() {
  var chartInstance = null;

  function getInputs() {
    return {
      current_pad_thickness: parseFloat(document.getElementById('input_current_pad_thickness').value) || 6.0,
      new_pad_thickness: parseFloat(document.getElementById('input_new_pad_thickness').value) || 12.0,
      replace_threshold: parseFloat(document.getElementById('input_replace_threshold').value) || 3.0,
      current_odometer: parseFloat(document.getElementById('input_current_odometer').value) || 35000,
      driving_habit: parseFloat(document.getElementById('input_driving_habit').value) || 1.0,
      annual_miles: parseFloat(document.getElementById('input_annual_miles').value) || 12000
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

  function calculateBrakeLife(inp) {
    var worn_mm = Math.max(0.1, inp.new_pad_thickness - inp.current_pad_thickness);
    var remaining_mm = Math.max(0, inp.current_pad_thickness - inp.replace_threshold);
    var usable_total_mm = Math.max(0.1, inp.new_pad_thickness - inp.replace_threshold);

    var miles_per_mm = inp.current_odometer / worn_mm;
    var remaining_miles = remaining_mm * miles_per_mm * inp.driving_habit;
    var replace_odometer = inp.current_odometer + remaining_miles;

    var months_remaining = (remaining_miles / Math.max(1, inp.annual_miles)) * 12.0;
    var life_pct = Math.min(100, Math.max(0, (remaining_mm / usable_total_mm) * 100));

    return {
      remaining_miles: remaining_miles,
      replace_odometer: replace_odometer,
      months_remaining: months_remaining,
      miles_per_mm: miles_per_mm,
      life_pct: life_pct
    };
  }

  function updateTool() {
    var inp = getInputs();
    var res = calculateBrakeLife(inp);

    setOutputText('output_remaining_miles', Math.round(res.remaining_miles).toLocaleString() + ' miles');
    setOutputText('output_months_remaining', res.months_remaining.toFixed(1) + ' months');
    setOutputText('output_replace_odometer', Math.round(res.replace_odometer).toLocaleString() + ' mi (Odometer)');
    setOutputText('output_pad_life_pct', res.life_pct.toFixed(1) + '% remaining');
    setOutputText('output_wear_rate', Math.round(res.miles_per_mm).toLocaleString() + ' mi / 1 mm');

    var chartData = {
      labels: ['0 mi (New)', 'Current (' + Math.round(inp.current_odometer) + ' mi)', 'Target Replace (' + Math.round(res.replace_odometer) + ' mi)'],
      values: [inp.new_pad_thickness, inp.current_pad_thickness, inp.replace_threshold]
    };

    updateCharts(chartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        remaining_miles: Math.round(res.remaining_miles) + ' mi',
        replace_odometer: Math.round(res.replace_odometer) + ' mi',
        pad_life_pct: res.life_pct.toFixed(1) + '%'
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
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Brake Pad Thickness (mm)',
          data: data.values,
          borderColor: '#D95B43',
          backgroundColor: 'rgba(217, 91, 67, 0.2)',
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, labels: { color: '#e8edf0' } }
        },
        scales: {
          y: { min: 0, max: 15, ticks: { color: '#8899aa' } },
          x: { ticks: { color: '#8899aa' } }
        }
      }
    });
  }

  function switchChartTab(tabId) {
    updateTool();
  }

  function resetTool() {
    document.getElementById('input_current_pad_thickness').value = 6.0;
    document.getElementById('input_new_pad_thickness').value = 12.0;
    document.getElementById('input_replace_threshold').value = 3.0;
    document.getElementById('input_current_odometer').value = 35000;
    document.getElementById('input_driving_habit').value = "1.0";
    document.getElementById('input_annual_miles').value = 12000;
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
