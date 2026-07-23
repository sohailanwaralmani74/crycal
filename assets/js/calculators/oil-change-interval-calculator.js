(function() {
  var chartInstance = null;

  function getInputs() {
    return {
      oil_type: document.getElementById('input_oil_type').value || "synth_blend",
      driving_conditions: document.getElementById('input_driving_conditions').value || "normal",
      last_change_mileage: parseFloat(document.getElementById('input_last_change_mileage').value) || 45000,
      last_change_months_ago: parseFloat(document.getElementById('input_last_change_months_ago').value) || 4,
      annual_mileage: parseFloat(document.getElementById('input_annual_mileage').value) || 12000
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

  function calculateOil(inp) {
    var base_miles = 6000;
    var base_months = 6;

    if (inp.oil_type === "conventional") {
      base_miles = 4000;
      base_months = 4;
    } else if (inp.oil_type === "synth_blend") {
      base_miles = 6000;
      base_months = 6;
    } else if (inp.oil_type === "full_synthetic") {
      base_miles = 9000;
      base_months = 12;
    } else if (inp.oil_type === "high_mileage") {
      base_miles = 11000;
      base_months = 12;
    }

    var severity_mult = 1.0;
    if (inp.driving_conditions === "severe") severity_mult = 0.75;
    else if (inp.driving_conditions === "extreme") severity_mult = 0.60;

    var rec_interval_miles = base_miles * severity_mult;
    var rec_interval_months = base_months * severity_mult;

    var next_service_mileage = inp.last_change_mileage + rec_interval_miles;

    var miles_driven_since = (inp.last_change_months_ago / 12.0) * inp.annual_mileage;
    var miles_remaining = rec_interval_miles - miles_driven_since;

    var status = "";
    if (miles_remaining <= 0 || inp.last_change_months_ago >= rec_interval_months) {
      status = "Oil Change Overdue – Schedule Service";
    } else if (miles_remaining <= 1000) {
      status = "Service Due Soon";
    } else {
      status = "Good / Normal Condition";
    }

    return {
      rec_interval_miles: rec_interval_miles,
      next_service_mileage: next_service_mileage,
      rec_interval_months: rec_interval_months,
      miles_remaining: miles_remaining,
      status: status
    };
  }

  function updateTool() {
    var inp = getInputs();
    var res = calculateOil(inp);

    setOutputText('output_recommended_interval_miles', Math.round(res.rec_interval_miles).toLocaleString() + ' miles');
    setOutputText('output_next_service_mileage', Math.round(res.next_service_mileage).toLocaleString() + ' mi (Odometer)');
    setOutputText('output_recommended_interval_months', res.rec_interval_months.toFixed(1) + ' months max');
    setOutputText('output_miles_remaining', Math.round(res.miles_remaining).toLocaleString() + ' miles remaining');
    setOutputText('output_service_status', res.status);

    var chartData = {
      labels: ['Conventional', 'Synthetic Blend', 'Full Synthetic', 'High-Mileage'],
      values: [4000, 6000, 9000, 11000]
    };

    updateCharts(chartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        recommended_interval_miles: Math.round(res.rec_interval_miles) + ' mi',
        next_service_mileage: Math.round(res.next_service_mileage) + ' mi',
        service_status: res.status
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
          label: 'Baseline Mileage Interval (Miles)',
          data: data.values,
          backgroundColor: ['#D95B43', '#fbbf24', '#4A90D9', '#4ade80']
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
    document.getElementById('input_oil_type').value = "synth_blend";
    document.getElementById('input_driving_conditions').value = "normal";
    document.getElementById('input_last_change_mileage').value = 45000;
    document.getElementById('input_last_change_months_ago').value = 4;
    document.getElementById('input_annual_mileage').value = 12000;
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
