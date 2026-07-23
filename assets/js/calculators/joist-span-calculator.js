(function() {
  'use strict';

  var chartInstance = null;

  // Base spans in total inches for Floor L/360 (40 Live / 10 Dead)
  var SPAN_TABLE = {
    '2x6': {
      '12': { df_no2: 129, syp_no2: 122, spf_no2: 117, hem_fir_no2: 121 },
      '16': { df_no2: 117, syp_no2: 116, spf_no2: 106, hem_fir_no2: 110 },
      '24': { df_no2: 96,  syp_no2: 96,  spf_no2: 87,  hem_fir_no2: 90 }
    },
    '2x8': {
      '12': { df_no2: 170, syp_no2: 164, spf_no2: 154, hem_fir_no2: 159 },
      '16': { df_no2: 154, syp_no2: 154, spf_no2: 140, hem_fir_no2: 144 },
      '24': { df_no2: 126, syp_no2: 126, spf_no2: 114, hem_fir_no2: 118 }
    },
    '2x10': {
      '12': { df_no2: 216, syp_no2: 209, spf_no2: 197, hem_fir_no2: 203 },
      '16': { df_no2: 197, syp_no2: 193, spf_no2: 179, hem_fir_no2: 185 },
      '24': { df_no2: 161, syp_no2: 158, spf_no2: 146, hem_fir_no2: 151 }
    },
    '2x12': {
      '12': { df_no2: 263, syp_no2: 247, spf_no2: 239, hem_fir_no2: 247 },
      '16': { df_no2: 239, syp_no2: 229, spf_no2: 217, hem_fir_no2: 225 },
      '24': { df_no2: 195, syp_no2: 187, spf_no2: 177, hem_fir_no2: 184 }
    }
  };

  function init() {
    var calcBtn = document.getElementById('btn_calculate');
    var resetBtn = document.getElementById('btn_reset');

    if (calcBtn) calcBtn.addEventListener('click', calculate);
    if (resetBtn) resetBtn.addEventListener('click', reset);

    var inputs = document.querySelectorAll('.tool-container input, .tool-container select');
    inputs.forEach(function(input) {
      input.addEventListener('input', calculate);
      input.addEventListener('change', calculate);
    });

    calculate();
  }

  function calculate() {
    var joistSize = document.getElementById('input_joistSize').value || '2x10';
    var spacing = document.getElementById('input_spacing').value || '16';
    var woodSpecies = document.getElementById('input_woodSpecies').value || 'df_no2';
    var application = document.getElementById('input_application').value || 'floor_l360';

    var baseInches = SPAN_TABLE[joistSize][spacing][woodSpecies] || 180;

    var multiplier = 1.0;
    var deflectionText = 'L/360 (IRC Floor Standard)';
    var loadText = '40 PSF Live / 10 PSF Dead';

    if (application === 'ceiling_l240') {
      multiplier = 1.15;
      deflectionText = 'L/240 (Attic / Drywall Ceiling)';
      loadText = '20 PSF Live / 10 PSF Dead';
    } else if (application === 'deck_l360') {
      multiplier = 0.92; // Wet service adjustment factor for outdoor pressure treated deck
      deflectionText = 'L/360 (Exterior Deck Code)';
      loadText = '40 PSF Live / 10 PSF Dead';
    }

    var totalInches = Math.round(baseInches * multiplier);
    var feet = Math.floor(totalInches / 12);
    var inches = totalInches % 12;
    var decimalFeet = (totalInches / 12).toFixed(2);

    var outSpanFt = document.querySelector('#output_maxSpanFeet .output-number');
    var outSpanDec = document.querySelector('#output_maxSpanDecimal .output-number');
    var outDeflection = document.querySelector('#output_deflectionLimit .output-number');
    var outLoad = document.querySelector('#output_designLoad .output-number');

    if (outSpanFt) outSpanFt.textContent = feet + ' ft ' + inches + ' in';
    if (outSpanDec) outSpanDec.textContent = decimalFeet + ' ft';
    if (outDeflection) outDeflection.textContent = deflectionText;
    if (outLoad) outLoad.textContent = loadText;

    updateChart(joistSize, spacing, woodSpecies, multiplier);

    if (window.logHistory) {
      window.logHistory('joist-span-calculator', {
        joistSize: joistSize,
        spacing: spacing + '" OC',
        woodSpecies: woodSpecies,
        maxSpanFeet: feet + '\'' + inches + '"',
        deflectionLimit: deflectionText
      });
    }
  }

  function updateChart(joistSize, spacing, woodSpecies, multiplier) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'spanComparison';

    var ctx = canvas.getContext('2d');
    if (tabId === 'joistSizeComparison') {
      var sizes = ['2x6', '2x8', '2x10', '2x12'];
      var spansForSizes = sizes.map(function(s) {
        var inches = SPAN_TABLE[s][spacing][woodSpecies] * multiplier;
        return parseFloat((inches / 12).toFixed(2));
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['2x6', '2x8', '2x10', '2x12'],
          datasets: [{
            label: 'Max Span (Feet)',
            data: spansForSizes,
            backgroundColor: '#2F6F5E'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    } else {
      var spacings = ['12', '16', '24'];
      var spansForSpacings = spacings.map(function(sp) {
        var inches = SPAN_TABLE[joistSize][sp][woodSpecies] * multiplier;
        return parseFloat((inches / 12).toFixed(2));
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['12" OC Spacing', '16" OC Spacing', '24" OC Spacing'],
          datasets: [{
            label: 'Max Span (Feet)',
            data: spansForSpacings,
            backgroundColor: '#4A90E2'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }
  }

  function reset() {
    document.getElementById('input_joistSize').value = '2x10';
    document.getElementById('input_spacing').value = '16';
    document.getElementById('input_woodSpecies').value = 'df_no2';
    document.getElementById('input_application').value = 'floor_l360';
    calculate();
  }

  window.updateTool = calculate;
  window.resetTool = reset;
  window.switchChartTab = function(tabId) {
    var tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(function(t) { t.classList.remove('active'); });
    var target = document.querySelector('.chart-tab[data-tab="' + tabId + '"]');
    if (target) target.classList.add('active');
    calculate();
  };

  document.addEventListener('DOMContentLoaded', init);
})();
