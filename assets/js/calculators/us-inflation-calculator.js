(function() {

  var chartInstance = null;
  var currentTab = 'growth';
  var lastChartData = null;

  // ── Historical CPI Data (1913-2030) ──
 var CPI_DATA = {
  1913: 9.9, 1914: 10.0, 1915: 10.1, 1916: 10.9, 1917: 12.8,
  1918: 15.0, 1919: 17.3, 1920: 20.0, 1921: 17.9, 1922: 16.8,
  1923: 17.1, 1924: 17.1, 1925: 17.5, 1926: 17.7, 1927: 17.4,
  1928: 17.2, 1929: 17.2, 1930: 16.7, 1931: 15.2, 1932: 13.6,
  1933: 12.9, 1934: 13.4, 1935: 13.7, 1936: 13.9, 1937: 14.4,
  1938: 14.1, 1939: 13.9, 1940: 14.0, 1941: 14.7, 1942: 16.3,
  1943: 17.3, 1944: 17.6, 1945: 18.0, 1946: 19.5, 1947: 22.3,
  1948: 24.0, 1949: 23.8, 1950: 24.1, 1951: 26.0, 1952: 26.6,
  1953: 26.8, 1954: 26.9, 1955: 26.8, 1956: 27.2, 1957: 28.1,
  1958: 28.9, 1959: 29.2, 1960: 29.6, 1961: 29.9, 1962: 30.3,
  1963: 30.6, 1964: 31.0, 1965: 31.5, 1966: 32.5, 1967: 33.4,
  1968: 34.8, 1969: 36.7, 1970: 38.8, 1971: 40.5, 1972: 41.8,
  1973: 44.4, 1974: 49.3, 1975: 53.8, 1976: 56.9, 1977: 60.6,
  1978: 65.2, 1979: 72.6, 1980: 82.4, 1981: 90.9, 1982: 96.5,
  1983: 99.6, 1984: 103.9, 1985: 107.6, 1986: 109.6, 1987: 113.6,
  1988: 118.3, 1989: 124.0, 1990: 130.7, 1991: 136.2, 1992: 140.3,
  1993: 144.5, 1994: 148.2, 1995: 152.4, 1996: 156.9, 1997: 160.5,
  1998: 163.0, 1999: 166.6, 2000: 172.2, 2001: 177.1, 2002: 179.9,
  2003: 184.0, 2004: 188.9, 2005: 195.3, 2006: 201.6, 2007: 207.3,
  2008: 215.3, 2009: 214.5, 2010: 218.1, 2011: 224.9, 2012: 229.6,
  2013: 233.0, 2014: 236.7, 2015: 237.0, 2016: 240.0, 2017: 245.1,
  2018: 251.1, 2019: 255.7, 2020: 258.8, 2021: 271.0, 2022: 292.7,
  2023: 304.7, 2024: 313.7, 2025: 321.943, 2026: 335.123
};
  // ── Get Inputs ──
  function getInputs() {
    var amount = parseFloat(document.getElementById('input_amount').value) || 0;
    var startYear = parseInt(document.getElementById('input_startYear').value) || 2000;
    var endYear = parseInt(document.getElementById('input_endYear').value) || 2024;
    var customRate = parseFloat(document.getElementById('input_customRate').value) || 0;

    return {
      amount: amount,
      startYear: startYear,
      endYear: endYear,
      customRate: customRate / 100
    };
  }

  // ── Format Currency ──
  function formatCurrency(amount) {
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

  function formatPercent(value) {
    if (value === undefined || value === null || isNaN(value)) return '—';
    return (value * 100).toFixed(2) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  // ── Get CPI for a Year ──
  function getCPI(year) {
    if (CPI_DATA[year]) return CPI_DATA[year];
    // If year not found, use closest available
    var keys = Object.keys(CPI_DATA).map(Number);
    var closest = keys.reduce(function(prev, curr) {
      return Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev;
    });
    return CPI_DATA[closest];
  }

  // ── Core Calculation ──
  function calculateInflation(inputs) {
    var amount = inputs.amount;
    var startYear = inputs.startYear;
    var endYear = inputs.endYear;
    var customRate = inputs.customRate;

    if (amount <= 0) {
      return { error: 'Enter a valid amount' };
    }

    var startCPI = getCPI(startYear);
    var endCPI = getCPI(endYear);

    var adjustedValue = 0;
    var annualRate = 0;
    var totalChange = 0;

    if (customRate > 0) {
      var years = endYear - startYear;
      adjustedValue = amount * Math.pow(1 + customRate, years);
      annualRate = customRate;
      totalChange = adjustedValue - amount;
    } else {
      adjustedValue = amount * (endCPI / startCPI);
      var years = endYear - startYear;
      if (years > 0 && amount > 0) {
        annualRate = Math.pow(adjustedValue / amount, 1 / years) - 1;
      }
      totalChange = adjustedValue - amount;
    }

    var inflationImpact = ((adjustedValue - amount) / amount) * 100;
    var purchasingPower = 1 / (adjustedValue / amount);

    var dataPoints = [];
    var yearsRange = endYear - startYear;
    var step = yearsRange > 50 ? 5 : (yearsRange > 20 ? 2 : 1);

    for (var year = startYear; year <= endYear; year += step) {
      var cpi = getCPI(year);
      var val = amount * (cpi / startCPI);
      dataPoints.push({
        year: year,
        value: val
      });
    }

    return {
      adjustedValue: adjustedValue,
      totalChange: totalChange,
      annualRate: annualRate,
      inflationImpact: inflationImpact,
      purchasingPower: purchasingPower,
      dataPoints: dataPoints,
      startCPI: startCPI,
      endCPI: endCPI,
      amount: amount,
      startYear: startYear,
      endYear: endYear
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.amount <= 0) {
      setOutputText('output_adjustedValue', '—');
      setOutputText('output_totalChange', '—');
      setOutputText('output_annualRate', '—');
      setOutputText('output_inflationImpact', '—');
      setOutputText('output_purchasingPower', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateInflation(inputs);

    if (result.error) {
      setOutputText('output_adjustedValue', '—');
      setOutputText('output_totalChange', '—');
      setOutputText('output_annualRate', '—');
      setOutputText('output_inflationImpact', '—');
      setOutputText('output_purchasingPower', '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_adjustedValue', formatCurrency(result.adjustedValue));
    setOutputText('output_totalChange', formatCurrency(Math.abs(result.totalChange)));
    setOutputText('output_annualRate', formatPercent(result.annualRate));
    setOutputText('output_inflationImpact', (result.inflationImpact > 0 ? '+' : '') + result.inflationImpact.toFixed(2) + '%');
    setOutputText('output_purchasingPower', '$1.00 in ' + result.startYear + ' = $' + result.purchasingPower.toFixed(4) + ' in ' + result.endYear);

    var chartPayload = {
      dataPoints: result.dataPoints,
      adjustedValue: result.adjustedValue,
      amount: result.amount,
      startYear: result.startYear,
      endYear: result.endYear,
      annualRate: result.annualRate,
      totalChange: result.totalChange,
      inflationImpact: result.inflationImpact
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        amount: inputs.amount,
        startYear: inputs.startYear,
        endYear: inputs.endYear,
        adjustedValue: result.adjustedValue,
        annualRate: result.annualRate
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
    if (!data || !data.dataPoints || data.dataPoints.length === 0) return null;

    if (tab === 'growth') {
      var labels = data.dataPoints.map(function(d) { return d.year; });
      var values = data.dataPoints.map(function(d) { return d.value; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Inflation-Adjusted Value',
            data: values,
            borderColor: '#4A90D9',
            backgroundColor: 'rgba(74, 144, 217, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2
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
              text: 'Value Over Time (' + data.startYear + ' → ' + data.endYear + ')',
              font: { size: 14, color: '#e8edf0' }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#8899aa',
                font: { size: 9 },
                maxTicksLimit: 20
              }
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
      return {
        type: 'doughnut',
        data: {
          labels: ['Original Amount', 'Inflation Impact'],
          datasets: [{
            data: [data.amount, data.totalChange],
            backgroundColor: ['#4A90D9', '#D95B43'],
            borderColor: ['#3a7b8c', '#B84A32'],
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
              text: 'Original Value vs Inflation Impact',
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
    document.getElementById('input_amount').value = 100;
    document.getElementById('input_startYear').value = '2000';
    document.getElementById('input_endYear').value = '2024';
    document.getElementById('input_customRate').value = 0;
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