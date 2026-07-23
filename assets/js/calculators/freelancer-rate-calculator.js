(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var desiredIncome = parseFloat(document.getElementById('input_desiredIncome').value) || 0;
    var taxRate = parseFloat(document.getElementById('input_taxRate').value) || 0;
    var businessExpenses = parseFloat(document.getElementById('input_businessExpenses').value) || 0;
    var billableHoursPerWeek = parseFloat(document.getElementById('input_billableHoursPerWeek').value) || 0;
    var weeksPerYear = parseFloat(document.getElementById('input_weeksPerYear').value) || 0;
    var nonBillableHours = parseFloat(document.getElementById('input_nonBillableHours').value) || 0;
    var hourlyRate = parseFloat(document.getElementById('input_hourlyRate').value) || 0;
    var daysOff = parseFloat(document.getElementById('input_daysOff').value) || 0;

    return {
      desiredIncome: desiredIncome,
      taxRate: taxRate / 100,
      businessExpenses: businessExpenses,
      billableHoursPerWeek: billableHoursPerWeek,
      weeksPerYear: weeksPerYear,
      nonBillableHours: nonBillableHours,
      hourlyRate: hourlyRate,
      daysOff: daysOff
    };
  }

  // ── Format Currency ──
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

  function formatPercent(value) {
    if (value === undefined || value === null || isNaN(value)) return '—';
    return (value * 100).toFixed(1) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  // ── Core Calculation ──
  function calculateFreelancerRate(inputs) {
    var desiredIncome = inputs.desiredIncome;
    var taxRate = inputs.taxRate;
    var expenses = inputs.businessExpenses;
    var billableHrsWeek = inputs.billableHoursPerWeek;
    var weeks = inputs.weeksPerYear;
    var nonBillableHrs = inputs.nonBillableHours;
    var hourlyRate = inputs.hourlyRate;
    var daysOff = inputs.daysOff;

    if (desiredIncome <= 0 && hourlyRate <= 0) {
      return { error: 'Enter desired income or hourly rate' };
    }

    // ── Hours Calculation ──
    var billableHoursPerYear = billableHrsWeek * weeks;
    var nonBillableHoursPerYear = nonBillableHrs * weeks;
    var totalHoursPerYear = (billableHrsWeek + nonBillableHrs) * weeks;

    if (billableHoursPerYear <= 0) {
      return { error: 'Enter valid billable hours' };
    }

    // ── Rate from Income ──
    var preTaxIncome = desiredIncome / (1 - taxRate);
    var totalRevenue = preTaxIncome + expenses;
    var recommendedRate = totalRevenue / billableHoursPerYear;

    // ── Income from Rate ──
    var projectedRevenue = 0;
    var projectedPreTax = 0;
    var projectedTakeHome = 0;
    var projectedTax = 0;

    if (hourlyRate > 0) {
      projectedRevenue = hourlyRate * billableHoursPerYear;
      projectedPreTax = projectedRevenue - expenses;
      projectedTax = projectedPreTax * taxRate;
      projectedTakeHome = projectedPreTax - projectedTax;
    }

    // ── Data for Charts ──
    var timeData = {
      'Billable Hours': billableHoursPerYear,
      'Non-Billable Hours': nonBillableHoursPerYear
    };

    var rateData = {
      'Hourly Rate': hourlyRate > 0 ? hourlyRate : recommendedRate,
      'Total Revenue': hourlyRate > 0 ? projectedRevenue : totalRevenue,
      'Pre-Tax Income': hourlyRate > 0 ? projectedPreTax : preTaxIncome,
      'Take-Home Income': hourlyRate > 0 ? projectedTakeHome : desiredIncome
    };

    return {
      preTaxIncome: preTaxIncome,
      totalRevenue: totalRevenue,
      recommendedRate: recommendedRate,
      annualTakeHome: desiredIncome,
      totalHoursPerYear: totalHoursPerYear,
      billableHoursPerYear: billableHoursPerYear,
      nonBillableHoursPerYear: nonBillableHoursPerYear,
      projectedRevenue: projectedRevenue,
      projectedPreTax: projectedPreTax,
      projectedTakeHome: projectedTakeHome,
      projectedTax: projectedTax,
      timeData: timeData,
      rateData: rateData,
      error: null
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.desiredIncome <= 0 && inputs.hourlyRate <= 0) {
      setOutputText('output_preTaxIncome', '—');
      setOutputText('output_totalRevenue', '—');
      setOutputText('output_recommendedRate', '—');
      setOutputText('output_annualTakeHome', '—');
      setOutputText('output_totalHoursPerYear', '—');
      setOutputText('output_billableHoursPerYear', '—');
      setOutputText('output_nonBillableHoursPerYear', '—');
      setOutputText('output_hourlyBreakdown', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateFreelancerRate(inputs);

    if (result.error) {
      setOutputText('output_preTaxIncome', '—');
      setOutputText('output_totalRevenue', '—');
      setOutputText('output_recommendedRate', '—');
      setOutputText('output_annualTakeHome', '—');
      setOutputText('output_totalHoursPerYear', '—');
      setOutputText('output_billableHoursPerYear', '—');
      setOutputText('output_nonBillableHoursPerYear', '—');
      setOutputText('output_hourlyBreakdown', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_preTaxIncome', formatCurrency(result.preTaxIncome));
    setOutputText('output_totalRevenue', formatCurrency(result.totalRevenue));
    setOutputText('output_recommendedRate', formatCurrency(result.recommendedRate));
    setOutputText('output_annualTakeHome', formatCurrency(result.annualTakeHome));
    setOutputText('output_totalHoursPerYear', result.totalHoursPerYear.toFixed(0) + ' hours');
    setOutputText('output_billableHoursPerYear', result.billableHoursPerYear.toFixed(0) + ' hours');
    setOutputText('output_nonBillableHoursPerYear', result.nonBillableHoursPerYear.toFixed(0) + ' hours');

    // ── Hourly Breakdown ──
    var breakdown = '';
    if (inputs.hourlyRate > 0) {
      breakdown = 'At $' + inputs.hourlyRate.toFixed(2) + '/hr → ';
      breakdown += 'Revenue: ' + formatCurrency(result.projectedRevenue) + ' | ';
      breakdown += 'Tax: ' + formatCurrency(result.projectedTax) + ' | ';
      breakdown += 'Take-Home: ' + formatCurrency(result.projectedTakeHome);
    } else {
      breakdown = 'To earn ' + formatCurrency(inputs.desiredIncome) + ' take-home → ';
      breakdown += 'Need $' + result.recommendedRate.toFixed(2) + '/hr';
    }
    setOutputText('output_hourlyBreakdown', breakdown);

    var chartPayload = {
      timeData: result.timeData,
      rateData: result.rateData,
      hourlyRate: inputs.hourlyRate,
      recommendedRate: result.recommendedRate,
      desiredIncome: inputs.desiredIncome
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        desiredIncome: inputs.desiredIncome,
        taxRate: inputs.taxRate * 100,
        recommendedRate: result.recommendedRate,
        annualTakeHome: result.annualTakeHome
      });
    }
  }

  // ── Charts ──
  function updateCharts(data) {
    var ctx = document.getElementById('chartCanvas');
    if (!ctx) return;
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    var chartData = generateChartData(currentTab, data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, data) {
    if (!data) return null;

    if (tab === 'breakdown') {
      var labels = Object.keys(data.timeData);
      var values = Object.values(data.timeData);

      return {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: ['#4A90D9', '#D95B43'],
            borderColor: ['#3a7b8c', '#B84A32'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#e8edf0',
                font: { size: 10 }
              }
            },
            title: {
              display: true,
              text: 'Time Breakdown (Hours/Year)',
              font: { size: 14, color: '#e8edf0' }
            }
          }
        }
      };
    }

    if (tab === 'comparison') {
      var labels = ['Hourly Rate', 'Total Revenue', 'Pre-Tax Income', 'Take-Home'];
      var values = Object.values(data.rateData);

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Amount',
            data: values,
            backgroundColor: ['#4A90D9', '#D95B43', '#fbbf24', '#4ade80'],
            borderColor: ['#3a7b8c', '#B84A32', '#d4a030', '#3a9b6c'],
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Rate Analysis',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#8899aa',
                font: { size: 9 },
                callback: function(v) {
                  try {
                    var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
                    return new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: currencyCode,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(v);
                  } catch (e) {
                    return '$' + v.toFixed(0);
                  }
                }
              }
            },
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8899aa', font: { size: 9 } }
            }
          }
        }
      };
    }

    return null;
  }

  // ── Switch Chart Tab ──
  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) {
      updateCharts(lastChartData);
    } else {
      updateTool();
    }
  }

  // ── Reset Tool ──
  function resetTool() {
    document.getElementById('input_desiredIncome').value = 80000;
    document.getElementById('input_taxRate').value = 25.0;
    document.getElementById('input_businessExpenses').value = 5000;
    document.getElementById('input_billableHoursPerWeek').value = 30;
    document.getElementById('input_weeksPerYear').value = 48;
    document.getElementById('input_nonBillableHours').value = 10;
    document.getElementById('input_hourlyRate').value = 0;
    document.getElementById('input_daysOff').value = 20;
    updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Initialise ──
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });

    setTimeout(function() {
      if (typeof window.updateTool === 'function') window.updateTool();
    }, 150);

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });

})();