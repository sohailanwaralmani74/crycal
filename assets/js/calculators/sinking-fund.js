/* ═══════════════════════════════════════════════════════════
   CRYCAL — Sinking Fund Calculator
   Tool ID: sinking-fund
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'growth';

  // ── Get Inputs ──
  function getInputs() {
    return {
      targetAmount: parseFloat(document.getElementById('input_targetAmount').value) || 0,
      currentSavings: parseFloat(document.getElementById('input_currentSavings').value) || 0,
      timeYears: parseFloat(document.getElementById('input_timeYears').value) || 0,
      annualReturn: parseFloat(document.getElementById('input_annualReturn').value) || 0,
      contributionFrequency: document.getElementById('input_contributionFrequency').value || 'monthly',
      compoundingFrequency: document.getElementById('input_compoundingFrequency').value || 'monthly'
    };
  }

  // ── Get periods per year ──
  function getPeriodsPerYear(frequency) {
    var map = {
      'monthly': 12,
      'quarterly': 4,
      'yearly': 1
    };
    return map[frequency] || 12;
  }

  // ── Get compounding periods per year ──
  function getCompoundsPerYear(frequency) {
    var map = {
      'daily': 365,
      'monthly': 12,
      'quarterly': 4,
      'semi-annually': 2,
      'annually': 1
    };
    return map[frequency] || 12;
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

  // ── Calculate Required Contribution ──
  function calculateContribution(target, current, years, annualReturn, periodsPerYear, compPerYear) {
    if (years <= 0) return { contribution: 0, totalContributions: 0, totalInterest: 0, growthData: [] };

    var n = periodsPerYear * years;
    var r = annualReturn / 100 / compPerYear;
    var totalPeriods = Math.floor(n);
    var monthlyRate = Math.pow(1 + r, compPerYear / periodsPerYear) - 1;

    // Future value of current savings
    var fvCurrent = current * Math.pow(1 + monthlyRate, totalPeriods);

    // Required payment: PMT = (target - fvCurrent) * r / ((1+r)^n - 1)
    var payment = 0;
    if (totalPeriods > 0 && monthlyRate > 0) {
      payment = (target - fvCurrent) * monthlyRate / (Math.pow(1 + monthlyRate, totalPeriods) - 1);
    } else if (totalPeriods > 0 && monthlyRate === 0) {
      payment = (target - current) / totalPeriods;
    }

    var totalContributions = payment * totalPeriods;
    var totalInterest = target - current - totalContributions;

    // Generate growth data
    var growthData = [];
    var balance = current;
    var step = Math.max(1, Math.floor(totalPeriods / 50));
    for (var i = 0; i <= totalPeriods; i += step) {
      var fv = current * Math.pow(1 + monthlyRate, i);
      var contrib = payment * (Math.pow(1 + monthlyRate, i) - 1) / monthlyRate;
      if (monthlyRate === 0) contrib = payment * i;
      balance = fv + contrib;
      growthData.push({
        period: i,
        balance: balance,
        contributions: current + payment * i,
        interest: balance - (current + payment * i)
      });
    }
    // Ensure final point is included
    if (growthData.length > 0 && growthData[growthData.length - 1].period < totalPeriods) {
      var finalBalance = current * Math.pow(1 + monthlyRate, totalPeriods);
      var finalContrib = payment * (Math.pow(1 + monthlyRate, totalPeriods) - 1) / monthlyRate;
      if (monthlyRate === 0) finalContrib = payment * totalPeriods;
      finalBalance += finalContrib;
      growthData.push({
        period: totalPeriods,
        balance: finalBalance,
        contributions: current + payment * totalPeriods,
        interest: finalBalance - (current + payment * totalPeriods)
      });
    }

    return {
      contribution: payment,
      totalContributions: totalContributions,
      totalInterest: totalInterest,
      growthData: growthData,
      totalPeriods: totalPeriods
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();
    var periodsPerYear = getPeriodsPerYear(inputs.contributionFrequency);
    var compPerYear = getCompoundsPerYear(inputs.compoundingFrequency);

    var result = calculateContribution(
      inputs.targetAmount,
      inputs.currentSavings,
      inputs.timeYears,
      inputs.annualReturn,
      periodsPerYear,
      compPerYear
    );

    var requiredContribution = result.contribution;
    var totalContributions = result.totalContributions;
    var totalInterest = result.totalInterest;

    // Target date
    var today = new Date();
    var targetDate = new Date(today);
    targetDate.setFullYear(today.getFullYear() + Math.floor(inputs.timeYears));
    targetDate.setMonth(today.getMonth() + Math.round((inputs.timeYears % 1) * 12));

    // ── Update Outputs ──
    var freqLabel = inputs.contributionFrequency.charAt(0).toUpperCase() + inputs.contributionFrequency.slice(1);
    document.getElementById('output_requiredContribution').querySelector('.output-number').textContent = formatCurrency(requiredContribution) + ' / ' + inputs.contributionFrequency;
    document.getElementById('output_totalContributions').querySelector('.output-number').textContent = formatCurrency(totalContributions);
    document.getElementById('output_totalInterest').querySelector('.output-number').textContent = formatCurrency(totalInterest);
    document.getElementById('output_targetDate').querySelector('.output-number').textContent = targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // ── Charts ──
    updateCharts({
      growthData: result.growthData,
      requiredContribution: requiredContribution,
      totalContributions: totalContributions,
      totalInterest: totalInterest,
      targetAmount: inputs.targetAmount
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        targetAmount: inputs.targetAmount,
        currentSavings: inputs.currentSavings,
        timeYears: inputs.timeYears,
        requiredContribution: requiredContribution,
        totalContributions: totalContributions,
        totalInterest: totalInterest
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
    var growthData = data.growthData;

    if (tab === 'growth') {
      if (!growthData || growthData.length === 0) {
        return {
          type: 'line',
          data: {
            labels: ['0'],
            datasets: [
              {
                label: 'Balance',
                data: [0],
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

      var labels = growthData.map(function(d) { return d.period; });
      var balanceData = growthData.map(function(d) { return d.balance; });
      var contribData = growthData.map(function(d) { return d.contributions; });
      var interestData = growthData.map(function(d) { return d.interest; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Total Balance',
              data: balanceData,
              borderColor: '#C08A2E',
              backgroundColor: 'rgba(192, 138, 46, 0.1)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#C08A2E',
              pointRadius: 0
            },
            {
              label: 'Total Contributions',
              data: contribData,
              borderColor: '#2F6F5E',
              backgroundColor: 'rgba(47, 111, 94, 0.05)',
              fill: false,
              tension: 0.3,
              borderDash: [5, 5],
              pointBackgroundColor: '#2F6F5E',
              pointRadius: 0
            },
            {
              label: 'Interest Earned',
              data: interestData,
              borderColor: '#B23A3A',
              backgroundColor: 'rgba(178, 58, 58, 0.05)',
              fill: false,
              tension: 0.3,
              borderDash: [3, 3],
              pointBackgroundColor: '#B23A3A',
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Sinking Fund Growth', font: { size: 14 } }
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
              title: { display: true, text: 'Period' }
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
    document.getElementById('input_targetAmount').value = 10000;
    document.getElementById('input_currentSavings').value = 0;
    document.getElementById('input_timeYears').value = 2;
    document.getElementById('input_annualReturn').value = 4.0;
    document.getElementById('input_contributionFrequency').value = 'monthly';
    document.getElementById('input_compoundingFrequency').value = 'monthly';
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