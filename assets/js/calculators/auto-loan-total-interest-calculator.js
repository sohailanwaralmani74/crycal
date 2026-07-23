(function() {

  var chartInstance = null;
  var currentTab = 'interest_by_term';

  function getInputs() {
    return {
      loanAmount: parseFloat(document.getElementById('input_loanAmount').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0
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

  function calculateTermDetails(P, rate, n) {
    if (P <= 0 || n <= 0) return { payment: 0, interest: 0 };
    if (rate <= 0) return { payment: P / n, interest: 0 };

    var pmt = (P * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
    var intPaid = (pmt * n) - P;
    return { payment: pmt, interest: Math.max(0, intPaid) };
  }

  function calculateAllTerms(inputs) {
    var P = inputs.loanAmount;
    var rate = (inputs.interestRate / 100) / 12;

    var res36 = calculateTermDetails(P, rate, 36);
    var res48 = calculateTermDetails(P, rate, 48);
    var res60 = calculateTermDetails(P, rate, 60);
    var res72 = calculateTermDetails(P, rate, 72);
    var res84 = calculateTermDetails(P, rate, 84);

    return {
      res36: res36,
      res48: res48,
      res60: res60,
      res72: res72,
      res84: res84
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateAllTerms(inputs);

    setOutputText('output_interest36Months', formatCurrency(res.res36.interest));
    setOutputText('output_interest48Months', formatCurrency(res.res48.interest));
    setOutputText('output_interest60Months', formatCurrency(res.res60.interest));
    setOutputText('output_interest72Months', formatCurrency(res.res72.interest));
    setOutputText('output_interest84Months', formatCurrency(res.res84.interest));

    updateCharts(res, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        loanAmount: inputs.loanAmount,
        interestRate: inputs.interestRate,
        interest36Months: res.res36.interest,
        interest60Months: res.res60.interest,
        interest84Months: res.res84.interest
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
    var labels = ['36 Months', '48 Months', '60 Months', '72 Months', '84 Months'];

    if (tab === 'interest_by_term') {
      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total Interest Paid ',
            data: [
              Math.round(res.res36.interest),
              Math.round(res.res48.interest),
              Math.round(res.res60.interest),
              Math.round(res.res72.interest),
              Math.round(res.res84.interest)
            ],
            backgroundColor: ['#2E7D32', '#4A90D9', '#FFC107', '#E05A47', '#B71C1C'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Total Borrowing Interest Cost Across Loan Term Lengths' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: function(v) { return sym + v.toLocaleString(); } }
            }
          }
        }
      };
    } else if (tab === 'payment_by_term') {
      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Monthly Payment ',
            data: [
              Math.round(res.res36.payment),
              Math.round(res.res48.payment),
              Math.round(res.res60.payment),
              Math.round(res.res72.payment),
              Math.round(res.res84.payment)
            ],
            borderColor: '#4A90D9',
            backgroundColor: 'rgba(74, 144, 217, 0.15)',
            fill: true,
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Monthly Payment Curve Across Loan Term Lengths' }
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
