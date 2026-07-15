(function() {

  var chartInstance = null;
  var currentTab = 'growth';
  var lastChartData = null;

  // ── Get Inputs ──
  function getInputs() {
    var currentAge = parseFloat(document.getElementById('input_currentAge').value) || 0;
    var retirementAge = parseFloat(document.getElementById('input_retirementAge').value) || 0;
    var currentAnnualIncome = parseFloat(document.getElementById('input_currentAnnualIncome').value) || 0;
    var currentSavings = parseFloat(document.getElementById('input_currentSavings').value) || 0;
    var annualContribution = parseFloat(document.getElementById('input_annualContribution').value) || 0;
    var employerMatch = parseFloat(document.getElementById('input_employerMatch').value) || 0;
    var expectedReturn = parseFloat(document.getElementById('input_expectedReturn').value) || 0;
    var inflationRate = parseFloat(document.getElementById('input_inflationRate').value) || 0;
    var retirementExpenses = parseFloat(document.getElementById('input_retirementExpenses').value) || 0;
    var currentTaxRate = parseFloat(document.getElementById('input_currentTaxRate').value) || 0;
    var retirementTaxRate = parseFloat(document.getElementById('input_retirementTaxRate').value) || 0;
    var safeWithdrawalRate = parseFloat(document.getElementById('input_safeWithdrawalRate').value) || 0;
    var lifeExpectancy = parseFloat(document.getElementById('input_lifeExpectancy').value) || 0;
    var socialSecurity = parseFloat(document.getElementById('input_socialSecurity').value) || 0;
    var otherIncome = parseFloat(document.getElementById('input_otherIncome').value) || 0;
    var inflationAdjustment = document.getElementById('input_inflationAdjustment').value;

    if (retirementAge <= currentAge) retirementAge = currentAge + 1;
    if (currentAge < 18) currentAge = 18;
    if (currentAge > 80) currentAge = 80;
    if (lifeExpectancy < retirementAge) lifeExpectancy = retirementAge + 5;
    if (lifeExpectancy > 110) lifeExpectancy = 110;

    return {
      currentAge: currentAge,
      retirementAge: retirementAge,
      currentAnnualIncome: currentAnnualIncome,
      currentSavings: currentSavings,
      annualContribution: annualContribution,
      employerMatch: employerMatch / 100,
      expectedReturn: expectedReturn / 100,
      inflationRate: inflationRate / 100,
      retirementExpenses: retirementExpenses,
      currentTaxRate: currentTaxRate / 100,
      retirementTaxRate: retirementTaxRate / 100,
      safeWithdrawalRate: safeWithdrawalRate / 100,
      lifeExpectancy: lifeExpectancy,
      socialSecurity: socialSecurity,
      otherIncome: otherIncome,
      inflationAdjustment: inflationAdjustment
    };
  }

  // ── Format Currency ──
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

  // ── Generate Tips ──
  function generateTips(inputs, result) {
    var tips = [];
    var shortfall = result.shortfall;
    var progress = result.progressToFire;
    var contribution = inputs.annualContribution;
    var expenses = inputs.retirementExpenses;
    var income = inputs.currentAnnualIncome;
    var yearsToRetirement = result.yearsToRetirement;

    if (shortfall < 0) {
      var shortfallPercent = (Math.abs(shortfall) / expenses) * 100;
      if (shortfallPercent > 30) {
        tips.push({ type: '🔴 Critical', title: 'Significant Shortfall Detected', advice: 'You have a ' + shortfallPercent.toFixed(0) + '% shortfall in retirement income.', action: 'Consider increasing contributions, reducing expenses, or delaying retirement.' });
      } else if (shortfallPercent > 15) {
        tips.push({ type: '🟠 Important', title: 'Moderate Shortfall Detected', advice: 'You need to close a ' + shortfallPercent.toFixed(0) + '% gap.', action: 'Consider saving an additional ' + formatCurrency(Math.abs(shortfall) * 0.5) + ' per year.' });
      } else {
        tips.push({ type: '🟡 Caution', title: 'Minor Shortfall Detected', advice: 'A small shortfall can be addressed with minor adjustments.', action: 'Try increasing your savings rate by 2-3% or reducing discretionary spending.' });
      }
    } else {
      var surplusPercent = (shortfall / expenses) * 100;
      if (surplusPercent > 30) {
        tips.push({ type: '✅ Excellent', title: 'Strong Surplus Projected', advice: 'You are well-positioned for retirement with a ' + surplusPercent.toFixed(0) + '% surplus.', action: 'Consider optimizing your withdrawal strategy or exploring tax-efficient investments.' });
      } else if (surplusPercent > 10) {
        tips.push({ type: '✅ Good', title: 'Healthy Surplus Projected', advice: 'You have a comfortable cushion above your target.', action: 'Review your investment allocation to ensure it matches your risk tolerance.' });
      } else {
        tips.push({ type: '🟡 OK', title: 'You Are On Track', advice: 'Your retirement plan is on track with a small surplus.', action: 'Continue your current savings strategy and review annually.' });
      }
    }

    if (progress < 50) {
      tips.push({ type: '🔴 Action Needed', title: 'Progress to FIRE is Low', advice: 'You are only ' + progress.toFixed(0) + '% of the way to your FIRE number.', action: 'Increase your annual savings or explore higher-return investments.' });
    } else if (progress < 80) {
      tips.push({ type: '🟡 On Track', title: 'Good Progress to FIRE', advice: 'You are ' + progress.toFixed(0) + '% of the way to your goal.', action: 'Continue your current strategy and consider increasing contributions as your income grows.' });
    } else {
      tips.push({ type: '✅ Excellent', title: 'Great Progress to FIRE', advice: 'You are ' + progress.toFixed(0) + '% of the way to financial independence.', action: 'Review your withdrawal strategy and consider optimizing for taxes.' });
    }

    if (contribution < 5000) {
      tips.push({ type: '💡 Suggestion', title: 'Consider Increasing Your Contributions', advice: 'Your current annual contribution is ' + formatCurrency(contribution) + '.', action: 'Aiming for at least 10-15% of your income is recommended.' });
    } else if (contribution / income < 0.15) {
      tips.push({ type: '💡 Suggestion', title: 'Good Contributions — Room to Grow', advice: 'You are saving ' + formatPercent(contribution / income) + ' of your income.', action: 'Consider aiming for 15-20% of income for retirement savings.' });
    }

    if (yearsToRetirement < 10) {
      tips.push({ type: '⏰ Consideration', title: 'Close to Retirement', advice: 'You are ' + yearsToRetirement + ' years from retirement.', action: 'Review your withdrawal strategy and consider reducing risk in your portfolio.' });
    }

    return tips;
  }

  // ── Core Calculation ──
  function calculateRetirement(inputs) {
    var currentAge = inputs.currentAge;
    var retirementAge = inputs.retirementAge;
    var income = inputs.currentAnnualIncome;
    var savings = inputs.currentSavings;
    var contribution = inputs.annualContribution;
    var employerMatch = inputs.employerMatch;
    var returnRate = inputs.expectedReturn;
    var inflation = inputs.inflationRate;
    var expenses = inputs.retirementExpenses;
    var retireTax = inputs.retirementTaxRate;
    var swr = inputs.safeWithdrawalRate;
    var life = inputs.lifeExpectancy;
    var socialSecurity = inputs.socialSecurity;
    var otherIncome = inputs.otherIncome;
    var inflationAdjust = inputs.inflationAdjustment;

    var yearsToRetirement = retirementAge - currentAge;
    var yearsInRetirement = life - retirementAge;

    if (yearsToRetirement <= 0 || yearsInRetirement <= 0 || income <= 0) {
      return { error: 'Enter valid values' };
    }

    var matchContribution = income * employerMatch;
    var totalContribution = contribution + matchContribution;

    var projectedSavings = savings;
    var savingsData = [];

    for (var year = 0; year <= yearsToRetirement; year++) {
      var age = currentAge + year;
      var inflFactor = Math.pow(1 + inflation, year);
      var contrib = totalContribution;

      if (inflationAdjust === 'contributions' || inflationAdjust === 'both') {
        contrib = totalContribution * inflFactor;
      }

      projectedSavings += contrib;
      projectedSavings *= (1 + returnRate);

      savingsData.push({
        age: age,
        savings: projectedSavings,
        contribution: contrib
      });
    }

    var retirementIncome = projectedSavings * swr;
    var annualRetirementIncome = retirementIncome + socialSecurity + otherIncome;

    var adjustedExpenses = expenses;
    if (inflationAdjust === 'expenses' || inflationAdjust === 'both') {
      adjustedExpenses = expenses * Math.pow(1 + inflation, yearsToRetirement);
    }

    var afterTaxExpenses = adjustedExpenses * (1 - retireTax);
    var incomeGap = afterTaxExpenses - annualRetirementIncome;
    var monthlyIncome = annualRetirementIncome / 12;
    var fireNumber = adjustedExpenses / swr;
    var progressToFire = (projectedSavings / fireNumber) * 100;
    var shortfall = annualRetirementIncome - afterTaxExpenses;

    var yearsOfSavings = (annualRetirementIncome > 0) ? projectedSavings / annualRetirementIncome : 0;

    var successProbability = 0;
    if (swr <= 0.035) successProbability = 95;
    else if (swr <= 0.04) successProbability = 88;
    else if (swr <= 0.05) successProbability = 75;
    else if (swr <= 0.06) successProbability = 60;
    else successProbability = 45;

    var depletionData = [];
    var balance = projectedSavings;
    var annualWithdrawal = annualRetirementIncome;

    for (var year = 0; year <= yearsInRetirement; year++) {
      var age = retirementAge + year;
      var inflYear = Math.pow(1 + inflation, year);
      var adjustedWithdrawal = annualWithdrawal / inflYear;

      if (balance > 0) {
        balance -= adjustedWithdrawal;
        balance *= (1 + returnRate);
      }

      depletionData.push({
        age: age,
        balance: Math.max(0, balance),
        withdrawal: adjustedWithdrawal
      });
    }

    var incomeData = [];
    for (var year = 0; year <= yearsInRetirement; year++) {
      var age = retirementAge + year;
      var inflYear = Math.pow(1 + inflation, year);
      var adjustedIncome = annualRetirementIncome / inflYear;
      var adjustedExpense = adjustedExpenses / inflYear;

      incomeData.push({
        age: age,
        income: adjustedIncome,
        expenses: adjustedExpense
      });
    }

    var incomeSources = {
      'Withdrawal from Savings': retirementIncome,
      'Social Security / Pension': socialSecurity,
      'Other Income': otherIncome
    };

    var status = '';
    if (shortfall >= 0) {
      var surplusPercent = (shortfall / afterTaxExpenses) * 100;
      if (surplusPercent > 30) status = '✅ Excellent — Well on track';
      else if (surplusPercent > 10) status = '✅ Good — On track';
      else if (surplusPercent > 0) status = '🟡 OK — Close to on track';
      else status = '🟡 Marginal — At the edge';
    } else {
      var shortfallPercent = (Math.abs(shortfall) / afterTaxExpenses) * 100;
      if (shortfallPercent > 30) status = '🔴 Severe Shortfall';
      else if (shortfallPercent > 10) status = '🔴 Shortfall';
      else status = '🟠 Shortfall — Small adjustments needed';
    }

    return {
      projectedSavings: projectedSavings,
      annualIncome: annualRetirementIncome,
      monthlyIncome: monthlyIncome,
      incomeGap: incomeGap,
      fireNumber: fireNumber,
      progressToFire: progressToFire,
      shortfall: shortfall,
      yearsOfSavings: yearsOfSavings,
      successProbability: successProbability,
      status: status,
      savingsData: savingsData,
      incomeData: incomeData,
      incomeSources: incomeSources,
      depletionData: depletionData,
      yearsToRetirement: yearsToRetirement,
      yearsInRetirement: yearsInRetirement,
      retirementAge: retirementAge,
      currentAge: currentAge,
      adjustedExpenses: adjustedExpenses,
      annualRetirementIncome: annualRetirementIncome,
      afterTaxExpenses: afterTaxExpenses,
      expenses: expenses,
      contribution: contribution,
      income: income,
      savings: savings,
      swr: swr
    };
  }

  // ── Main Update ──
  function updateTool() {
    var inputs = getInputs();

    if (inputs.currentAge <= 0 || inputs.retirementAge <= 0 || inputs.currentAnnualIncome <= 0) {
      setOutputText('output_projectedSavings', '—');
      setOutputText('output_annualIncome', '—');
      setOutputText('output_monthlyIncome', '—');
      setOutputText('output_incomeGap', '—');
      setOutputText('output_fireNumber', '—');
      setOutputText('output_progressToFire', '—');
      setOutputText('output_shortfall', '—');
      setOutputText('output_yearsOfSavings', '—');
      setOutputText('output_successProbability', '—');
      setOutputText('output_status', 'Enter your age, retirement age, and income');
      // Clear tips
      var tipsContainer = document.getElementById('tips-container');
      if (tipsContainer) tipsContainer.innerHTML = '<span class="output-number">—</span>';
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var result = calculateRetirement(inputs);

    if (result.error) {
      setOutputText('output_projectedSavings', '—');
      setOutputText('output_annualIncome', '—');
      setOutputText('output_monthlyIncome', '—');
      setOutputText('output_incomeGap', '—');
      setOutputText('output_fireNumber', '—');
      setOutputText('output_progressToFire', '—');
      setOutputText('output_shortfall', '—');
      setOutputText('output_yearsOfSavings', '—');
      setOutputText('output_successProbability', '—');
      setOutputText('output_status', result.error);
      var tipsContainer = document.getElementById('tips-container');
      if (tipsContainer) tipsContainer.innerHTML = '<span class="output-number">—</span>';
      lastChartData = null;
      updateCharts(null);
      return;
    }

    setOutputText('output_projectedSavings', formatCurrency(result.projectedSavings));
    setOutputText('output_annualIncome', formatCurrency(result.annualIncome));
    setOutputText('output_monthlyIncome', formatCurrency(result.monthlyIncome));
    setOutputText('output_incomeGap', formatCurrency(result.incomeGap));
    setOutputText('output_fireNumber', formatCurrency(result.fireNumber));
    setOutputText('output_progressToFire', result.progressToFire.toFixed(1) + '%');
    setOutputText('output_shortfall', formatCurrency(result.shortfall) + ' (' + (result.shortfall > 0 ? 'Surplus' : 'Shortfall') + ')');
    setOutputText('output_yearsOfSavings', result.yearsOfSavings.toFixed(1) + ' years');
    setOutputText('output_successProbability', result.successProbability.toFixed(0) + '%');
    setOutputText('output_status', result.status);

    // ── Render Tips ──
    var tips = generateTips(inputs, result);
    var tipsHtml = '';
    if (tips.length > 0) {
      tipsHtml = '<div class="tips-container">';
      tips.forEach(function(tip) {
        tipsHtml += '<div class="tip-item">';
        tipsHtml += '<div class="tip-type">' + tip.type + '</div>';
        tipsHtml += '<div class="tip-title">' + tip.title + '</div>';
        tipsHtml += '<div class="tip-advice">' + tip.advice + '</div>';
        tipsHtml += '<div class="tip-action">💡 ' + tip.action + '</div>';
        tipsHtml += '</div>';
      });
      tipsHtml += '</div>';
    } else {
      tipsHtml = '<span class="output-number">—</span>';
    }
    var tipsContainer = document.getElementById('tips-container');
    if (tipsContainer) tipsContainer.innerHTML = tipsHtml;

    var chartPayload = {
      savingsData: result.savingsData,
      incomeData: result.incomeData,
      incomeSources: result.incomeSources,
      depletionData: result.depletionData,
      projectedSavings: result.projectedSavings,
      annualIncome: result.annualIncome,
      expenses: result.adjustedExpenses,
      retirementAge: result.retirementAge,
      currentAge: result.currentAge,
      yearsToRetirement: result.yearsToRetirement,
      yearsInRetirement: result.yearsInRetirement,
      shortfall: result.shortfall,
      progressToFire: result.progressToFire,
      fireNumber: result.fireNumber
    };
    lastChartData = chartPayload;
    updateCharts(chartPayload);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentAge: inputs.currentAge,
        retirementAge: inputs.retirementAge,
        currentSavings: inputs.currentSavings,
        annualContribution: inputs.annualContribution,
        projectedSavings: result.projectedSavings,
        annualIncome: result.annualIncome,
        status: result.status
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

    if (tab === 'growth') {
      if (!data.savingsData || data.savingsData.length === 0) return null;

      var labels = data.savingsData.map(function(d) { return 'Age ' + d.age; });
      var savings = data.savingsData.map(function(d) { return d.savings; });

      var filteredLabels = labels.filter(function(d, i) { return i % 5 === 0 || i === 0 || i === labels.length - 1; });
      var filteredSavings = savings.filter(function(d, i) { return i % 5 === 0 || i === 0 || i === savings.length - 1; });

      return {
        type: 'line',
        data: {
          labels: filteredLabels,
          datasets: [{
            label: 'Retirement Savings',
            data: filteredSavings,
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
            legend: { position: 'top', labels: { color: '#e8edf0', font: { size: 10 } } },
            title: { display: true, text: 'Savings Growth Over Time', font: { size: 14, color: '#e8edf0' } }
          },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, maxTicksLimit: 20 } },
            y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, callback: function(v) { try { var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD'; return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v); } catch (e) { return '$' + v.toFixed(0); } } } }
          },
          interaction: { intersect: false, mode: 'index' }
        }
      };
    }

    if (tab === 'income') {
      if (!data.incomeData || data.incomeData.length === 0) return null;

      var labels = data.incomeData.map(function(d) { return 'Age ' + d.age; });
      var incomes = data.incomeData.map(function(d) { return d.income; });
      var expenses = data.incomeData.map(function(d) { return d.expenses; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            { label: 'Income', data: incomes, borderColor: '#4ade80', backgroundColor: 'rgba(74,222,128,0.05)', fill: false, tension: 0.3, pointRadius: 0, borderWidth: 2 },
            { label: 'Expenses', data: expenses, borderColor: '#D95B43', backgroundColor: 'rgba(217,91,67,0.05)', fill: false, tension: 0.3, pointRadius: 0, borderWidth: 2 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { color: '#e8edf0', font: { size: 10 } } },
            title: { display: true, text: 'Retirement Income vs Expenses', font: { size: 14, color: '#e8edf0' } }
          },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, maxTicksLimit: 20 } },
            y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, callback: function(v) { try { var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD'; return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v); } catch (e) { return '$' + v.toFixed(0); } } } }
          },
          interaction: { intersect: false, mode: 'index' }
        }
      };
    }

    if (tab === 'breakdown') {
      var labels = Object.keys(data.incomeSources);
      var values = Object.values(data.incomeSources);

      return {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: ['#4A90D9', '#4ade80', '#fbbf24'],
            borderColor: ['#3a7b8c', '#3a9b6c', '#d4a030'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e8edf0', font: { size: 10 } } },
            title: { display: true, text: 'Retirement Income Sources', font: { size: 14, color: '#e8edf0' } }
          }
        }
      };
    }

    if (tab === 'depletion') {
      if (!data.depletionData || data.depletionData.length === 0) return null;

      var labels = data.depletionData.map(function(d) { return 'Age ' + d.age; });
      var balances = data.depletionData.map(function(d) { return d.balance; });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Savings Balance',
            data: balances,
            borderColor: '#D95B43',
            backgroundColor: 'rgba(217,91,67,0.1)',
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
            legend: { position: 'top', labels: { color: '#e8edf0', font: { size: 10 } } },
            title: { display: true, text: 'Savings Depletion Over Retirement', font: { size: 14, color: '#e8edf0' } }
          },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, maxTicksLimit: 20 } },
            y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899aa', font: { size: 9 }, callback: function(v) { try { var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD'; return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v); } catch (e) { return '$' + v.toFixed(0); } } } }
          },
          interaction: { intersect: false, mode: 'index' }
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
    document.getElementById('input_currentAge').value = 35;
    document.getElementById('input_retirementAge').value = 65;
    document.getElementById('input_currentAnnualIncome').value = 80000;
    document.getElementById('input_currentSavings').value = 50000;
    document.getElementById('input_annualContribution').value = 10000;
    document.getElementById('input_employerMatch').value = 5.0;
    document.getElementById('input_expectedReturn').value = 7.0;
    document.getElementById('input_inflationRate').value = 2.5;
    document.getElementById('input_retirementExpenses').value = 50000;
    document.getElementById('input_currentTaxRate').value = 22.0;
    document.getElementById('input_retirementTaxRate').value = 15.0;
    document.getElementById('input_safeWithdrawalRate').value = 4.0;
    document.getElementById('input_lifeExpectancy').value = 90;
    document.getElementById('input_socialSecurity').value = 0;
    document.getElementById('input_otherIncome').value = 0;
    document.getElementById('input_inflationAdjustment').value = 'expenses';
    updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Initialise ──
  document.addEventListener('DOMContentLoaded', function() {
    // Ensure chart canvas exists (your layout should provide it)
    // Set defaults
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