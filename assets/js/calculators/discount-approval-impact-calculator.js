/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Discount Approval Impact Calculator
   Tool ID: discount-approval-impact-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'breakdown';

  function formatCurrency(amount) {
    var code = (typeof getGlobalCurrency === 'function' ? getGlobalCurrency() : 'USD') || 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(0);
    }
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id) || document.getElementById('output_' + id);
    if (el) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.value = text;
      } else {
        var numEl = el.querySelector('.output-number');
        if (numEl) numEl.textContent = text;
        else el.textContent = text;
      }
    }
  }

  function getInputs() {
    return {
      base: parseFloat(document.getElementById('input_base_price')?.value) || 0,
      disc: parseFloat(document.getElementById('input_discount_percent')?.value) || 0,
      vol: parseFloat(document.getElementById('input_volume')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var base = inputs.base;
    var disc = inputs.disc;
    var vol = inputs.vol;

    var pricePerDeal = base * (1 - disc / 100);
    var totalArr = base * vol;
    var finalArr = pricePerDeal * vol;
    var lost = totalArr - finalArr;

    setOutputText('revenue_lost', formatCurrency(lost));
    setOutputText('output_revenue_lost', formatCurrency(lost));
    setOutputText('final_arr', formatCurrency(finalArr));
    setOutputText('output_final_arr', formatCurrency(finalArr));

    updateCharts({
      totalArr: totalArr,
      finalArr: finalArr,
      lost: lost
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        basePrice: base,
        discountPercent: disc + '%',
        volume: vol,
        finalArr: formatCurrency(finalArr),
        revenueLost: formatCurrency(lost)
      });
    }
  }

  function updateCharts(data) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    if (currentTab === 'bar' || currentTab === 'comparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Full Potential ARR', 'Realized ARR', 'Lost to Discounts'],
          datasets: [{
            label: 'Amount ($)',
            data: [data.totalArr, data.finalArr, data.lost],
            backgroundColor: ['#64748b', '#3b82f6', '#ef4444']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Final Realized ARR', 'Lost to Discount'],
          datasets: [{
            data: [data.finalArr, data.lost],
            backgroundColor: ['#3b82f6', '#ef4444']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    document.querySelectorAll('.chart-tab').forEach(function(t) {
      if ((t.dataset && t.dataset.tab === tabId) || (t.getAttribute('onclick') && t.getAttribute('onclick').indexOf(tabId) !== -1)) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
    updateTool();
  }

  function resetTool() {
    var b = document.getElementById('input_base_price');
    var d = document.getElementById('input_discount_percent');
    var v = document.getElementById('input_volume');
    if (b) b.value = '10000';
    if (d) d.value = '15';
    if (v) v.value = '50';
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select, input[id^="input_"]').forEach(function(el) {
      el.addEventListener('input', updateTool);
      el.addEventListener('change', updateTool);
    });
    updateTool();
  });
  setTimeout(updateTool, 100);
})();
