(function() {
  var chartInstance = null;
  var currentTab = 'revenue';
  var lastChartData = null;

  function getInputs() {
    var monthlyContentBudget = parseFloat(document.getElementById('input_monthlyContentBudget').value) || 0;
    var articlesPerMonth = parseFloat(document.getElementById('input_articlesPerMonth').value) || 0;
    var avgOrganicTrafficPerArticle = parseFloat(document.getElementById('input_avgOrganicTrafficPerArticle').value) || 0;
    var visitToLeadRate = parseFloat(document.getElementById('input_visitToLeadRate').value) || 2.0;
    var leadToPaidRate = parseFloat(document.getElementById('input_leadToPaidRate').value) || 5.0;
    var avgAcv = parseFloat(document.getElementById('input_avgAcv').value) || 2400;

    return {
      monthlyContentBudget: monthlyContentBudget,
      articlesPerMonth: articlesPerMonth,
      avgOrganicTrafficPerArticle: avgOrganicTrafficPerArticle,
      visitToLeadRate: visitToLeadRate / 100,
      leadToPaidRate: leadToPaidRate / 100,
      avgAcv: avgAcv
    };
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

  function calculateContentRoi(inputs) {
    var monthlyBudget = inputs.monthlyContentBudget;
    var totalAnnualBudget = monthlyBudget * 12;
    var monthlyVisits = inputs.articlesPerMonth * inputs.avgOrganicTrafficPerArticle;

    if (totalAnnualBudget <= 0 || monthlyVisits <= 0) {
      return { error: 'Budget and Traffic must be greater than zero.' };
    }

    var monthlyLeads = Math.round(monthlyVisits * inputs.visitToLeadRate);
    var annualLeads = monthlyLeads * 12;
    var monthlyCustomers = monthlyLeads * inputs.leadToPaidRate;
    var annualCustomers = Math.round(monthlyCustomers * 12);
    var projectedArr = annualCustomers * inputs.avgAcv;
    var netProfit = projectedArr - totalAnnualBudget;
    var contentRoi = (netProfit / totalAnnualBudget) * 100;

    return {
      totalAnnualBudget: totalAnnualBudget,
      projectedAnnualVisits: monthlyVisits,
      annualLeads: annualLeads,
      projectedArr: projectedArr,
      netContentProfit: netProfit,
      contentRoi: contentRoi,
      annualCustomers: annualCustomers,
      error: null
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateContentRoi(inputs);

    if (result.error) {
      setOutputText('output_totalAnnualBudget', '—');
      setOutputText('output_projectedAnnualVisits', '—');
      setOutputText('output_annualLeads', '—');
      setOutputText('output_projectedArr', '—');
      setOutputText('output_netContentProfit', '—');
      setOutputText('output_contentRoi', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_totalAnnualBudget', formatCurrency(result.totalAnnualBudget));
    setOutputText('output_projectedAnnualVisits', result.projectedAnnualVisits.toLocaleString() + ' visits/mo');
    setOutputText('output_annualLeads', result.annualLeads.toLocaleString() + ' leads/yr');
    setOutputText('output_projectedArr', formatCurrency(result.projectedArr));
    setOutputText('output_netContentProfit', formatCurrency(result.netContentProfit));
    setOutputText('output_contentRoi', result.contentRoi.toFixed(0) + '%');

    var chartPayload = {
      annualBudget: result.totalAnnualBudget,
      projectedArr: result.projectedArr,
      netProfit: result.netContentProfit,
      monthlyVisits: result.projectedAnnualVisits,
      annualLeads: result.annualLeads,
      annualCustomers: result.annualCustomers
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        monthlyContentBudget: inputs.monthlyContentBudget,
        projectedAnnualVisits: result.projectedAnnualVisits.toLocaleString(),
        projectedArr: formatCurrency(result.projectedArr),
        contentRoi: result.contentRoi.toFixed(0) + '%'
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

    if (tab === 'revenue') {
      return {
        type: 'bar',
        data: {
          labels: ['Annual Budget', 'New ARR Generated', 'Net Profit'],
          datasets: [{
            label: 'Amount ($)',
            data: [data.annualBudget, data.projectedArr, data.netProfit],
            backgroundColor: ['#ef4444', '#3b82f6', data.netProfit >= 0 ? '#10b981' : '#f59e0b'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Annual Content Financial Return ($)', color: '#e8edf0' }
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
      };
    }

    if (tab === 'traffic') {
      return {
        type: 'bar',
        data: {
          labels: ['Monthly Visits', 'Annual Leads', 'Annual Customers'],
          datasets: [{
            label: 'Volume',
            data: [data.monthlyVisits, data.annualLeads, data.annualCustomers],
            backgroundColor: ['#06b6d4', '#8b5cf6', '#10b981'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Organic Audience Conversion Funnel', color: '#e8edf0' }
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
      };
    }

    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) updateCharts(lastChartData);
    else updateTool();
  }

  function resetTool() {
    document.getElementById('input_monthlyContentBudget').value = 8000;
    document.getElementById('input_articlesPerMonth').value = 8;
    document.getElementById('input_avgOrganicTrafficPerArticle').value = 1200;
    document.getElementById('input_visitToLeadRate').value = 2.0;
    document.getElementById('input_leadToPaidRate').value = 5.0;
    document.getElementById('input_avgAcv').value = 2400;
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
