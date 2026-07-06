/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Debt-to-Income Calculator
   Tool ID: debt-to-income
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'comparison';

  // ── Get Inputs ──
  function getInputs() {
    return {
      monthlyIncome: parseFloat(document.getElementById('input_monthlyIncome').value) || 0,
      otherIncome: parseFloat(document.getElementById('input_otherIncome').value) || 0,
      mortgagePayment: parseFloat(document.getElementById('input_mortgagePayment').value) || 0,
      carPayment: parseFloat(document.getElementById('input_carPayment').value) || 0,
      creditCardMinimum: parseFloat(document.getElementById('input_creditCardMinimum').value) || 0,
      studentLoanPayment: parseFloat(document.getElementById('input_studentLoanPayment').value) || 0,
      personalLoanPayment: parseFloat(document.getElementById('input_personalLoanPayment').value) || 0,
      otherDebtPayment: parseFloat(document.getElementById('input_otherDebtPayment').value) || 0,
      includeFrontEnd: document.getElementById('input_includeFrontEnd').value === 'true'
    };
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

  // ── Get DTI Category ──
  function getDTICategory(dti) {
    if (dti <= 20) return 'Excellent — Great financial shape';
    if (dti <= 36) return 'Good — Healthy debt levels';
    if (dti <= 43) return 'Acceptable — May limit borrowing';
    if (dti <= 50) return 'High — May struggle to get approved';
    return 'Very High — Likely debt stress';
  }

  // ── Get DTI Color ──
  function getDTIColor(dti) {
    if (dti <= 20) return 'var(--profit)';
    if (dti <= 36) return 'var(--profit)';
    if (dti <= 43) return 'var(--accent)';
    if (dti <= 50) return 'var(--loss)';
    return 'var(--loss)';
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    // ── Total Income ──
    var totalIncome = inputs.monthlyIncome + inputs.otherIncome;

    // ── Housing Debt ──
    var housingDebt = inputs.mortgagePayment;

    // ── Total Debt ──
    var totalDebt = inputs.mortgagePayment + inputs.carPayment + inputs.creditCardMinimum + 
                    inputs.studentLoanPayment + inputs.personalLoanPayment + inputs.otherDebtPayment;

    // ── Front-End DTI ──
    var frontEndDTI = totalIncome > 0 ? (housingDebt / totalIncome) * 100 : 0;

    // ── Back-End DTI ──
    var backEndDTI = totalIncome > 0 ? (totalDebt / totalIncome) * 100 : 0;

    // ── DTI to Display ──
    var dtiDisplay = inputs.includeFrontEnd ? frontEndDTI : backEndDTI;
    var dtiCategory = getDTICategory(dtiDisplay);

    // ── Update Outputs ──
    document.getElementById('output_totalMonthlyIncome').querySelector('.output-number').textContent = formatCurrency(totalIncome);
    document.getElementById('output_totalMonthlyDebt').querySelector('.output-number').textContent = formatCurrency(totalDebt);
    document.getElementById('output_dtiRatio').querySelector('.output-number').textContent = dtiDisplay.toFixed(1) + '%';
    document.getElementById('output_dtiCategory').querySelector('.output-number').textContent = dtiCategory;
    document.getElementById('output_frontEndRatio').querySelector('.output-number').textContent = frontEndDTI.toFixed(1) + '%';
    document.getElementById('output_backEndRatio').querySelector('.output-number').textContent = backEndDTI.toFixed(1) + '%';

    // ── Breakdown Detail ──
    var breakdownDiv = document.getElementById('taxBreakdownDetail');
    if (breakdownDiv) {
      var debtItems = [
        { label: 'Mortgage / Rent', amount: inputs.mortgagePayment },
        { label: 'Auto Payment', amount: inputs.carPayment },
        { label: 'Credit Card Minimum', amount: inputs.creditCardMinimum },
        { label: 'Student Loan', amount: inputs.studentLoanPayment },
        { label: 'Personal Loan', amount: inputs.personalLoanPayment },
        { label: 'Other Debt', amount: inputs.otherDebtPayment }
      ];

      var activeDebts = debtItems.filter(function(d) { return d.amount > 0; });

      var html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem 1.5rem; margin-top: 0.5rem;">';

      html += '<div style="font-weight: 600; color: var(--profit); grid-column: 1 / -1; border-bottom: 0.0625rem solid var(--border-default); padding-bottom: 0.3rem;">Income</div>';
      html += '<div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-bottom: 0.0625rem solid var(--border-default);">';
      html += '<span style="color: var(--text-muted);">Gross Monthly Income</span>';
      html += '<span><strong>' + formatCurrency(inputs.monthlyIncome) + '</strong></span>';
      html += '</div>';
      if (inputs.otherIncome > 0) {
        html += '<div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-bottom: 0.0625rem solid var(--border-default);">';
        html += '<span style="color: var(--text-muted);">Other Income</span>';
        html += '<span><strong>' + formatCurrency(inputs.otherIncome) + '</strong></span>';
        html += '</div>';
      }
      html += '<div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-top: 0.0625rem solid var(--border-default); font-weight: 600;">';
      html += '<span>Total Income</span>';
      html += '<span>' + formatCurrency(totalIncome) + '</span>';
      html += '</div>';

      if (activeDebts.length > 0) {
        html += '<div style="font-weight: 600; color: var(--loss); grid-column: 1 / -1; border-bottom: 0.0625rem solid var(--border-default); padding: 0.3rem 0 0.3rem 0;">Debts</div>';
        activeDebts.forEach(function(item) {
          html += '<div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-bottom: 0.0625rem solid var(--border-default);">';
          html += '<span style="color: var(--text-muted);">' + item.label + '</span>';
          html += '<span><strong>' + formatCurrency(item.amount) + '</strong></span>';
          html += '</div>';
        });
        html += '<div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-top: 0.0625rem solid var(--border-default); font-weight: 600;">';
        html += '<span>Total Debt</span>';
        html += '<span>' + formatCurrency(totalDebt) + '</span>';
        html += '</div>';
      }

      html += '<div style="display: flex; justify-content: space-between; padding: 0.3rem 0; border-top: 0.125rem solid var(--text-primary); margin-top: 0.3rem; grid-column: 1 / -1; font-weight: 700; background: var(--surface); padding: 0.5rem; border-radius: 0.25rem;">';
      html += '<span>Debt-to-Income Ratio</span>';
      html += '<span style="color: ' + getDTIColor(dtiDisplay) + ';">' + dtiDisplay.toFixed(1) + '%</span>';
      html += '</div>';

      html += '</div>';
      breakdownDiv.innerHTML = html;
    }

    // ── Charts ──
    updateCharts({
      totalIncome: totalIncome,
      totalDebt: totalDebt,
      mortgage: inputs.mortgagePayment,
      car: inputs.carPayment,
      creditCard: inputs.creditCardMinimum,
      studentLoan: inputs.studentLoanPayment,
      personalLoan: inputs.personalLoanPayment,
      otherDebt: inputs.otherDebtPayment,
      frontEndDTI: frontEndDTI,
      backEndDTI: backEndDTI,
      dtiDisplay: dtiDisplay,
      includeFrontEnd: inputs.includeFrontEnd
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        monthlyIncome: inputs.monthlyIncome,
        totalMonthlyDebt: totalDebt,
        dtiRatio: dtiDisplay.toFixed(1),
        dtiCategory: dtiCategory
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

    if (tab === 'comparison') {
      var remainingIncome = data.totalIncome - data.totalDebt;
      if (remainingIncome < 0) remainingIncome = 0;

      return {
        type: 'bar',
        data: {
          labels: ['Income', 'Debt', 'Remaining Income'],
          datasets: [{
            label: 'Amount',
            data: [data.totalIncome, data.totalDebt, remainingIncome],
            backgroundColor: ['#2F6F5E', '#B23A3A', '#C08A2E'],
            borderColor: ['#1f4f42', '#8a2a2a', '#A87520'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Income vs Debt', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount (' + currencySymbol + ')' },
              ticks: {
                callback: function(v) { return currencySymbol + v.toFixed(0); }
              }
            }
          }
        }
      };
    }

    if (tab === 'breakdown') {
      var debtItems = [
        { label: 'Mortgage', value: data.mortgage, color: '#2C3E50' },
        { label: 'Auto', value: data.car, color: '#C08A2E' },
        { label: 'Credit Cards', value: data.creditCard, color: '#B23A3A' },
        { label: 'Student Loans', value: data.studentLoan, color: '#4A90D9' },
        { label: 'Personal Loans', value: data.personalLoan, color: '#8E44AD' },
        { label: 'Other Debt', value: data.otherDebt, color: '#F39C12' }
      ];

      var filtered = debtItems.filter(function(d) { return d.value > 0; });

      if (filtered.length === 0) {
        return {
          type: 'doughnut',
          data: {
            labels: ['No debt'],
            datasets: [{ data: [1], backgroundColor: ['#DCE1E3'] }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'No debt entered', font: { size: 14 } }
            }
          }
        };
      }

      return {
        type: 'doughnut',
        data: {
          labels: filtered.map(function(f) { return f.label; }),
          datasets: [{
            data: filtered.map(function(f) { return f.value; }),
            backgroundColor: filtered.map(function(f) { return f.color; }),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Debt Breakdown', font: { size: 14 } },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  var label = ctx.label || '';
                  var value = ctx.parsed || 0;
                  var total = ctx.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                  var pct = total > 0 ? (value / total * 100).toFixed(1) : 0;
                  return label + ': ' + currencySymbol + value.toFixed(2) + ' (' + pct + '%)';
                }
              }
            }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'distribution') {
      var pctData = [
        { label: 'Housing', value: data.totalIncome > 0 ? (data.mortgage / data.totalIncome) * 100 : 0 },
        { label: 'Auto', value: data.totalIncome > 0 ? (data.car / data.totalIncome) * 100 : 0 },
        { label: 'Credit Cards', value: data.totalIncome > 0 ? (data.creditCard / data.totalIncome) * 100 : 0 },
        { label: 'Student Loans', value: data.totalIncome > 0 ? (data.studentLoan / data.totalIncome) * 100 : 0 },
        { label: 'Personal Loans', value: data.totalIncome > 0 ? (data.personalLoan / data.totalIncome) * 100 : 0 },
        { label: 'Other', value: data.totalIncome > 0 ? (data.otherDebt / data.totalIncome) * 100 : 0 },
        { label: 'Remaining Income', value: data.totalIncome > 0 ? ((data.totalIncome - data.totalDebt) / data.totalIncome) * 100 : 0 }
      ];

      var filtered2 = pctData.filter(function(d) { return d.value > 0; });

      var colors = ['#2C3E50', '#C08A2E', '#B23A3A', '#4A90D9', '#8E44AD', '#F39C12', '#2F6F5E'];

      return {
        type: 'bar',
        data: {
          labels: filtered2.map(function(d) { return d.label; }),
          datasets: [{
            label: 'Percentage of Income',
            data: filtered2.map(function(d) { return d.value; }),
            backgroundColor: colors.slice(0, filtered2.length),
            borderColor: colors.slice(0, filtered2.length).map(function(c) { return c; }),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Income Distribution', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: { display: true, text: 'Percentage (%)' }
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
    document.getElementById('input_monthlyIncome').value = 6000;
    document.getElementById('input_otherIncome').value = 0;
    document.getElementById('input_mortgagePayment').value = 1500;
    document.getElementById('input_carPayment').value = 400;
    document.getElementById('input_creditCardMinimum').value = 200;
    document.getElementById('input_studentLoanPayment').value = 300;
    document.getElementById('input_personalLoanPayment').value = 0;
    document.getElementById('input_otherDebtPayment').value = 0;
    document.getElementById('input_includeFrontEnd').value = 'false';
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
  });

})();