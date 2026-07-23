(function() {

  var chartInstance = null;
  var currentTab = 'cost_comparison';

  function getInputs() {
    return {
      warrantyPrice: parseFloat(document.getElementById('input_warrantyPrice').value) || 0,
      warrantyDurationYears: parseInt(document.getElementById('input_warrantyDurationYears').value, 10) || 4,
      deductiblePerVisit: parseFloat(document.getElementById('input_deductiblePerVisit').value) || 0,
      estimatedAnnualRepairs: parseFloat(document.getElementById('input_estimatedAnnualRepairs').value) || 0,
      vehicleReliabilityTier: document.getElementById('input_vehicleReliabilityTier').value
    };
  }

  function formatCurrency(amount) {
    var code = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
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

  function calculateWarranty(inputs) {
    var P = inputs.warrantyPrice;
    var Y = inputs.warrantyDurationYears;
    var D = inputs.deductiblePerVisit;
    var R = inputs.estimatedAnnualRepairs;
    var rel = inputs.vehicleReliabilityTier;

    var relFactor = 1.0;
    if (rel === 'high') relFactor = 0.70;
    else if (rel === 'low') relFactor = 1.40;

    var visitsPerYear = 1.25 * relFactor;
    var totalVisits = Math.round(visitsPerYear * Y);
    var totalDeductibles = totalVisits * D;

    var totalWarrantyCost = P + totalDeductibles;
    var totalExpectedRepairs = R * Y * relFactor;
    var netValue = totalExpectedRepairs - totalWarrantyCost;

    var verdict = '';
    if (netValue > 300) {
      verdict = 'Good Value (Saves ' + formatCurrency(netValue) + ')';
    } else if (netValue >= -300) {
      verdict = 'Neutral / Marginally Overpriced';
    } else {
      verdict = 'Overpriced (Self-Insure & Save ' + formatCurrency(Math.abs(netValue)) + ')';
    }

    return {
      totalWarrantyCost: totalWarrantyCost,
      totalEstimatedOutofPocket: totalExpectedRepairs,
      netFinancialValue: netValue,
      financialVerdict: verdict
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateWarranty(inputs);

    setOutputText('output_totalWarrantyCost', formatCurrency(res.totalWarrantyCost));
    setOutputText('output_totalEstimatedOutofPocket', formatCurrency(res.totalEstimatedOutofPocket));
    setOutputText('output_netFinancialValue', formatCurrency(res.netFinancialValue));
    setOutputText('output_financialVerdict', res.financialVerdict);

    updateCharts(res, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        warrantyPrice: inputs.warrantyPrice,
        warrantyDurationYears: inputs.warrantyDurationYears,
        deductiblePerVisit: inputs.deductiblePerVisit,
        totalWarrantyCost: res.totalWarrantyCost,
        totalEstimatedOutofPocket: res.totalEstimatedOutofPocket,
        netFinancialValue: res.netFinancialValue
      });
    }
  }

  function updateCharts(res, inputs) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    var chartData = generateChartData(currentTab, res, inputs);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, res, inputs) {
    var sym = (typeof getCurrencySymbol === 'function') ? getCurrencySymbol(getGlobalCurrency() || 'USD') : '$';

    if (tab === 'cost_comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Total Warranty Cost (Price + Deductibles)', 'Expected Repair Bills (Without Warranty)'],
          datasets: [{
            label: 'Total Financial Cost ',
            data: [
              Math.round(res.totalWarrantyCost),
              Math.round(res.totalEstimatedOutofPocket)
            ],
            backgroundColor: ['#E05A47', '#4A90D9'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Total Extended Warranty Cost vs Out-of-Pocket Repair Expense' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: function(v) { return sym + v.toLocaleString(); } }
            }
          }
        }
      };
    } else if (tab === 'annual_breakdown') {
      var Y = inputs.warrantyDurationYears;
      var labels = [];
      var warrantyCum = [];
      var repairCum = [];

      var annualWarrantyAvg = res.totalWarrantyCost / Y;
      var annualRepairAvg = res.totalEstimatedOutofPocket / Y;

      for (var i = 1; i <= Y; i++) {
        labels.push('Year ' + i);
        warrantyCum.push(Math.round(annualWarrantyAvg * i));
        repairCum.push(Math.round(annualRepairAvg * i));
      }

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Cumulative Warranty Expense',
              data: warrantyCum,
              borderColor: '#E05A47',
              backgroundColor: 'rgba(224, 90, 71, 0.1)',
              fill: true,
              tension: 0.2
            },
            {
              label: 'Cumulative Out-of-Pocket Repair Expense',
              data: repairCum,
              borderColor: '#4A90D9',
              backgroundColor: 'rgba(74, 144, 217, 0.1)',
              fill: true,
              tension: 0.2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Cumulative Financial Exposure Over Coverage Duration' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: function(v) { return sym + v.toLocaleString(); } }
            }
          }
        }
      };
    }

    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    updateTool();
  }

  function resetTool() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var def = el.dataset.default || el.getAttribute('value') || '';
      if (def) el.value = def;
    });
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
