(function() {

  var chartInstance = null;
  var currentTab = 'maturity';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var targetAmount = parseFloat(document.getElementById('input_targetAmount').value) || 0;
    var numRungs = parseInt(document.getElementById('input_numRungs').value) || 5;
    var ladderLength = parseInt(document.getElementById('input_ladderLength').value) || 60;
    var initialDeposit = parseFloat(document.getElementById('input_initialDeposit').value) || 0;
    var monthlyContribution = parseFloat(document.getElementById('input_monthlyContribution').value) || 0;
    var cdRate = parseFloat(document.getElementById('input_cdRate').value) || 0;

    return {
      targetAmount: targetAmount,
      numRungs: numRungs,
      ladderLength: ladderLength,
      initialDeposit: initialDeposit,
      monthlyContribution: monthlyContribution,
      cdRate: cdRate / 100
    };
  }

  // ── Format Currency ──
  function formatCurrency(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(0);
    }
  }

  function formatCurrencyFull(amount) {
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

  // ── Core Calculation ──
  function calculateCDLadder(inputs) {
    var targetAmount = inputs.targetAmount;
    var numRungs = inputs.numRungs;
    var ladderLength = inputs.ladderLength;
    var initialDeposit = inputs.initialDeposit;
    var monthlyContribution = inputs.monthlyContribution;
    var annualRate = inputs.cdRate;

    if (targetAmount <= 0 && initialDeposit === 0 && monthlyContribution === 0) {
      return { error: 'Enter an amount to invest or monthly contribution' };
    }

    // Calculate terms for each rung
    var termMonths = [];
    var step = ladderLength / numRungs;
    for (var i = 0; i < numRungs; i++) {
      termMonths.push(Math.round((i + 1) * step));
    }

    // Calculate total invested (initial + monthly contributions over ladder length)
    var monthlyPeriods = ladderLength;
    var totalInvested = initialDeposit + (monthlyContribution * monthlyPeriods);

    // Use target amount if provided and initial+monthly is less
    if (targetAmount > totalInvested) {
      totalInvested = targetAmount;
    } else if (targetAmount > 0 && totalInvested > targetAmount) {
      totalInvested = targetAmount;
    }

    // Distribute funds across rungs
    var rungAmount = totalInvested / numRungs;
    var annualRateDecimal = annualRate;

    // Calculate each rung
    var rungs = [];
    var totalInterest = 0;

    for (var i = 0; i < numRungs; i++) {
      var months = termMonths[i];
      var years = months / 12;
      var amount = rungAmount;

      // Simple interest compounding daily
      var n = 365; // daily compounding
      var rate = annualRateDecimal / n;
      var periods = n * years;
      var maturityValue = amount * Math.pow(1 + rate, periods);
      var interest = maturityValue - amount;

      totalInterest += interest;

      rungs.push({
        rung: i + 1,
        term: months,
        years: years,
        amount: amount,
        interest: interest,
        maturityValue: maturityValue,
        maturityDate: months + ' months'
      });
    }

    // Weighted average rate (same as input rate since all rungs use the same rate)
    var weightedAvgRate = annualRate;

    // Generate maturity schedule data for chart
    var scheduleData = [];
    for (var i = 0; i < rungs.length; i++) {
      scheduleData.push({
        label: 'Rung ' + (i + 1) + ' (' + rungs[i].term + ' mo)',
        amount: rungs[i].amount,
        interest: rungs[i].interest,
        maturityValue: rungs[i].maturityValue
      });
    }

    return {
      rungs: rungs,
      totalInvested: totalInvested,
      totalInterest: totalInterest,
      totalMatured: totalInvested + totalInterest,
      weightedAvgRate: weightedAvgRate,
      scheduleData: scheduleData,
      annualRate: annualRate
    };
  }

  // ── Render Ladder Schedule ──
  function renderLadderSchedule(rungs) {
    var container = document.getElementById('output_ladderSchedule');
    if (!container) return;

    if (!rungs || rungs.length === 0) {
      container.textContent = '—';
      return;
    }

    // Build table
    var html = '<div class="table-responsive"><table class="ladder-table"><thead><tr>';
    html += '<th>Rung</th><th>Term</th><th>Amount</th><th>Interest</th><th>Maturity Value</th><th>Matures</th>';
    html += '</tr></thead><tbody>';

    for (var i = 0; i < rungs.length; i++) {
      var r = rungs[i];
      html += '<tr>';
      html += '<td><strong>#' + r.rung + '</strong></td>';
      html += '<td>' + r.term + ' months</td>';
      html += '<td>' + formatCurrency(r.amount) + '</td>';
      html += '<td style="color:#4ade80;">+' + formatCurrency(r.interest) + '</td>';
      html += '<td>' + formatCurrency(r.maturityValue) + '</td>';
      html += '<td>' + r.maturityDate + '</td>';
      html += '</tr>';
    }

    html += '</tbody></table></div>';

    // Add total row
    var totalInvested = rungs.reduce(function(sum, r) { return sum + r.amount; }, 0);
    var totalInterest = rungs.reduce(function(sum, r) { return sum + r.interest; }, 0);
    var totalMatured = totalInvested + totalInterest;

    html += '<div class="ladder-total" style="margin-top:0.75rem;padding-top:0.75rem;border-top:2px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;font-weight:600;">';
    html += '<span>Total</span>';
    html += '<span>' + formatCurrency(totalInvested) + ' → ' + formatCurrency(totalMatured) + ' (' + formatCurrency(totalInterest) + ' interest)</span>';
    html += '</div>';

    container.innerHTML = html;
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.targetAmount <= 0 && inputs.initialDeposit === 0 && inputs.monthlyContribution === 0) {
      setOutputText('output_totalInvested', '—');
      setOutputText('output_totalInterest', '—');
      setOutputText('output_totalMatured', '—');
      setOutputText('output_weightedAvgRate', '—');
      renderLadderSchedule(null);
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateCDLadder(inputs);

    if (result.error) {
      setOutputText('output_totalInvested', '—');
      setOutputText('output_totalInterest', '—');
      setOutputText('output_totalMatured', '—');
      setOutputText('output_weightedAvgRate', '—');
      renderLadderSchedule(null);
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_totalInvested', formatCurrency(result.totalInvested));
    setOutputText('output_totalInterest', formatCurrency(result.totalInterest));
    setOutputText('output_totalMatured', formatCurrency(result.totalMatured));
    setOutputText('output_weightedAvgRate', (result.weightedAvgRate * 100).toFixed(2) + '%');

    renderLadderSchedule(result.rungs);

    var chartPayload = {
      scheduleData: result.scheduleData,
      totalInvested: result.totalInvested,
      totalInterest: result.totalInterest,
      totalMatured: result.totalMatured,
      annualRate: result.annualRate,
      rungs: result.rungs
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        targetAmount: inputs.targetAmount,
        numRungs: inputs.numRungs,
        ladderLength: inputs.ladderLength,
        cdRate: inputs.cdRate * 100,
        totalInterest: result.totalInterest,
        totalMatured: result.totalMatured
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
    if (!data || !data.scheduleData || data.scheduleData.length === 0) return null;

    if (tab === 'maturity') {
      var labels = data.scheduleData.map(function(d) { return d.label; });
      var amounts = data.scheduleData.map(function(d) { return d.amount; });
      var interests = data.scheduleData.map(function(d) { return d.interest; });

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Principal',
            data: amounts,
            backgroundColor: '#4A90D9',
            borderColor: '#3a7b8c',
            borderWidth: 1,
            borderRadius: 4
          }, {
            label: 'Interest Earned',
            data: interests,
            backgroundColor: '#4ade80',
            borderColor: '#3a9b6c',
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#e8edf0',
                font: { size: 10 }
              }
            },
            title: {
              display: true,
              text: 'CD Ladder Maturity Schedule',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8899aa', font: { size: 9 } }
            },
            y: {
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
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      };
    }

    if (tab === 'breakdown') {
      var labels = ['Principal', 'Total Interest'];
      var values = [data.totalInvested, data.totalInterest];

      return {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: ['#4A90D9', '#4ade80'],
            borderColor: ['#3a7b8c', '#3a9b6c'],
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
              text: 'Investment Breakdown',
              font: { size: 14, color: '#e8edf0' }
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
    document.getElementById('input_targetAmount').value = 25000;
    document.getElementById('input_numRungs').value = 5;
    document.getElementById('input_ladderLength').value = 60;
    document.getElementById('input_initialDeposit').value = 0;
    document.getElementById('input_monthlyContribution').value = 0;
    document.getElementById('input_cdRate').value = 4.50;
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