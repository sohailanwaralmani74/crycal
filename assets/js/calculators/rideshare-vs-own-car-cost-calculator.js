(function() {
  var chartInstance = null;

  function getInputs() {
    return {
      rideshare_trips_week: parseFloat(document.getElementById('input_rideshare_trips_week').value) || 10,
      avg_fare_per_trip: parseFloat(document.getElementById('input_avg_fare_per_trip').value) || 22,
      avg_tip_pct: parseFloat(document.getElementById('input_avg_tip_pct').value) || 15,
      monthly_car_payment: parseFloat(document.getElementById('input_monthly_car_payment').value) || 450,
      monthly_insurance: parseFloat(document.getElementById('input_monthly_insurance').value) || 140,
      monthly_gas_maintenance: parseFloat(document.getElementById('input_monthly_gas_maintenance').value) || 200
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

  function calculateRideshare(inp) {
    var monthly_trips = inp.rideshare_trips_week * 4.333;
    var total_fare_with_tip = inp.avg_fare_per_trip * (1 + (inp.avg_tip_pct / 100));
    var rideshare_monthly = monthly_trips * total_fare_with_tip;

    var own_car_monthly = inp.monthly_car_payment + inp.monthly_insurance + inp.monthly_gas_maintenance;
    var monthly_diff = own_car_monthly - rideshare_monthly;

    var winner = "";
    var annual_savings = 0;

    if (rideshare_monthly < own_car_monthly) {
      winner = "Rideshare (Uber/Lyft) is Cheaper";
      annual_savings = (own_car_monthly - rideshare_monthly) * 12;
    } else {
      winner = "Owning a Car is Cheaper";
      annual_savings = (rideshare_monthly - own_car_monthly) * 12;
    }

    return {
      rideshare_monthly: rideshare_monthly,
      own_car_monthly: own_car_monthly,
      monthly_diff: monthly_diff,
      winner: winner,
      annual_savings: annual_savings
    };
  }

  function updateTool() {
    var inp = getInputs();
    var res = calculateRideshare(inp);

    setOutputText('output_rideshare_monthly', formatCurrency(res.rideshare_monthly) + ' / mo');
    setOutputText('output_own_car_monthly', formatCurrency(res.own_car_monthly) + ' / mo');
    setOutputText('output_monthly_difference', formatCurrency(Math.abs(res.monthly_diff)) + ' / mo');
    setOutputText('output_cheaper_option', res.winner);
    setOutputText('output_annual_savings', formatCurrency(res.annual_savings) + ' / year saved');

    var chartData = {
      labels: ['Rideshare Monthly Total', 'Own Car Total (Loan + Ins + Gas)'],
      values: [parseFloat(res.rideshare_monthly.toFixed(2)), parseFloat(res.own_car_monthly.toFixed(2))]
    };

    updateCharts(chartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        rideshare_monthly: formatCurrency(res.rideshare_monthly),
        own_car_monthly: formatCurrency(res.own_car_monthly),
        cheaper_option: res.winner
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
          label: 'Monthly Expense ',
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
    document.getElementById('input_rideshare_trips_week').value = 10;
    document.getElementById('input_avg_fare_per_trip').value = 22;
    document.getElementById('input_avg_tip_pct').value = 15;
    document.getElementById('input_monthly_car_payment').value = 450;
    document.getElementById('input_monthly_insurance').value = 140;
    document.getElementById('input_monthly_gas_maintenance').value = 200;
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
