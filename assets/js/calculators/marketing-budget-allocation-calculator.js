(function() {
  var chartInstance = null;
  var currentTab = 'allocation';
  var lastChartData = null;

  function getInputs() {
    var monthlyBudget = parseFloat(document.getElementById('input_monthlyBudget').value) || 0;
    var targetCac = parseFloat(document.getElementById('input_targetCac').value) || 1;
    var ppcShare = parseFloat(document.getElementById('input_ppcShare').value) || 0;
    var linkedinShare = parseFloat(document.getElementById('input_linkedinShare').value) || 0;
    var seoShare = parseFloat(document.getElementById('input_seoShare').value) || 0;
    var eventsShare = parseFloat(document.getElementById('input_eventsShare').value) || 0;

    return {
      monthlyBudget: monthlyBudget,
      targetCac: targetCac,
      ppcShare: ppcShare,
      linkedinShare: linkedinShare,
      seoShare: seoShare,
      eventsShare: eventsShare
    }
  }

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

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateAllocation(inputs) {
    var budget = inputs.monthlyBudget;
    var cac = inputs.targetCac;
    var totalShare = inputs.ppcShare + inputs.linkedinShare + inputs.seoShare + inputs.eventsShare;

    if (budget <= 0 || cac <= 0) {
      return { error: 'Budget and CAC must be greater than zero.' };
    }

    var normPpc = totalShare > 0 ? (inputs.ppcShare / totalShare) : 0.25;
    var normLinkedin = totalShare > 0 ? (inputs.linkedinShare / totalShare) : 0.25;
    var normSeo = totalShare > 0 ? (inputs.seoShare / totalShare) : 0.25;
    var normEvents = totalShare > 0 ? (inputs.eventsShare / totalShare) : 0.25;

    var ppcAlloc = budget * normPpc;
    var linkedinAlloc = budget * normLinkedin;
    var seoAlloc = budget * normSeo;
    var eventsAlloc = budget * normEvents;

    var totalAcquisitions = Math.round(budget / cac);
    var ppcAcq = Math.round(ppcAlloc / cac);
    var linkedinAcq = Math.round(linkedinAlloc / cac);
    var seoAcq = Math.round(seoAlloc / cac);
    var eventsAcq = Math.round(eventsAlloc / cac);

    return {
      ppcAllocation: ppcAlloc,
      linkedinAllocation: linkedinAlloc,
      seoAllocation: seoAlloc,
      eventsAllocation: eventsAlloc,
      projectedAcquisitions: totalAcquisitions,
      ppcAcq: ppcAcq,
      linkedinAcq: linkedinAcq,
      seoAcq: seoAcq,
      eventsAcq: eventsAcq,
      error: null
    }
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateAllocation(inputs);

    if (result.error) {
      setOutputText('output_ppcAllocation', '—');
      setOutputText('output_linkedinAllocation', '—');
      setOutputText('output_seoAllocation', '—');
      setOutputText('output_eventsAllocation', '—');
      setOutputText('output_projectedAcquisitions', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_ppcAllocation', formatCurrency(result.ppcAllocation));
    setOutputText('output_linkedinAllocation', formatCurrency(result.linkedinAllocation));
    setOutputText('output_seoAllocation', formatCurrency(result.seoAllocation));
    setOutputText('output_eventsAllocation', formatCurrency(result.eventsAllocation));
    setOutputText('output_projectedAcquisitions', result.projectedAcquisitions + ' customers/mo');

    var chartPayload = {
      allocations: [result.ppcAllocation, result.linkedinAllocation, result.seoAllocation, result.eventsAllocation],
      acquisitions: [result.ppcAcq, result.linkedinAcq, result.seoAcq, result.eventsAcq]
    }
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        monthlyBudget: inputs.monthlyBudget,
        targetCac: inputs.targetCac,
        projectedAcquisitions: result.projectedAcquisitions,
        ppcAllocation: formatCurrency(result.ppcAllocation)
      });
    }
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
    if (!data) return null;

    var labels = ['PPC Search', 'LinkedIn Ads', 'SEO & Content', 'Events'];

    if (tab === 'allocation') {
      return {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data.allocations,
            backgroundColor: ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0' } },
            title: { display: true, text: 'Monthly Budget Distribution ($)', color: '#e8edf0' }
          }
        }
      }
    }

    if (tab === 'acquisitions') {
      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Customers Acquired',
            data: data.acquisitions,
            backgroundColor: ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Projected Monthly Customers by Channel', color: '#e8edf0' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#8899aa' },
              grid: { color: 'rgba(255,255,255,0.05)' }
            },
            x: { ticks: { color: '#8899aa' } }
          }
        }
      }
    }

    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) updateCharts(lastChartData);
    else updateTool();
  }

  function resetTool() {
    var _el_input_monthlyBudget = document.getElementById('input_monthlyBudget');
    _el_input_monthlyBudget.value = (_el_input_monthlyBudget.dataset && _el_input_monthlyBudget.dataset.default !== undefined) ? _el_input_monthlyBudget.dataset.default : (_el_input_monthlyBudget.getAttribute('value') || '');
    var _el_input_targetCac = document.getElementById('input_targetCac');
    _el_input_targetCac.value = (_el_input_targetCac.dataset && _el_input_targetCac.dataset.default !== undefined) ? _el_input_targetCac.dataset.default : (_el_input_targetCac.getAttribute('value') || '');
    var _el_input_ppcShare = document.getElementById('input_ppcShare');
    _el_input_ppcShare.value = (_el_input_ppcShare.dataset && _el_input_ppcShare.dataset.default !== undefined) ? _el_input_ppcShare.dataset.default : (_el_input_ppcShare.getAttribute('value') || '');
    var _el_input_linkedinShare = document.getElementById('input_linkedinShare');
    _el_input_linkedinShare.value = (_el_input_linkedinShare.dataset && _el_input_linkedinShare.dataset.default !== undefined) ? _el_input_linkedinShare.dataset.default : (_el_input_linkedinShare.getAttribute('value') || '');
    var _el_input_seoShare = document.getElementById('input_seoShare');
    _el_input_seoShare.value = (_el_input_seoShare.dataset && _el_input_seoShare.dataset.default !== undefined) ? _el_input_seoShare.dataset.default : (_el_input_seoShare.getAttribute('value') || '');
    var _el_input_eventsShare = document.getElementById('input_eventsShare');
    _el_input_eventsShare.value = (_el_input_eventsShare.dataset && _el_input_eventsShare.dataset.default !== undefined) ? _el_input_eventsShare.dataset.default : (_el_input_eventsShare.getAttribute('value') || '');
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

    
    if (typeof window.updateTool === 'function') window.updateTool();

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });
})();
