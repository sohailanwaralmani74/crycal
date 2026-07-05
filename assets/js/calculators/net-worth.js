/* ═══════════════════════════════════════════════════════════
   CRYCAL — Net Worth Calculator
   Tool ID: net-worth
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'assets';

  // ── Get Inputs ──
  function getInputs() {
    return {
      cash: parseFloat(document.getElementById('input_cash').value) || 0,
      investments: parseFloat(document.getElementById('input_investments').value) || 0,
      retirement: parseFloat(document.getElementById('input_retirement').value) || 0,
      realEstate: parseFloat(document.getElementById('input_realEstate').value) || 0,
      vehicles: parseFloat(document.getElementById('input_vehicles').value) || 0,
      otherAssets: parseFloat(document.getElementById('input_otherAssets').value) || 0,
      mortgageBalance: parseFloat(document.getElementById('input_mortgageBalance').value) || 0,
      creditCardDebt: parseFloat(document.getElementById('input_creditCardDebt').value) || 0,
      autoLoans: parseFloat(document.getElementById('input_autoLoans').value) || 0,
      studentLoans: parseFloat(document.getElementById('input_studentLoans').value) || 0,
      personalLoans: parseFloat(document.getElementById('input_personalLoans').value) || 0,
      otherLiabilities: parseFloat(document.getElementById('input_otherLiabilities').value) || 0
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

  // ── Format Currency Short ──
  function formatCurrencyShort(amount) {
    var code = getGlobalCurrency() || 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return getCurrencySymbol(code) + amount.toFixed(0);
    }
  }

  // ── Net Worth Category ──
  function getNetWorthCategory(netWorth) {
    if (netWorth < 0) return 'Negative Net Worth';
    if (netWorth < 10000) return 'Building Wealth';
    if (netWorth < 100000) return 'On Track';
    if (netWorth < 500000) return 'Accumulating';
    if (netWorth < 1000000) return 'High Net Worth';
    return 'Very High Net Worth';
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    // ── Assets ──
    var cash = inputs.cash;
    var investments = inputs.investments;
    var retirement = inputs.retirement;
    var realEstate = inputs.realEstate;
    var vehicles = inputs.vehicles;
    var otherAssets = inputs.otherAssets;
    var totalAssets = cash + investments + retirement + realEstate + vehicles + otherAssets;

    // ── Liabilities ──
    var mortgage = inputs.mortgageBalance;
    var creditCard = inputs.creditCardDebt;
    var autoLoans = inputs.autoLoans;
    var studentLoans = inputs.studentLoans;
    var personalLoans = inputs.personalLoans;
    var otherLiabilities = inputs.otherLiabilities;
    var totalLiabilities = mortgage + creditCard + autoLoans + studentLoans + personalLoans + otherLiabilities;

    // ── Net Worth ──
    var netWorth = totalAssets - totalLiabilities;

    // ── Debt-to-Asset Ratio ──
    var debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

    // ── Net Worth Category ──
    var category = getNetWorthCategory(netWorth);

    // ── Update Outputs ──
    document.getElementById('output_totalAssets').querySelector('.output-number').textContent = formatCurrency(totalAssets);
    document.getElementById('output_totalLiabilities').querySelector('.output-number').textContent = formatCurrency(totalLiabilities);
    document.getElementById('output_netWorth').querySelector('.output-number').textContent = formatCurrency(netWorth);
    document.getElementById('output_debtToAssetRatio').querySelector('.output-number').textContent = debtToAssetRatio.toFixed(1) + '%';
    document.getElementById('output_netWorthCategory').querySelector('.output-number').textContent = category;

    // ── Breakdown Detail ──
    var breakdownDiv = document.getElementById('taxBreakdownDetail');
    if (breakdownDiv) {
      var assetItems = [
        { label: 'Cash & Savings', amount: cash, color: '#2F6F5E' },
        { label: 'Investments', amount: investments, color: '#C08A2E' },
        { label: 'Retirement Accounts', amount: retirement, color: '#4A90D9' },
        { label: 'Real Estate', amount: realEstate, color: '#8E44AD' },
        { label: 'Vehicles', amount: vehicles, color: '#2C3E50' },
        { label: 'Other Assets', amount: otherAssets, color: '#F39C12' }
      ];

      var liabilityItems = [
        { label: 'Mortgage', amount: mortgage, color: '#B23A3A' },
        { label: 'Credit Card Debt', amount: creditCard, color: '#DCE1E3' },
        { label: 'Auto Loans', amount: autoLoans, color: '#E67E22' },
        { label: 'Student Loans', amount: studentLoans, color: '#9B59B6' },
        { label: 'Personal Loans', amount: personalLoans, color: '#1ABC9C' },
        { label: 'Other Liabilities', amount: otherLiabilities, color: '#34495E' }
      ];

      var html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem 1.5rem; margin-top: 0.5rem;">';

      html += '<div style="font-weight: 600; color: var(--profit); grid-column: 1 / -1; border-bottom: 0.0625rem solid var(--border-default); padding-bottom: 0.3rem;">Assets</div>';
      assetItems.forEach(function(item) {
        if (item.amount > 0) {
          html += '<div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-bottom: 0.0625rem solid var(--border-default);">';
          html += '<span style="color: var(--text-muted);">' + item.label + '</span>';
          html += '<span><strong>' + formatCurrency(item.amount) + '</strong></span>';
          html += '</div>';
        }
      });

      html += '<div style="font-weight: 600; color: var(--loss); grid-column: 1 / -1; border-bottom: 0.0625rem solid var(--border-default); padding: 0.3rem 0;">Liabilities</div>';
      liabilityItems.forEach(function(item) {
        if (item.amount > 0) {
          html += '<div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-bottom: 0.0625rem solid var(--border-default);">';
          html += '<span style="color: var(--text-muted);">' + item.label + '</span>';
          html += '<span><strong>' + formatCurrency(item.amount) + '</strong></span>';
          html += '</div>';
        }
      });

      html += '<div style="display: flex; justify-content: space-between; padding: 0.3rem 0; border-top: 0.125rem solid var(--text-primary); margin-top: 0.3rem; grid-column: 1 / -1;">';
      html += '<span><strong>Net Worth</strong></span>';
      html += '<span style="font-weight: 700; ' + (netWorth >= 0 ? 'color: var(--profit);' : 'color: var(--loss);') + '">' + formatCurrency(netWorth) + '</span>';
      html += '</div>';

      html += '</div>';
      breakdownDiv.innerHTML = html;
    }

    // ── Charts ──
    updateCharts({
      cash: cash,
      investments: investments,
      retirement: retirement,
      realEstate: realEstate,
      vehicles: vehicles,
      otherAssets: otherAssets,
      mortgage: mortgage,
      creditCard: creditCard,
      autoLoans: autoLoans,
      studentLoans: studentLoans,
      personalLoans: personalLoans,
      otherLiabilities: otherLiabilities,
      totalAssets: totalAssets,
      totalLiabilities: totalLiabilities,
      netWorth: netWorth
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        totalAssets: totalAssets,
        totalLiabilities: totalLiabilities,
        netWorth: netWorth
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

    var assetCategories = [
      { label: 'Cash & Savings', value: data.cash, color: '#2F6F5E' },
      { label: 'Investments', value: data.investments, color: '#C08A2E' },
      { label: 'Retirement', value: data.retirement, color: '#4A90D9' },
      { label: 'Real Estate', value: data.realEstate, color: '#8E44AD' },
      { label: 'Vehicles', value: data.vehicles, color: '#2C3E50' },
      { label: 'Other Assets', value: data.otherAssets, color: '#F39C12' }
    ];

    var liabilityCategories = [
      { label: 'Mortgage', value: data.mortgage, color: '#B23A3A' },
      { label: 'Credit Cards', value: data.creditCard, color: '#DCE1E3' },
      { label: 'Auto Loans', value: data.autoLoans, color: '#E67E22' },
      { label: 'Student Loans', value: data.studentLoans, color: '#9B59B6' },
      { label: 'Personal Loans', value: data.personalLoans, color: '#1ABC9C' },
      { label: 'Other Liabilities', value: data.otherLiabilities, color: '#34495E' }
    ];

    var assetsFiltered = assetCategories.filter(function(c) { return c.value > 0; });
    var liabilitiesFiltered = liabilityCategories.filter(function(c) { return c.value > 0; });

    var netWorthColor = data.netWorth >= 0 ? '#2F6F5E' : '#B23A3A';

    if (tab === 'assets') {
      if (assetsFiltered.length === 0) {
        return {
          type: 'doughnut',
          data: {
            labels: ['No assets'],
            datasets: [{ data: [1], backgroundColor: ['#DCE1E3'] }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'No assets entered', font: { size: 14 } }
            }
          }
        };
      }

      return {
        type: 'doughnut',
        data: {
          labels: assetsFiltered.map(function(f) { return f.label; }),
          datasets: [{
            data: assetsFiltered.map(function(f) { return f.value; }),
            backgroundColor: assetsFiltered.map(function(f) { return f.color; }),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Asset Breakdown', font: { size: 14 } },
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

    if (tab === 'liabilities') {
      if (liabilitiesFiltered.length === 0) {
        return {
          type: 'doughnut',
          data: {
            labels: ['No liabilities'],
            datasets: [{ data: [1], backgroundColor: ['#DCE1E3'] }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'No liabilities entered', font: { size: 14 } }
            }
          }
        };
      }

      return {
        type: 'doughnut',
        data: {
          labels: liabilitiesFiltered.map(function(f) { return f.label; }),
          datasets: [{
            data: liabilitiesFiltered.map(function(f) { return f.value; }),
            backgroundColor: liabilitiesFiltered.map(function(f) { return f.color; }),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Liability Breakdown', font: { size: 14 } },
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

    if (tab === 'comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Assets', 'Liabilities', 'Net Worth'],
          datasets: [{
            label: 'Amount',
            data: [data.totalAssets, data.totalLiabilities, data.netWorth],
            backgroundColor: ['#2F6F5E', '#B23A3A', netWorthColor],
            borderColor: ['#1f4f42', '#8a2a2a', data.netWorth >= 0 ? '#1f4f42' : '#8a2a2a'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Assets vs Liabilities vs Net Worth', font: { size: 14 } }
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

    return null;
  }

  // ── Switch Chart Tab ──
  function switchChartTab(tabId) {
    currentTab = tabId;
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Reset Tool ──
  function resetTool() {
    document.getElementById('input_cash').value = 10000;
    document.getElementById('input_investments').value = 25000;
    document.getElementById('input_retirement').value = 30000;
    document.getElementById('input_realEstate').value = 250000;
    document.getElementById('input_vehicles').value = 15000;
    document.getElementById('input_otherAssets').value = 0;
    document.getElementById('input_mortgageBalance').value = 200000;
    document.getElementById('input_creditCardDebt').value = 5000;
    document.getElementById('input_autoLoans').value = 10000;
    document.getElementById('input_studentLoans').value = 0;
    document.getElementById('input_personalLoans').value = 0;
    document.getElementById('input_otherLiabilities').value = 0;
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