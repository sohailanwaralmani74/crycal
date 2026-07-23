(function() {
  var chartInstance = null;

  function getInputs() {
    return {
      battery_type: document.getElementById('input_battery_type').value || "flooded",
      battery_age_years: parseFloat(document.getElementById('input_battery_age_years').value) || 2.5,
      climate: document.getElementById('input_climate').value || "moderate",
      driving_routine: document.getElementById('input_driving_routine').value || "highway",
      diy_or_shop: document.getElementById('input_diy_or_shop').value || "mechanic"
    };
  }

  function formatCurrency(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(2);
    }
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateBattery(inp) {
    var base_life = 4.0;
    var base_price = 130;

    if (inp.battery_type === "flooded") {
      base_life = 4.0;
      base_price = 130;
    } else if (inp.battery_type === "agm") {
      base_life = 6.0;
      base_price = 230;
    } else if (inp.battery_type === "gel") {
      base_life = 5.0;
      base_price = 260;
    }

    var climate_mult = 1.0;
    if (inp.climate === "hot") climate_mult = 0.75;
    else if (inp.climate === "cold") climate_mult = 0.85;

    var routine_mult = 1.0;
    if (inp.driving_routine === "short") routine_mult = 0.80;
    else if (inp.driving_routine === "infrequent") routine_mult = 0.85;

    var total_expected_life = base_life * climate_mult * routine_mult;
    var remaining_life_years = Math.max(0, total_expected_life - inp.battery_age_years);

    var labor_fee = 0;
    if (inp.diy_or_shop === "mechanic") labor_fee = 45;
    else if (inp.diy_or_shop === "dealership") labor_fee = 95;

    var replacement_cost = base_price + labor_fee;
    var monthly_cost = replacement_cost / (total_expected_life * 12.0);

    var status = "";
    if (remaining_life_years <= 0.2) {
      status = "Critical – Replace Immediately";
    } else if (remaining_life_years <= 1.0) {
      status = "Aging – Test & Plan Replacement";
    } else {
      status = "Good / Healthy Condition";
    }

    return {
      remaining_life_years: remaining_life_years,
      total_expected_life: total_expected_life,
      replacement_cost: replacement_cost,
      status: status,
      monthly_cost: monthly_cost
    };
  }

  function updateTool() {
    var inp = getInputs();
    var res = calculateBattery(inp);

    setOutputText('output_remaining_life_years', res.remaining_life_years.toFixed(1) + ' years left');
    setOutputText('output_total_expected_life', res.total_expected_life.toFixed(1) + ' years total');
    setOutputText('output_replacement_cost', formatCurrency(res.replacement_cost));
    setOutputText('output_health_status', res.status);
    setOutputText('output_monthly_cost_of_life', formatCurrency(res.monthly_cost) + ' / month of life');

    var chartData = {
      labels: ['Flooded Lead-Acid', 'AGM Battery', 'Gel Cell Battery'],
      values: [130, 230, 260]
    };

    updateCharts(chartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        remaining_life_years: res.remaining_life_years.toFixed(1) + ' yrs',
        replacement_cost: formatCurrency(res.replacement_cost),
        health_status: res.status
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
          label: 'Base Battery Unit Cost ',
          data: data.values,
          backgroundColor: ['#4A90D9', '#4ade80', '#fbbf24']
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
    document.getElementById('input_battery_type').value = "flooded";
    document.getElementById('input_battery_age_years').value = 2.5;
    document.getElementById('input_climate').value = "moderate";
    document.getElementById('input_driving_routine').value = "highway";
    document.getElementById('input_diy_or_shop').value = "mechanic";
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
