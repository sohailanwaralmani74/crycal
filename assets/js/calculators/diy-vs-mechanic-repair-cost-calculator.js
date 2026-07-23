(function() {
  var chartInstance = null;

  function getInputs() {
    return {
      mechanic_labor_rate: parseFloat(document.getElementById('input_mechanic_labor_rate').value) || 120,
      job_labor_hours: parseFloat(document.getElementById('input_job_labor_hours').value) || 3.0,
      oem_parts_cost: parseFloat(document.getElementById('input_oem_parts_cost').value) || 250,
      diy_parts_cost: parseFloat(document.getElementById('input_diy_parts_cost').value) || 140,
      diy_tools_needed: parseFloat(document.getElementById('input_diy_tools_needed').value) || 45,
      diy_hours_spent: parseFloat(document.getElementById('input_diy_hours_spent').value) || 5.0,
      user_hourly_value: parseFloat(document.getElementById('input_user_hourly_value').value) || 30,
      shop_fees_pct: parseFloat(document.getElementById('input_shop_fees_pct').value) || 10
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

  function calculateRepair(inp) {
    var mechanic_labor = inp.mechanic_labor_rate * inp.job_labor_hours;
    var shop_fees = (mechanic_labor + inp.oem_parts_cost) * (inp.shop_fees_pct / 100);
    var total_mechanic_cost = mechanic_labor + inp.oem_parts_cost + shop_fees;

    var diy_cash_outlay = inp.diy_parts_cost + inp.diy_tools_needed;
    var direct_cash_savings = total_mechanic_cost - diy_cash_outlay;

    var personal_time_val = inp.diy_hours_spent * inp.user_hourly_value;
    var total_diy_with_time = diy_cash_outlay + personal_time_val;
    var net_true_savings = total_mechanic_cost - total_diy_with_time;

    var breakeven_labor_val = direct_cash_savings / Math.max(0.1, inp.diy_hours_spent);

    return {
      total_mechanic_cost: total_mechanic_cost,
      diy_cash_outlay: diy_cash_outlay,
      direct_cash_savings: direct_cash_savings,
      net_true_savings: net_true_savings,
      breakeven_labor_val: breakeven_labor_val
    };
  }

  function updateTool() {
    var inp = getInputs();
    var res = calculateRepair(inp);

    setOutputText('output_total_mechanic_cost', formatCurrency(res.total_mechanic_cost));
    setOutputText('output_diy_cash_outlay', formatCurrency(res.diy_cash_outlay));
    setOutputText('output_direct_cash_savings', formatCurrency(res.direct_cash_savings) + ' saved');
    setOutputText('output_net_true_savings', formatCurrency(res.net_true_savings) + ' net saved');
    setOutputText('output_diy_breakeven_labor_val', formatCurrency(res.breakeven_labor_val) + ' / hour');

    var chartData = {
      labels: ['Mechanic Shop Total', 'DIY Cash Outlay (Parts+Tools)', 'DIY Total (With Time Value)'],
      values: [
        parseFloat(res.total_mechanic_cost.toFixed(2)),
        parseFloat(res.diy_cash_outlay.toFixed(2)),
        parseFloat((res.diy_cash_outlay + (inp.diy_hours_spent * inp.user_hourly_value)).toFixed(2))
      ]
    };

    updateCharts(chartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        total_mechanic_cost: formatCurrency(res.total_mechanic_cost),
        diy_cash_outlay: formatCurrency(res.diy_cash_outlay),
        net_true_savings: formatCurrency(res.net_true_savings)
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
          label: 'Total Cost ',
          data: data.values,
          backgroundColor: ['#D95B43', '#4ade80', '#4A90D9']
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
    document.getElementById('input_mechanic_labor_rate').value = 120;
    document.getElementById('input_job_labor_hours').value = 3.0;
    document.getElementById('input_oem_parts_cost').value = 250;
    document.getElementById('input_diy_parts_cost').value = 140;
    document.getElementById('input_diy_tools_needed').value = 45;
    document.getElementById('input_diy_hours_spent').value = 5.0;
    document.getElementById('input_user_hourly_value').value = 30;
    document.getElementById('input_shop_fees_pct').value = 10;
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
