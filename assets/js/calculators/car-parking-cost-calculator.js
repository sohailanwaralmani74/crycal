(function() {
  var chartInstance = null;

  function getInputs() {
    return {
      daily_garage_rate: parseFloat(document.getElementById('input_daily_garage_rate').value) || 25,
      monthly_permit_rate: parseFloat(document.getElementById('input_monthly_permit_rate').value) || 320,
      meter_hourly_rate: parseFloat(document.getElementById('input_meter_hourly_rate').value) || 3.00,
      hours_per_day: parseFloat(document.getElementById('input_hours_per_day').value) || 8,
      workdays_per_month: parseInt(document.getElementById('input_workdays_per_month').value) || 20,
      employer_subsidy: parseFloat(document.getElementById('input_employer_subsidy').value) || 50
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

  function calculateParking(inp) {
    var gross_permit = inp.monthly_permit_rate;
    var gross_daily = inp.daily_garage_rate * inp.workdays_per_month;
    var gross_meter = inp.meter_hourly_rate * inp.hours_per_day * inp.workdays_per_month;

    var net_permit = Math.max(0, gross_permit - inp.employer_subsidy);
    var net_daily = Math.max(0, gross_daily - inp.employer_subsidy);
    var net_meter = Math.max(0, gross_meter - inp.employer_subsidy);

    var winner = "";
    var min_cost = Math.min(net_permit, net_daily, net_meter);
    var annual_savings = 0;

    if (min_cost === net_permit) {
      winner = "Monthly Permit Pass";
      annual_savings = (net_daily - net_permit) * 12;
    } else if (min_cost === net_daily) {
      winner = "Daily Garage Rates";
      annual_savings = (net_permit - net_daily) * 12;
    } else {
      winner = "Street Meters";
      annual_savings = (net_permit - net_meter) * 12;
    }

    return {
      net_permit: net_permit,
      net_daily: net_daily,
      net_meter: net_meter,
      winner: winner,
      annual_savings: Math.max(0, annual_savings)
    };
  }

  function updateTool() {
    var inp = getInputs();
    var res = calculateParking(inp);

    setOutputText('output_monthly_permit_cost', formatCurrency(res.net_permit) + ' / mo');
    setOutputText('output_monthly_daily_rate_cost', formatCurrency(res.net_daily) + ' / mo');
    setOutputText('output_monthly_meter_cost', formatCurrency(res.net_meter) + ' / mo');
    setOutputText('output_cheaper_parking_option', res.winner);
    setOutputText('output_annual_permit_savings', formatCurrency(res.annual_savings) + ' / year saved');

    var chartData = {
      labels: ['Monthly Permit Pass', 'Daily Garage Rates', 'Street Meter Parking'],
      values: [parseFloat(res.net_permit.toFixed(2)), parseFloat(res.net_daily.toFixed(2)), parseFloat(res.net_meter.toFixed(2))]
    };

    updateCharts(chartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        monthly_permit_cost: formatCurrency(res.net_permit),
        monthly_daily_rate_cost: formatCurrency(res.net_daily),
        cheaper_parking_option: res.winner
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
          label: 'Net Monthly Cost ',
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
    document.getElementById('input_daily_garage_rate').value = 25;
    document.getElementById('input_monthly_permit_rate').value = 320;
    document.getElementById('input_meter_hourly_rate').value = 3.00;
    document.getElementById('input_hours_per_day').value = 8;
    document.getElementById('input_workdays_per_month').value = 20;
    document.getElementById('input_employer_subsidy').value = 50;
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
