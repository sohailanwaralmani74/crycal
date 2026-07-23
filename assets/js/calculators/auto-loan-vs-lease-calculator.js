(function() {

  var chartInstance = null;
  var currentTab = 'cost_comparison';

  function getInputs() {
    return {
      vehiclePrice: parseFloat(document.getElementById('input_vehiclePrice').value) || 0,
      loanTermMonths: parseInt(document.getElementById('input_loanTermMonths').value, 10) || 60,
      loanInterestRate: parseFloat(document.getElementById('input_loanInterestRate').value) || 0,
      loanDownPayment: parseFloat(document.getElementById('input_loanDownPayment').value) || 0,
      leaseTermMonths: parseInt(document.getElementById('input_leaseTermMonths').value, 10) || 36,
      leaseMonthlyPayment: parseFloat(document.getElementById('input_leaseMonthlyPayment').value) || 0,
      leaseDownPayment: parseFloat(document.getElementById('input_leaseDownPayment').value) || 0,
      leaseResidualValue: parseFloat(document.getElementById('input_leaseResidualValue').value) || 0
    };
  }

  function formatCurrency(amount) {
    var code = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(2);
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

  function calculateComparison(inputs) {
    var V = inputs.vehiclePrice;
    var nL = inputs.loanTermMonths;
    var rL = (inputs.loanInterestRate / 100) / 12;
    var DL = inputs.loanDownPayment;

    var nS = inputs.leaseTermMonths;
    var MS = inputs.leaseMonthlyPayment;
    var DS = inputs.leaseDownPayment;
    var R = inputs.leaseResidualValue;

    // Loan calculations
    var loanPrincipal = Math.max(0, V - DL);
    var loanMonthlyPayment = 0;
    if (loanPrincipal > 0 && nL > 0) {
      if (rL > 0) {
        loanMonthlyPayment = (loanPrincipal * rL * Math.pow(1 + rL, nL)) / (Math.pow(1 + rL, nL) - 1);
      } else {
        loanMonthlyPayment = loanPrincipal / nL;
      }
    }

    var loanTotalCashSpentAtLeaseEnd = DL + (loanMonthlyPayment * Math.min(nL, nS));
    var totalLoanOutofPocket = DL + (loanMonthlyPayment * nL);

    // Remaining balance at lease end month (nS)
    var remainingBalanceAtLeaseEnd = loanPrincipal;
    if (rL > 0 && nL > 0) {
      for (var m = 1; m <= Math.min(nL, nS); m++) {
        var intM = remainingBalanceAtLeaseEnd * rL;
        var prinM = loanMonthlyPayment - intM;
        remainingBalanceAtLeaseEnd = Math.max(0, remainingBalanceAtLeaseEnd - prinM);
      }
    } else {
      remainingBalanceAtLeaseEnd = Math.max(0, loanPrincipal - (loanMonthlyPayment * Math.min(nL, nS)));
    }

    var loanEquityAtLeaseEnd = Math.max(0, R - remainingBalanceAtLeaseEnd);
    var netCostLoanAtLeaseEnd = loanTotalCashSpentAtLeaseEnd - loanEquityAtLeaseEnd;

    // Lease calculations
    var leaseTotalOutofPocket = DS + (MS * nS);
    var netCostLease = leaseTotalOutofPocket;

    var recommended = '';
    if (netCostLoanAtLeaseEnd < netCostLease) {
      recommended = 'Buying Saves ' + formatCurrency(netCostLease - netCostLoanAtLeaseEnd) + ' Over ' + nS + ' Mos';
    } else if (netCostLease < netCostLoanAtLeaseEnd) {
      recommended = 'Leasing Saves ' + formatCurrency(netCostLoanAtLeaseEnd - netCostLease) + ' Over ' + nS + ' Mos';
    } else {
      recommended = 'Equal Net Financial Cost';
    }

    return {
      loanMonthlyPayment: loanMonthlyPayment,
      totalLoanOutofPocket: totalLoanOutofPocket,
      leaseTotalOutofPocket: leaseTotalOutofPocket,
      loanEquityAtLeaseEnd: loanEquityAtLeaseEnd,
      netCostLoan: netCostLoanAtLeaseEnd,
      netCostLease: netCostLease,
      recommendedOption: recommended
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateComparison(inputs);

    setOutputText('output_loanMonthlyPayment', formatCurrency(res.loanMonthlyPayment));
    setOutputText('output_loanTotalOutofPocket', formatCurrency(res.totalLoanOutofPocket));
    setOutputText('output_leaseTotalOutofPocket', formatCurrency(res.leaseTotalOutofPocket));
    setOutputText('output_loanVehicleEquity', formatCurrency(res.loanEquityAtLeaseEnd));
    setOutputText('output_netCostLoan', formatCurrency(res.netCostLoan));
    setOutputText('output_recommendedOption', res.recommendedOption);

    updateCharts(res, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        vehiclePrice: inputs.vehiclePrice,
        loanMonthlyPayment: res.loanMonthlyPayment,
        loanTotalCost: res.totalLoanOutofPocket,
        leaseTotalCost: res.leaseTotalOutofPocket,
        recommendedOption: res.recommendedOption
      });
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
    var sym = (typeof getCurrencySymbol === 'function') ? getCurrencySymbol(getGlobalCurrency() || 'USD') : '$';

    if (tab === 'cost_comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Buying Net Cost', 'Leasing Total Cost', 'Buying Built Equity'],
          datasets: [{
            label: 'Amount ',
            data: [
              Math.round(res.netCostLoan),
              Math.round(res.netCostLease),
              Math.round(res.loanEquityAtLeaseEnd)
            ],
            backgroundColor: ['#4A90D9', '#E05A47', '#2E7D32'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Net Financial Cost Comparison (At Lease Term End)' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: function(v) { return sym + v.toLocaleString(); } }
            }
          }
        }
      };
    } else if (tab === 'equity_trajectory') {
      return {
        type: 'bar',
        data: {
          labels: ['Total Cash Out-of-Pocket', 'Net Financial Cost (Spent - Equity)'],
          datasets: [
            {
              label: 'Buying (Auto Loan)',
              data: [Math.round(res.totalLoanOutofPocket), Math.round(res.netCostLoan)],
              backgroundColor: '#4A90D9'
            },
            {
              label: 'Leasing',
              data: [Math.round(res.leaseTotalOutofPocket), Math.round(res.netCostLease)],
              backgroundColor: '#E05A47'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Out-of-Pocket Cash vs Net Financial Cost' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: function(v) { return sym + v.toLocaleString(); } }
            }
          }
        }
      };
    }

    return null;
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
