(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      homePrice: parseFloat(document.getElementById('input_homePrice').value) || 0,
      downPaymentPercent: parseFloat(document.getElementById('input_downPaymentPercent').value) || 3.5,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      loanTermYears: parseFloat(document.getElementById('input_loanTermYears').value) || 30,
      annualMipRate: parseFloat(document.getElementById('input_annualMipRate').value) || 0.55
    };
  }

  function formatCurrencyLocal(amount) {
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

  function calculateResults(inputs) {
    var hp = inputs.homePrice;
    var dp = hp * (inputs.downPaymentPercent / 100);
    var baseLoan = Math.max(0, hp - dp);
    var upfrontMip = baseLoan * 0.0175;
    var totalFinanced = baseLoan + upfrontMip;

    var r = (inputs.interestRate / 100) / 12;
    var n = inputs.loanTermYears * 12;

    if (totalFinanced <= 0 || r <= 0 || n <= 0) return null;

    var monthlyPi = (totalFinanced * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    var monthlyMip = (baseLoan * (inputs.annualMipRate / 100)) / 12;
    var totalMonthly = monthlyPi + monthlyMip;

    return {
      upfrontMip: upfrontMip,
      totalFinanced: totalFinanced,
      monthlyPi: monthlyPi,
      monthlyMip: monthlyMip,
      totalMonthly: totalMonthly,
      baseLoan: baseLoan
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_upfrontMipAmount', formatCurrencyLocal(result.upfrontMip));
    setOutputText('output_totalFinancedBalance', formatCurrencyLocal(result.totalFinanced));
    setOutputText('output_monthlyPrincipalInterest', formatCurrencyLocal(result.monthlyPi));
    setOutputText('output_monthlyMipPayment', formatCurrencyLocal(result.monthlyMip));
    setOutputText('output_totalMonthlyPayment', formatCurrencyLocal(result.totalMonthly));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        homePrice: inputs.homePrice,
        downPaymentPercent: inputs.downPaymentPercent,
        interestRate: inputs.interestRate,
        upfrontMipAmount: result.upfrontMip,
        monthlyMipPayment: result.monthlyMip,
        totalMonthlyPayment: result.totalMonthly
      });
    }
  }

  function updateCharts(result, inputs) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    var data = generateChartData(currentTab, result, inputs);
    if (!data) return;
    chartInstance = new Chart(ctx, data);
  }

  function generateChartData(tab, result, inputs) {
    if (tab === 'breakdown') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Principal & Interest (P&I)', 'Monthly FHA MIP'],
          datasets: [{
            data: [result.monthlyPi, result.monthlyMip],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Monthly FHA Payment Breakdown' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'lifetime') {
      var totalPi = result.monthlyPi * inputs.loanTermYears * 12;
      var totalMip = result.monthlyMip * inputs.loanTermYears * 12;
      return {
        type: 'bar',
        data: {
          labels: ['Total 30-Year Payment'],
          datasets: [
            {
              label: 'Base Principal & Interest',
              data: [totalPi],
              backgroundColor: '#2F6F5E'
            },
            {
              label: 'Total FHA MIP (Upfront + Monthly)',
              data: [totalMip + result.upfrontMip],
              backgroundColor: '#C08A2E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Lifetime Principal vs MIP Insurance Costs' }
          },
          scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
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

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', updateTool);
    }
  });

})();
