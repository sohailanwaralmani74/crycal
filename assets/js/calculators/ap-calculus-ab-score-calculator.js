(function() {

  var chartInstance = null;
  var currentTab = 'scoreDistribution';

  function getInputs() {
    return {
      mcq: parseFloat(document.getElementById('input_mcq').value) || 0,
      frq: parseFloat(document.getElementById('input_frq').value) || 0
    };
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateScore(inputs) {
    var mcq = Math.min(45, Math.max(0, inputs.mcq));
    var frq = Math.min(54, Math.max(0, inputs.frq));

    var composite = Math.round((mcq / 45) * 54 + (frq / 54) * 54);
    var apGrade = 1;
    var statusText = 'No Credit (Grade 1)';
    if (composite >= 68) { apGrade = 5; statusText = 'Qualified for Credit (Grade 5 - Extremely Well Qualified)'; }
    else if (composite >= 54) { apGrade = 4; statusText = 'Qualified for Credit (Grade 4 - Well Qualified)'; }
    else if (composite >= 40) { apGrade = 3; statusText = 'Qualified for Credit (Grade 3 - Qualified)'; }
    else if (composite >= 29) { apGrade = 2; statusText = 'No Credit (Grade 2 - Possibly Qualified)'; }

    return {
      mcq: mcq,
      frq: frq,
      compositeScore: composite,
      estimatedScore: apGrade,
      scoreStatus: statusText
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateScore(inputs);

    setOutputText('output_estimatedScore', res.estimatedScore.toString());
    setOutputText('output_compositeScore', res.compositeScore.toString() + ' / 108');
    setOutputText('output_scoreStatus', res.scoreStatus);

    updateCharts(res, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory(res);
    }
  }

  function updateCharts(res, inputs) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    var chartData = generateChartData(currentTab, res, inputs);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, res, inputs) {
    var userComp = res.compositeScore || 0;
    return {
      type: 'bar',
      data: {
        labels: ['Score 1', 'Score 2', 'Score 3', 'Score 4', 'Score 5', 'Your Composite Score'],
        datasets: [{
          label: 'Composite Point Scale',
          data: [28, 39, 53, 67, 108, userComp],
          backgroundColor: [
            '#ef4444',
            '#f97316',
            '#eab308',
            '#3b82f6',
            '#22c55e',
            '#6366f1'
          ],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'AP Grade Threshold Cutoffs vs Your Score' }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 108,
            title: { display: true, text: 'Composite Points' }
          }
        }
      }
    };
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    updateTool();
  }

  function resetTool() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var def = el.dataset.default || el.getAttribute('value') || '';
      if (def) el.value = def;
    });
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      el.addEventListener('input', updateTool);
      el.addEventListener('change', updateTool);
    });
    setTimeout(updateTool, 150);
  });

})();
