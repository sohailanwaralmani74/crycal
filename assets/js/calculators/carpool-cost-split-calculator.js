(function() {
  var chartInstance = null;

  function getInputs() {
    return {
      commute_distance: parseFloat(document.getElementById('input_commute_distance').value) || 40,
      working_days: parseInt(document.getElementById('input_working_days').value) || 20,
      vehicle_mpg: parseFloat(document.getElementById('input_vehicle_mpg').value) || 25.0,
      fuel_price: parseFloat(document.getElementById('input_fuel_price').value) || 3.50,
      monthly_tolls_parking: parseFloat(document.getElementById('input_monthly_tolls_parking').value) || 100,
      wear_tear_rate: parseFloat(document.getElementById('input_wear_tear_rate').value) || 0.15,
      num_riders: parseInt(document.getElementById('input_num_riders').value) || 4
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

  function calculateCarpool(inp) {
    var monthly_miles = inp.commute_distance * inp.working_days;
    var monthly_fuel = (monthly_miles / Math.max(1, inp.vehicle_mpg)) * inp.fuel_price;
    var monthly_wear = monthly_miles * inp.wear_tear_rate;
    var total_monthly = monthly_fuel + monthly_wear + inp.monthly_tolls_parking;

    var cost_per_rider_monthly = total_monthly / Math.max(1, inp.num_riders);
    var cost_per_rider_daily = cost_per_rider_monthly / Math.max(1, inp.working_days);

    var driver_reimbursement = total_monthly * ((inp.num_riders - 1) / Math.max(1, inp.num_riders));

    var fuel_pct = (monthly_fuel / total_monthly) * 100;
    var wear_pct = (monthly_wear / total_monthly) * 100;

    return {
      monthly_fuel: monthly_fuel,
      monthly_wear: monthly_wear,
      total_monthly: total_monthly,
      cost_per_rider_monthly: cost_per_rider_monthly,
      cost_per_rider_daily: cost_per_rider_daily,
      driver_reimbursement: driver_reimbursement,
      ratio_text: fuel_pct.toFixed(0) + '% Fuel / ' + wear_pct.toFixed(0) + '% Wear'
    };
  }

  function updateTool() {
    var inp = getInputs();
    var res = calculateCarpool(inp);

    setOutputText('output_total_monthly_cost', formatCurrency(res.total_monthly));
    setOutputText('output_cost_per_rider_monthly', formatCurrency(res.cost_per_rider_monthly) + ' / month');
    setOutputText('output_cost_per_rider_daily', formatCurrency(res.cost_per_rider_daily) + ' / day');
    setOutputText('output_driver_monthly_savings', formatCurrency(res.driver_reimbursement) + ' recouped');
    setOutputText('output_fuel_vs_wear_ratio', res.ratio_text);

    var chartData = {
      labels: ['Monthly Fuel', 'Vehicle Wear & Tear', 'Tolls & Parking', 'Per Rider Monthly Share'],
      values: [
        parseFloat(res.monthly_fuel.toFixed(2)),
        parseFloat(res.monthly_wear.toFixed(2)),
        parseFloat(inp.monthly_tolls_parking.toFixed(2)),
        parseFloat(res.cost_per_rider_monthly.toFixed(2))
      ]
    };

    updateCharts(chartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        total_monthly_cost: formatCurrency(res.total_monthly),
        cost_per_rider_monthly: formatCurrency(res.cost_per_rider_monthly),
        driver_monthly_savings: formatCurrency(res.driver_reimbursement)
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
          label: 'Cost Breakdown ',
          data: data.values,
          backgroundColor: ['#4A90D9', '#fbbf24', '#D95B43', '#4ade80']
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
    document.getElementById('input_commute_distance').value = 40;
    document.getElementById('input_working_days').value = 20;
    document.getElementById('input_vehicle_mpg').value = 25.0;
    document.getElementById('input_fuel_price').value = 3.50;
    document.getElementById('input_monthly_tolls_parking').value = 100;
    document.getElementById('input_wear_tear_rate').value = 0.15;
    document.getElementById('input_num_riders').value = 4;
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
