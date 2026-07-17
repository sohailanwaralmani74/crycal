(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  // ──────────────────────────────────────────────────────────────
  // ⚙️ CONFIGURATION — UPDATE THESE VALUES FOR FUTURE TAX YEARS
  // ──────────────────────────────────────────────────────────────
  var CONFIG = {
    // Nil-Rate Band (NRB)
    nilRateBand: 325000,

    // Residence Nil-Rate Band (RNRB)
    residenceBand: 175000,

    // Inheritance Tax Rate
    standardRate: 0.40,      // 40%
    reducedRate: 0.36,       // 36% (if 10%+ to charity)

    // Charity threshold for reduced rate
    charityThreshold: 0.10,  // 10%

    // Gift taper relief thresholds (years after gift)
    taperRelief: [
      { years: 0, relief: 0.00 },
      { years: 3, relief: 0.20 },
      { years: 4, relief: 0.40 },
      { years: 5, relief: 0.60 },
      { years: 6, relief: 0.80 },
      { years: 7, relief: 1.00 }
    ],

    // Tax year label
    taxYear: '2025/26'
  };
  // ──────────────────────────────────────────────────────────────

  // ── Get Inputs ──
  function getInputs() {
    var totalEstate = parseFloat(document.getElementById('input_totalEstate').value) || 0;
    var mainResidence = parseFloat(document.getElementById('input_mainResidence').value) || 0;
    var residenceToDescendants = document.getElementById('input_residenceToDescendants').value;
    var spouseTransfer = document.getElementById('input_spouseTransfer').value;
    var giftsLast7Years = parseFloat(document.getElementById('input_giftsLast7Years').value) || 0;
    var charityPercentage = parseFloat(document.getElementById('input_charityPercentage').value) || 0;
    var trustsAndOthers = parseFloat(document.getElementById('input_trustsAndOthers').value) || 0;

    return {
      totalEstate: totalEstate,
      mainResidence: mainResidence,
      residenceToDescendants: residenceToDescendants,
      spouseTransfer: spouseTransfer,
      giftsLast7Years: giftsLast7Years,
      charityPercentage: charityPercentage / 100,
      trustsAndOthers: trustsAndOthers
    };
  }

  // ── Format Currency ──
  function formatCurrency(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'GBP';
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return '£' + amount.toFixed(0);
    }
  }

  function formatPercent(value) {
    if (value === undefined || value === null || isNaN(value)) return '—';
    return (value * 100).toFixed(1) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  // ── Get Taper Relief ──
  function getTaperRelief(years) {
    var relief = 0;
    for (var i = 0; i < CONFIG.taperRelief.length; i++) {
      if (years >= CONFIG.taperRelief[i].years) {
        relief = CONFIG.taperRelief[i].relief;
      }
    }
    return relief;
  }

  // ── Core Calculation ──
  function calculateIHT(inputs) {
    var totalEstate = inputs.totalEstate;
    var mainResidence = inputs.mainResidence;
    var residenceToDescendants = inputs.residenceToDescendants;
    var spouseTransfer = inputs.spouseTransfer;
    var gifts = inputs.giftsLast7Years;
    var charityPct = inputs.charityPercentage;
    var trusts = inputs.trustsAndOthers;

    if (totalEstate <= 0) {
      return { error: 'Enter a valid estate value' };
    }

    // ── Nil-Rate Band ──
    var nrb = CONFIG.nilRateBand;
    var rnrb = CONFIG.residenceBand;

    // Spouse transfer — double both allowances
    if (spouseTransfer === 'yes') {
      nrb *= 2;
      rnrb *= 2;
    }

    // RNRB only applies if residence is left to descendants
    var rnrbApplied = 0;
    if (residenceToDescendants === 'yes' && mainResidence > 0) {
      rnrbApplied = Math.min(mainResidence, rnrb);
    }

    // ── Total Allowances ──
    var totalAllowance = nrb + rnrbApplied;

    // ── Deduct Trusts ──
    var adjustedEstate = Math.max(0, totalEstate - trusts);

    // ── Add Gifts ──
    var totalEstateWithGifts = adjustedEstate + gifts;

    // ── Taxable Estate ──
    var taxableEstate = Math.max(0, totalEstateWithGifts - totalAllowance);

    // ── Gifts Tax (with taper relief) ──
    var giftsTax = 0;
    if (gifts > 0) {
      // Assume average taper relief for gifts (simplified: 3-7 years)
      // In a real scenario, user would input the year of each gift
      // For this version, use an average taper of 50% (5 years)
      var avgTaper = getTaperRelief(5);
      var taxableGifts = Math.max(0, gifts - (totalAllowance - adjustedEstate));
      giftsTax = taxableGifts * CONFIG.standardRate * (1 - avgTaper);
    }

    // ── Charity Reduction ──
    var charityTaxReduction = 0;
    var taxRate = CONFIG.standardRate;
    var charityAmount = totalEstate * charityPct;

    if (charityPct >= CONFIG.charityThreshold && charityAmount > 0) {
      taxRate = CONFIG.reducedRate;
      charityTaxReduction = (CONFIG.standardRate - CONFIG.reducedRate) * taxableEstate;
    }

    // ── Total Tax ──
    var estateTax = taxableEstate * taxRate;
    var totalTax = estateTax + giftsTax;

    // ── Effective Rate ──
    var effectiveRate = totalEstate > 0 ? totalTax / totalEstate : 0;

    // ── Data for Charts ──
    var chartData = {
      'Tax Due': totalTax,
      'Charity Tax Reduction': charityTaxReduction,
      'Gifts Tax': giftsTax
    };

    var comparisonData = {
      'Total Estate': totalEstate,
      'Total Tax': totalTax,
      'Net Estate': totalEstate - totalTax
    };

    return {
      totalTax: totalTax,
      effectiveRate: effectiveRate,
      taxableEstate: taxableEstate,
      nilRateBand: nrb,
      residenceBand: rnrbApplied,
      charityTaxReduction: charityTaxReduction,
      giftsTax: giftsTax,
      taxRate: taxRate,
      chartData: chartData,
      comparisonData: comparisonData,
      error: null
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.totalEstate <= 0) {
      setOutputText('output_totalTaxDue', '—');
      setOutputText('output_effectiveRate', '—');
      setOutputText('output_taxableEstate', '—');
      setOutputText('output_nilRateBand', '—');
      setOutputText('output_residenceBand', '—');
      setOutputText('output_charityTaxReduction', '—');
      setOutputText('output_giftsTax', '—');
      setOutputText('output_taxBreakdown', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateIHT(inputs);

    if (result.error) {
      setOutputText('output_totalTaxDue', '—');
      setOutputText('output_effectiveRate', '—');
      setOutputText('output_taxableEstate', '—');
      setOutputText('output_nilRateBand', '—');
      setOutputText('output_residenceBand', '—');
      setOutputText('output_charityTaxReduction', '—');
      setOutputText('output_giftsTax', '—');
      setOutputText('output_taxBreakdown', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_totalTaxDue', formatCurrency(result.totalTax));
    setOutputText('output_effectiveRate', formatPercent(result.effectiveRate));
    setOutputText('output_taxableEstate', formatCurrency(result.taxableEstate));
    setOutputText('output_nilRateBand', formatCurrency(result.nilRateBand));
    setOutputText('output_residenceBand', formatCurrency(result.residenceBand));
    setOutputText('output_charityTaxReduction', formatCurrency(result.charityTaxReduction));
    setOutputText('output_giftsTax', formatCurrency(result.giftsTax));
    setOutputText('output_taxBreakdown', 'Rate: ' + formatPercent(result.taxRate) + ' | Charity: ' + formatCurrency(result.charityTaxReduction));

    var chartPayload = {
      chartData: result.chartData,
      comparisonData: result.comparisonData,
      totalTax: result.totalTax,
      totalEstate: inputs.totalEstate
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalEstate: inputs.totalEstate,
        totalTax: result.totalTax,
        effectiveRate: result.effectiveRate
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
    if (!data) return null;

    if (tab === 'breakdown') {
      var labels = Object.keys(data.chartData);
      var values = Object.values(data.chartData);

      return {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: ['#D95B43', '#4ade80', '#fbbf24'],
            borderColor: ['#B84A32', '#3a9b6c', '#d4a030'],
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
              text: 'Tax Breakdown',
              font: { size: 14, color: '#e8edf0' }
            }
          }
        }
      };
    }

    if (tab === 'comparison') {
      var labels = Object.keys(data.comparisonData);
      var values = Object.values(data.comparisonData);

      return {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Amount',
            data: values,
            backgroundColor: ['#4A90D9', '#D95B43', '#4ade80'],
            borderColor: ['#3a7b8c', '#B84A32', '#3a9b6c'],
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Estate vs Tax',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#8899aa',
                font: { size: 9 },
                callback: function(v) {
                  try {
                    var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'GBP';
                    return new Intl.NumberFormat('en-GB', {
                      style: 'currency',
                      currency: currencyCode,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(v);
                  } catch (e) {
                    return '£' + v.toFixed(0);
                  }
                }
              }
            },
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#8899aa', font: { size: 10 } }
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
    document.getElementById('input_totalEstate').value = 500000;
    document.getElementById('input_mainResidence').value = 300000;
    document.getElementById('input_residenceToDescendants').value = 'yes';
    document.getElementById('input_spouseTransfer').value = 'no';
    document.getElementById('input_giftsLast7Years').value = 0;
    document.getElementById('input_charityPercentage').value = 0;
    document.getElementById('input_trustsAndOthers').value = 0;
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