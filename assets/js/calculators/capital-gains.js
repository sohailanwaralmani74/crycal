/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Capital Gains Calculator
   Tool ID: capital-gains
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  // ── Get Inputs ──
  function getInputs() {
    return {
      salePrice: parseFloat(document.getElementById('input_salePrice').value) || 0,
      purchasePrice: parseFloat(document.getElementById('input_purchasePrice').value) || 0,
      holdingPeriod: document.getElementById('input_holdingPeriod').value || 'long-term',
      holdingPeriodYears: parseFloat(document.getElementById('input_holdingPeriodYears').value) || 0,
      longTermRate: parseFloat(document.getElementById('input_longTermRate').value) || 0,
      shortTermRate: parseFloat(document.getElementById('input_shortTermRate').value) || 0,
      exemptionAmount: parseFloat(document.getElementById('input_exemptionAmount').value) || 0,
      sellingCosts: parseFloat(document.getElementById('input_sellingCosts').value) || 0,
      improvementCosts: parseFloat(document.getElementById('input_improvementCosts').value) || 0,
      inflationAdjustment: document.getElementById('input_inflationAdjustment').value === 'true',
      inflationRate: parseFloat(document.getElementById('input_inflationRate').value) || 0
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

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    // ── Cost Basis ──
    var costBasis = inputs.purchasePrice + inputs.improvementCosts + inputs.sellingCosts;

    // ── Inflation Adjustment ──
    var adjustedCostBasis = costBasis;
    if (inputs.inflationAdjustment && inputs.inflationRate > 0 && inputs.holdingPeriodYears > 0) {
      var inflationFactor = Math.pow(1 + inputs.inflationRate / 100, inputs.holdingPeriodYears);
      adjustedCostBasis = costBasis * inflationFactor;
    }

    // ── Total Gain ──
    var totalGain = inputs.salePrice - adjustedCostBasis;

    // ── Holding Period Decision ──
    var isLongTerm = inputs.holdingPeriod === 'long-term';
    var taxRate = isLongTerm ? inputs.longTermRate : inputs.shortTermRate;

    // ── Exemption ──
    var taxableGain = Math.max(0, totalGain - inputs.exemptionAmount);

    // ── Tax Owed ──
    var taxOwed = taxableGain * (taxRate / 100);

    // ── Net Proceeds ──
    var netProceeds = inputs.salePrice - taxOwed - inputs.sellingCosts;

    // ── Effective Rate ──
    var effectiveRate = totalGain > 0 ? (taxOwed / totalGain) * 100 : 0;

    // ── Update Outputs ──
    document.getElementById('output_totalGain').querySelector('.output-number').textContent = formatCurrency(totalGain);
    document.getElementById('output_costBasis').querySelector('.output-number').textContent = formatCurrency(adjustedCostBasis);
    document.getElementById('output_taxableGain').querySelector('.output-number').textContent = formatCurrency(taxableGain);
    document.getElementById('output_taxOwed').querySelector('.output-number').textContent = formatCurrency(taxOwed);
    document.getElementById('output_netProceeds').querySelector('.output-number').textContent = formatCurrency(netProceeds);
    document.getElementById('output_effectiveRate').querySelector('.output-number').textContent = effectiveRate.toFixed(1) + '%';

    // ── Breakdown Detail ──
    var breakdownDiv = document.getElementById('taxBreakdownDetail');
    if (breakdownDiv) {
      var items = [
        { label: 'Sale Price', amount: inputs.salePrice },
        { label: 'Purchase Price', amount: inputs.purchasePrice },
        { label: 'Improvement Costs', amount: inputs.improvementCosts },
        { label: 'Selling Costs', amount: inputs.sellingCosts },
        { label: 'Adjusted Cost Basis', amount: adjustedCostBasis, highlight: true },
        { label: 'Total Capital Gain', amount: totalGain, highlight: true },
        { label: 'Exemption / Allowance', amount: inputs.exemptionAmount },
        { label: 'Taxable Gain', amount: taxableGain, highlight: true },
        { label: 'Capital Gains Tax', amount: taxOwed, highlight: true },
        { label: 'Net Proceeds', amount: netProceeds, highlight: true }
      ];

      var html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem 1.5rem; margin-top: 0.5rem;">';
      items.forEach(function(item) {
        var style = item.highlight ? 'font-weight: 600; border-top: 0.0625rem solid var(--border-default); padding-top: 0.3rem;' : '';
        var color = '';
        if (item.label === 'Total Capital Gain' || item.label === 'Taxable Gain' || item.label === 'Net Proceeds') {
          color = item.amount > 0 ? 'color: var(--profit);' : 'color: var(--loss);';
        }
        if (item.label === 'Capital Gains Tax') {
          color = 'color: var(--loss);';
        }
        html += '<div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-bottom: 0.0625rem solid var(--border-default); ' + style + '">';
        html += '<span style="' + (item.highlight ? 'font-weight: 600;' : 'color: var(--text-muted);') + '">' + item.label + '</span>';
        html += '<span style="' + color + '"><strong>' + formatCurrency(item.amount) + '</strong></span>';
        html += '</div>';
      });
      html += '</div>';
      breakdownDiv.innerHTML = html;
    }

    // ── Charts ──
    updateCharts({
      salePrice: inputs.salePrice,
      purchasePrice: inputs.purchasePrice,
      improvementCosts: inputs.improvementCosts,
      sellingCosts: inputs.sellingCosts,
      adjustedCostBasis: adjustedCostBasis,
      totalGain: totalGain,
      exemptionAmount: inputs.exemptionAmount,
      taxableGain: taxableGain,
      taxOwed: taxOwed,
      netProceeds: netProceeds,
      taxRate: taxRate,
      holdingPeriod: inputs.holdingPeriod
    });

    // ── History ──
    if (typeof window.logHistory === 'function') {
      var snapshot = {
        salePrice: inputs.salePrice,
        purchasePrice: inputs.purchasePrice,
        holdingPeriod: inputs.holdingPeriod,
        totalGain: totalGain,
        taxOwed: taxOwed,
        netProceeds: netProceeds
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

    if (tab === 'breakdown') {
      var categories = [
        { label: 'Cost Basis', value: data.adjustedCostBasis, color: '#4A90D9' },
        { label: 'Capital Gain', value: data.totalGain, color: '#2F6F5E' },
        { label: 'Tax Owed', value: data.taxOwed, color: '#B23A3A' }
      ];

      // Only show positive values
      var filtered = categories.filter(function(c) { return c.value > 0; });
      if (filtered.length === 0) {
        return {
          type: 'doughnut',
          data: {
            labels: ['No data'],
            datasets: [{ data: [1], backgroundColor: ['#DCE1E3'] }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'No data to display', font: { size: 14 } }
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
            title: { display: true, text: 'Capital Gains Breakdown', font: { size: 14 } },
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
          labels: ['Sale Price', 'Cost Basis', 'Taxable Gain', 'Tax Owed', 'Net Proceeds'],
          datasets: [{
            label: 'Amount',
            data: [data.salePrice, data.adjustedCostBasis, data.taxableGain, data.taxOwed, data.netProceeds],
            backgroundColor: ['#2C3E50', '#4A90D9', '#C08A2E', '#B23A3A', '#2F6F5E'],
            borderColor: ['#1a252f', '#3a7b8c', '#A87520', '#8a2a2a', '#1f4f42'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Capital Gains Comparison', font: { size: 14 } }
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

    if (tab === 'distribution') {
      var total = data.salePrice;
      var pctData = [
        { label: 'Cost Basis', value: total > 0 ? (data.adjustedCostBasis / total) * 100 : 0 },
        { label: 'Tax Owed', value: total > 0 ? (data.taxOwed / total) * 100 : 0 },
        { label: 'Net Proceeds', value: total > 0 ? (data.netProceeds / total) * 100 : 0 }
      ];

      return {
        type: 'bar',
        data: {
          labels: pctData.map(function(d) { return d.label; }),
          datasets: [{
            label: 'Percentage of Sale Price',
            data: pctData.map(function(d) { return d.value; }),
            backgroundColor: ['#4A90D9', '#B23A3A', '#2F6F5E'],
            borderColor: ['#3a7b8c', '#8a2a2a', '#1f4f42'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Distribution of Sale Proceeds', font: { size: 14 } }
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
    document.getElementById('input_salePrice').value = 50000;
    document.getElementById('input_purchasePrice').value = 30000;
    document.getElementById('input_holdingPeriod').value = 'long-term';
    document.getElementById('input_holdingPeriodYears').value = 2;
    document.getElementById('input_longTermRate').value = 15.0;
    document.getElementById('input_shortTermRate').value = 25.0;
    document.getElementById('input_exemptionAmount').value = 0;
    document.getElementById('input_sellingCosts').value = 0;
    document.getElementById('input_improvementCosts').value = 0;
    document.getElementById('input_inflationAdjustment').value = 'false';
    document.getElementById('input_inflationRate').value = 3.0;
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