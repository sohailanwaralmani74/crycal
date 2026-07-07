/* ═══════════════════════════════════════════════════════════
   CRYCAL — PMI Calculator
   Tool ID: pmi-calculator
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'timeline';

  // ── Get Inputs ──
  function getInputs() {
    return {
      homePrice: parseFloat(document.getElementById('input_homePrice').value) || 0,
      downPayment: parseFloat(document.getElementById('input_downPayment').value) || 0,
      pmiRate: parseFloat(document.getElementById('input_pmiRate').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      loanTerm: parseFloat(document.getElementById('input_loanTerm').value) || 0,
      propertyAppreciation: parseFloat(document.getElementById('input_propertyAppreciation').value) || 0
    };
  }

  // ── Calculate Monthly Payment ──
  function calculateMonthlyPayment(loanAmount, annualRate, loanTerm) {
    if (loanAmount <= 0 || annualRate < 0) return 0;
    var monthlyRate = annualRate / 100 / 12;
    var totalMonths = loanTerm * 12;
    if (monthlyRate === 0) return loanAmount / totalMonths;
    return loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  // ── Format Currency ──
  function formatCurrency(amount) {
    var code = getGlobalCurrency() || 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return getCurrencySymbol(code) + amount.toFixed(2);
    }
  }

  // ── Format Months ──
  function formatMonths(months) {
    if (months === Infinity || !isFinite(months) || months < 0) return '∞';
    if (months === 0) return '0 months';
    var y = Math.floor(months / 12);
    var m = months % 12;
    if (y === 0) return m + ' month' + (m !== 1 ? 's' : '');
    if (m === 0) return y + ' year' + (y !== 1 ? 's' : '');
    return y + ' year' + (y !== 1 ? 's' : '') + ' ' + m + ' month' + (m !== 1 ? 's' : '');
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    var loanAmount = inputs.homePrice - inputs.downPayment;
    if (loanAmount < 0) loanAmount = 0;

    // Monthly PMI
    var annualPMI = loanAmount * (inputs.pmiRate / 100);
    var monthlyPMI = annualPMI / 12;

    // Simulate loan balance over time
    var monthlyRate = inputs.interestRate / 100 / 12;
    var totalMonths = inputs.loanTerm * 12;
    var monthlyPayment = calculateMonthlyPayment(loanAmount, inputs.interestRate, inputs.loanTerm);

    var balance = loanAmount;
    var currentHomeValue = inputs.homePrice;
    var appreciationRate = inputs.propertyAppreciation / 100;

    var cancellationMonth = -1;
    var cancellationBalance = 0;
    var monthlyData = [];

    // Iterate month by month
    for (var month = 1; month <= totalMonths; month++) {
      // Interest for the month
      var interest = balance * monthlyRate;
      var principal = monthlyPayment - interest;
      if (principal > balance) principal = balance;
      balance = Math.max(0, balance - principal);

      // Update home value with appreciation
      if (appreciationRate > 0) {
        currentHomeValue = inputs.homePrice * Math.pow(1 + appreciationRate, month / 12);
      }

      // Check cancellation condition: LTV <= 80%
      var ltv = currentHomeValue > 0 ? (balance / currentHomeValue) * 100 : 100;
      if (cancellationMonth === -1 && ltv <= 80 && balance > 0) {
        cancellationMonth = month;
        cancellationBalance = balance;
      }

      monthlyData.push({
        month: month,
        balance: balance,
        homeValue: currentHomeValue,
        ltv: ltv,
        pmiPaid: monthlyPMI
      });

      if (balance <= 0) break;
    }

    // If no cancellation found, set to loan term or never
    if (cancellationMonth === -1) {
      cancellationMonth = Infinity;
      cancellationBalance = 0;
    }

    // Total PMI paid until cancellation
    var totalPMIPaid = 0;
    if (cancellationMonth !== Infinity) {
      totalPMIPaid = monthlyPMI * cancellationMonth;
    } else {
      totalPMIPaid = monthlyPMI * totalMonths;
    }

    // Outputs
    document.getElementById('output_loanAmount').querySelector('.output-number').textContent = formatCurrency(loanAmount);
    document.getElementById('output_monthlyPMI').querySelector('.output-number').textContent = formatCurrency(monthlyPMI);
    document.getElementById('output_annualPMI').querySelector('.output-number').textContent = formatCurrency(annualPMI);
    document.getElementById('output_totalPMIPaid').querySelector('.output-number').textContent = formatCurrency(totalPMIPaid);
    document.getElementById('output_cancellationMonths').querySelector('.output-number').textContent = formatMonths(cancellationMonth);
    document.getElementById('output_cancellationYears').querySelector('.output-number').textContent = cancellationMonth !== Infinity ? (cancellationMonth / 12).toFixed(1) + ' years' : 'Never';
    document.getElementById('output_cancellationBalance').querySelector('.output-number').textContent = formatCurrency(cancellationBalance);

    // ── Chart ──
    updateCharts({
      monthlyData: monthlyData,
      loanAmount: loanAmount,
      homePrice: inputs.homePrice,
      monthlyPMI: monthlyPMI,
      cancellationMonth: cancellationMonth,
      pmiRate: inputs.pmiRate
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        homePrice: inputs.homePrice,
        downPayment: inputs.downPayment,
        pmiRate: inputs.pmiRate,
        monthlyPMI: monthlyPMI,
        cancellationMonths: cancellationMonth !== Infinity ? cancellationMonth : 'Never'
      };
      window.logHistory(snapshot);
    }
    if (typeof window.renderPresetDropdown === 'function') {
      window.renderPresetDropdown();
    }
  }

  // ── Charts ──
  function updateCharts(data) {
    var ctx = document.getElementById('chartCanvas').getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    var chartData = generateChartData(currentTab, data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, data) {
    var currencySymbol = getCurrencySymbol(getGlobalCurrency() || 'USD');
    var monthlyData = data.monthlyData;

    if (tab === 'timeline') {
      if (!monthlyData || monthlyData.length === 0) {
        return {
          type: 'line',
          data: {
            labels: ['0'],
            datasets: [
              {
                label: 'Loan Balance',
                data: [data.loanAmount],
                borderColor: '#C08A2E',
                pointBackgroundColor: '#C08A2E'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'No data', font: { size: 14 } }
            }
          }
        };
      }

      var labels = monthlyData.map(function(d) { return d.month; });
      var balanceData = monthlyData.map(function(d) { return d.balance; });
      var homeValueData = monthlyData.map(function(d) { return d.homeValue; });
      var eightyPercentData = monthlyData.map(function(d) { return d.homeValue * 0.8; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Loan Balance',
              data: balanceData,
              borderColor: '#B23A3A',
              backgroundColor: 'rgba(178, 58, 58, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#B23A3A',
              pointRadius: 0
            },
            {
              label: 'Home Value',
              data: homeValueData,
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.05)',
              fill: false,
              tension: 0.3,
              borderDash: [5, 5],
              pointBackgroundColor: '#2F6F5E',
              pointRadius: 0
            },
            {
              label: '80% of Home Value (Cancellation Target)',
              data: eightyPercentData,
              borderColor: '#C08A2E',
              backgroundColor: 'rgba(192, 138, 46, 0.05)',
              fill: false,
              tension: 0.3,
              borderDash: [3, 3],
              pointBackgroundColor: '#C08A2E',
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'PMI Cancellation Timeline', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            },
            x: {
              title: { display: true, text: 'Month' }
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
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Reset Tool ──
  function resetTool() {
    document.getElementById('input_homePrice').value = 300000;
    document.getElementById('input_downPayment').value = 30000;
    document.getElementById('input_pmiRate').value = 0.5;
    document.getElementById('input_interestRate').value = 6.5;
    document.getElementById('input_loanTerm').value = 30;
    document.getElementById('input_propertyAppreciation').value = 3.0;
    if (typeof window.updateTool === 'function') window.updateTool();
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