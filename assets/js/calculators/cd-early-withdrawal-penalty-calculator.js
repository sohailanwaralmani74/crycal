(function() {
  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  function getInputs() {
    var depositAmount = parseFloat(document.getElementById('input_depositAmount').value) || 0;
    var termMonths = parseFloat(document.getElementById('input_termMonths').value) || 0;
    var interestRate = parseFloat(document.getElementById('input_interestRate').value) || 0;
    var withdrawalMonth = parseFloat(document.getElementById('input_withdrawalMonth').value) || 0;
    var penaltyMonths = parseFloat(document.getElementById('input_penaltyMonths').value) || 0;

    return {
      depositAmount: depositAmount,
      termMonths: termMonths,
      interestRate: interestRate / 100,
      withdrawalMonth: withdrawalMonth,
      penaltyMonths: penaltyMonths
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

  function formatPercent(value) {
    if (value === undefined || value === null || isNaN(value)) return '—';
    return (value * 100).toFixed(2) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateCDPenalty(inputs) {
    var deposit = inputs.depositAmount;
    var term = inputs.termMonths;
    var rate = inputs.interestRate;
    var withdrawal = inputs.withdrawalMonth;
    var penalty = inputs.penaltyMonths;

    if (deposit <= 0 || term <= 0 || rate < 0) {
      return { error: 'Enter valid values' };
    }

    var totalInterest = deposit * rate * (term / 12);
    var penaltyAmount = 0;
    var penaltyInterest = 0;

    if (withdrawal < term && withdrawal > 0) {
      penaltyAmount = (deposit * rate * penalty) / 12;
      penaltyInterest = (deposit * rate * (term - withdrawal)) / 12;
    } else if (withdrawal >= term) {
      penaltyAmount = 0;
    }

    var netProceeds = deposit + totalInterest - penaltyAmount;

    var effectiveRate = 0;
    if (withdrawal > 0 && withdrawal < term) {
      effectiveRate = ((deposit + totalInterest - penaltyAmount) / deposit - 1) / (withdrawal / 12);
    } else if (withdrawal >= term) {
      effectiveRate = rate;
    }

    var chartData = {
      'Deposit': deposit,
      'Total Interest': totalInterest,
      'Penalty': penaltyAmount,
      'Net Proceeds': netProceeds
    };

    return {
      totalInterest: totalInterest,
      penaltyAmount: penaltyAmount,
      penaltyInterest: penaltyInterest,
      netProceeds: netProceeds,
      effectiveRate: effectiveRate,
      chartData: chartData,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();

    if (inputs.depositAmount <= 0 || inputs.termMonths <= 0) {
      setOutputText('output_totalInterest', '—');
      setOutputText('output_penaltyAmount', '—');
      setOutputText('output_penaltyInterest', '—');
      setOutputText('output_netProceeds', '—');
      setOutputText('output_effectiveRate', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateCDPenalty(inputs);

    if (result.error) {
      setOutputText('output_totalInterest', '—');
      setOutputText('output_penaltyAmount', '—');
      setOutputText('output_penaltyInterest', '—');
      setOutputText('output_netProceeds', '—');
      setOutputText('output_effectiveRate', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_totalInterest', formatCurrency(result.totalInterest));
    setOutputText('output_penaltyAmount', formatCurrency(result.penaltyAmount));
    setOutputText('output_penaltyInterest', formatCurrency(result.penaltyInterest));
    setOutputText('output_netProceeds', formatCurrency(result.netProceeds));
    setOutputText('output_effectiveRate', formatPercent(result.effectiveRate));

    var chartPayload = {
      chartData: result.chartData
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);
  }

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
    if (!data || !data.chartData) return null;

    if (tab === 'breakdown') {
      var labels = Object.keys(data.chartData);
      var values = Object.values(data.chartData);

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Amount',
            data: values,
            backgroundColor: ['#4A90D9', '#4ade80', '#D95B43', '#fbbf24'],
            borderColor: ['#3a7b8c', '#3a9b6c', '#B84A32', '#d4a030'],
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'CD Penalty Breakdown', font: { size: 14, color: '#e8edf0' } }
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

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) {
      updateCharts(lastChartData);
    } else {
      updateTool();
    }
  }

  function resetTool() {
    document.getElementById('input_depositAmount').value = 10000;
    document.getElementById('input_termMonths').value = 12;
    document.getElementById('input_interestRate').value = 4.50;
    document.getElementById('input_withdrawalMonth').value = 6;
    document.getElementById('input_penaltyMonths').value = 3;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

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