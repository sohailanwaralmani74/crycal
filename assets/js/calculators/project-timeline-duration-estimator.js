(function() {
  'use strict';

  var chartInstance = null;

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
    var designDays = parseFloat(document.getElementById('input_designPermitDays').value) || 0;
    var demoDays = parseFloat(document.getElementById('input_demoPrepDays').value) || 0;
    var framingDays = parseFloat(document.getElementById('input_framingStructuralDays').value) || 0;
    var tradesDays = parseFloat(document.getElementById('input_roughTradesDays').value) || 0;
    var drywallDays = parseFloat(document.getElementById('input_insulationDrywallDays').value) || 0;
    var finishDays = parseFloat(document.getElementById('input_finishCarpentryPaintDays').value) || 0;
    var bufferPct = parseFloat(document.getElementById('input_weatherBufferPct').value) || 0;
    var daysPerWeek = parseFloat(document.getElementById('input_workDaysPerWeek').value) || 5;

    var subtotalDays = designDays + demoDays + framingDays + tradesDays + drywallDays + finishDays;
    var bufferDays = Math.ceil(subtotalDays * (bufferPct / 100.0));
    var totalDays = subtotalDays + bufferDays;

    var totalWeeks = daysPerWeek > 0 ? (totalDays / daysPerWeek) : 0;
    var totalMonths = totalWeeks / 4.33;

    var outSubtotal = document.querySelector('#output_subtotalWorkDays .output-number');
    var outBuffer = document.querySelector('#output_delayBufferDays .output-number');
    var outTotalDays = document.querySelector('#output_totalWorkDays .output-number');
    var outWeeks = document.querySelector('#output_totalDurationWeeks .output-number');
    var outMonths = document.querySelector('#output_totalDurationMonths .output-number');

    if (outSubtotal) outSubtotal.textContent = subtotalDays + ' Work Days';
    if (outBuffer) outBuffer.textContent = bufferDays + ' Days (' + bufferPct + '% buffer)';
    if (outTotalDays) outTotalDays.textContent = totalDays + ' Work Days';
    if (outWeeks) outWeeks.textContent = totalWeeks.toFixed(1) + ' Calendar Weeks';
    if (outMonths) outMonths.textContent = totalMonths.toFixed(1) + ' Months';

    updateChart(designDays, demoDays, framingDays, tradesDays, drywallDays, finishDays, bufferDays, totalWeeks, daysPerWeek);

    if (window.logHistory) {
      window.logHistory('project-timeline-duration-estimator', {
        totalDurationWeeks: totalWeeks.toFixed(1) + ' Weeks',
        totalWorkDays: totalDays + ' Days',
        delayBufferDays: bufferDays + ' Days',
        totalDurationMonths: totalMonths.toFixed(1) + ' Months'
      });
    }
  }

  function updateChart(designDays, demoDays, framingDays, tradesDays, drywallDays, finishDays, bufferDays, totalWeeks, daysPerWeek) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var tabId = activeTab ? activeTab.getAttribute('data-tab') : 'phaseDurationChart';

    var ctx = canvas.getContext('2d');
    if (tabId === 'timelineWeeksChart') {
      var cumDesignW = (designDays / daysPerWeek).toFixed(1);
      var cumDemoW = ((designDays + demoDays) / daysPerWeek).toFixed(1);
      var cumFramingW = ((designDays + demoDays + framingDays) / daysPerWeek).toFixed(1);
      var cumTradesW = ((designDays + demoDays + framingDays + tradesDays) / daysPerWeek).toFixed(1);
      var cumDrywallW = ((designDays + demoDays + framingDays + tradesDays + drywallDays) / daysPerWeek).toFixed(1);
      var cumFinishW = ((designDays + demoDays + framingDays + tradesDays + drywallDays + finishDays) / daysPerWeek).toFixed(1);
      var cumTotalW = totalWeeks.toFixed(1);

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Design', 'Demo', 'Framing', 'Trades', 'Drywall', 'Finishes', 'Total Buffer'],
          datasets: [{
            label: 'Cumulative Schedule (Weeks)',
            data: [cumDesignW, cumDemoW, cumFramingW, cumTradesW, cumDrywallW, cumFinishW, cumTotalW],
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
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Design & Permitting', 'Demolition & Prep', 'Framing & Subfloor', 'Rough Trades (MEP)', 'Insulation & Drywall', 'Finishes & Paint', 'Contingency Buffer'],
          datasets: [{
            data: [designDays, demoDays, framingDays, tradesDays, drywallDays, finishDays, bufferDays],
            backgroundColor: ['#2563EB', '#DC2626', '#D97706', '#059669', '#7C3AED', '#DB2777', '#C08A2E']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  function reset() {
    document.getElementById('input_designPermitDays').value = 15;
    document.getElementById('input_demoPrepDays').value = 5;
    document.getElementById('input_framingStructuralDays').value = 8;
    document.getElementById('input_roughTradesDays').value = 10;
    document.getElementById('input_insulationDrywallDays').value = 7;
    document.getElementById('input_finishCarpentryPaintDays').value = 10;
    document.getElementById('input_weatherBufferPct').value = 15;
    document.getElementById('input_workDaysPerWeek').value = "5";
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
