(function() {
  var chartInstance = null;

  function getInputs() {
    return {
      starting_tread: parseFloat(document.getElementById('input_starting_tread').value) || 10,
      current_tread: parseFloat(document.getElementById('input_current_tread').value) || 6,
      current_odometer: parseFloat(document.getElementById('input_current_odometer').value) || 25000,
      utqg_rating: parseFloat(document.getElementById('input_utqg_rating').value) || 500,
      annual_miles: parseFloat(document.getElementById('input_annual_miles').value) || 12000,
      driving_style: parseFloat(document.getElementById('input_driving_style').value) || 1.0
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

  function calculateWear(inp) {
    var replacement_limit = 2.0; // 2/32 inch legal limit
    var worn_depth = Math.max(0.1, inp.starting_tread - inp.current_tread);
    var remaining_depth = Math.max(0, inp.current_tread - replacement_limit);
    var total_usable_depth = Math.max(0.1, inp.starting_tread - replacement_limit);

    var miles_per_32nd = inp.current_odometer / worn_depth;
    var remaining_miles = remaining_depth * miles_per_32nd * inp.driving_style;
    var total_lifespan = inp.current_odometer + remaining_miles;

    var months_remaining = (remaining_miles / Math.max(1, inp.annual_miles)) * 12.0;
    var pct_worn = Math.min(100, (worn_depth / total_usable_depth) * 100);

    return {
      remaining_miles: remaining_miles,
      total_lifespan: total_lifespan,
      months_remaining: months_remaining,
      miles_per_32nd: miles_per_32nd,
      pct_worn: pct_worn
    };
  }

  function updateTool() {
    var inp = getInputs();
    var res = calculateWear(inp);

    setOutputText('output_remaining_miles', Math.round(res.remaining_miles).toLocaleString() + ' miles');
    setOutputText('output_total_lifespan_miles', Math.round(res.total_lifespan).toLocaleString() + ' miles');
    setOutputText('output_months_remaining', res.months_remaining.toFixed(1) + ' months');
    setOutputText('output_wear_rate_per_32nd', Math.round(res.miles_per_32nd).toLocaleString() + ' mi / 1/32"');
    setOutputText('output_percentage_worn', res.pct_worn.toFixed(1) + '% worn');

    var chartData = {
      labels: ['0 mi (New)', 'Current (' + Math.round(inp.current_odometer) + ' mi)', 'Projected Limit (' + Math.round(res.total_lifespan) + ' mi)'],
      values: [inp.starting_tread, inp.current_tread, 2.0]
    };

    updateCharts(chartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        remaining_miles: Math.round(res.remaining_miles) + ' mi',
        total_lifespan_miles: Math.round(res.total_lifespan) + ' mi',
        months_remaining: res.months_remaining.toFixed(1) + ' mos'
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
          label: 'Tread Depth (32nds)',
          data: data.values,
          borderColor: '#4A90D9',
          backgroundColor: 'rgba(74, 144, 217, 0.2)',
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
          y: { min: 0, max: 12, ticks: { color: '#8899aa' } },
          x: { ticks: { color: '#8899aa' } }
        }
      }
    });
  }

  function switchChartTab(tabId) {
    updateTool();
  }

  function resetTool() {
    document.getElementById('input_starting_tread').value = 10;
    document.getElementById('input_current_tread').value = 6;
    document.getElementById('input_current_odometer').value = 25000;
    document.getElementById('input_utqg_rating').value = 500;
    document.getElementById('input_annual_miles').value = 12000;
    document.getElementById('input_driving_style').value = "1.0";
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
