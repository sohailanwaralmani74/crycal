(function() {
  var chartInstance = null;

  function getInputs() {
    return {
      engine_type: document.getElementById('input_engine_type').value || "interference",
      oem_interval_miles: parseFloat(document.getElementById('input_oem_interval_miles').value) || 90000,
      oem_interval_years: parseFloat(document.getElementById('input_oem_interval_years').value) || 7,
      current_odometer: parseFloat(document.getElementById('input_current_odometer').value) || 65000,
      last_replaced_odometer: parseFloat(document.getElementById('input_last_replaced_odometer').value) || 0,
      annual_miles: parseFloat(document.getElementById('input_annual_miles').value) || 12000,
      include_water_pump: document.getElementById('input_include_water_pump').value || "yes"
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

  function calculateBelt(inp) {
    var belt_miles_accumulated = inp.current_odometer - inp.last_replaced_odometer;
    var remaining_miles = inp.oem_interval_miles - belt_miles_accumulated;
    var service_due_odometer = inp.last_replaced_odometer + inp.oem_interval_miles;

    var months_remaining = (remaining_miles / Math.max(1, inp.annual_miles)) * 12.0;

    var base_labor = 650;
    var parts_cost = inp.include_water_pump === "yes" ? 140 : 60;
    var estimated_service_cost = base_labor + parts_cost;

    var risk_level = "";
    if (inp.engine_type === "interference") {
      if (remaining_miles <= 0) risk_level = "CRITICAL HIGH – Severe Risk of Engine Destruction ($4,500+)";
      else if (remaining_miles <= 5000) risk_level = "ELEVATED RISK – Schedule Service Immediately";
      else risk_level = "MODERATE – Monitor & Replace on Schedule";
    } else {
      if (remaining_miles <= 0) risk_level = "Overdue – Engine Will Stall When Snapped (Safe Stop)";
      else risk_level = "LOW / SAFE – Non-Interference Design";
    }

    return {
      remaining_miles: remaining_miles,
      months_remaining: months_remaining,
      service_due_odometer: service_due_odometer,
      estimated_service_cost: estimated_service_cost,
      risk_level: risk_level
    };
  }

  function updateTool() {
    var inp = getInputs();
    var res = calculateBelt(inp);

    setOutputText('output_remaining_miles', Math.round(res.remaining_miles).toLocaleString() + ' miles');
    setOutputText('output_months_remaining', res.months_remaining.toFixed(1) + ' months');
    setOutputText('output_service_due_odometer', Math.round(res.service_due_odometer).toLocaleString() + ' mi (Odometer)');
    setOutputText('output_estimated_service_cost', formatCurrency(res.estimated_service_cost));
    setOutputText('output_engine_failure_risk', res.risk_level);

    var repair_cost_if_snapped = inp.engine_type === "interference" ? 4500 : 250;

    var chartData = {
      labels: ['Preventative Service Cost', 'Engine Failure Repair Cost'],
      values: [parseFloat(res.estimated_service_cost.toFixed(2)), repair_cost_if_snapped]
    };

    updateCharts(chartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        remaining_miles: Math.round(res.remaining_miles) + ' mi',
        service_due_odometer: Math.round(res.service_due_odometer) + ' mi',
        engine_failure_risk: res.risk_level
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
          label: 'Cost Comparison ',
          data: data.values,
          backgroundColor: ['#4ade80', '#D95B43']
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
    document.getElementById('input_engine_type').value = "interference";
    document.getElementById('input_oem_interval_miles').value = 90000;
    document.getElementById('input_oem_interval_years').value = 7;
    document.getElementById('input_current_odometer').value = 65000;
    document.getElementById('input_last_replaced_odometer').value = 0;
    document.getElementById('input_annual_miles').value = 12000;
    document.getElementById('input_include_water_pump').value = "yes";
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
