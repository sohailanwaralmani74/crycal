(function() {
    let chart;
    window.updateTool = function() {
        const base = parseFloat(document.getElementById('input_base_price').value) || 0;
        const disc = parseFloat(document.getElementById('input_discount_percent').value) || 0;
        const vol = parseFloat(document.getElementById('input_volume').value) || 0;
        
        const pricePerDeal = base * (1 - disc/100);
        const totalArr = base * vol;
        const finalArr = pricePerDeal * vol;
        const lost = totalArr - finalArr;

        document.getElementById('output_revenue_lost').innerText = '$' + lost.toFixed(2);
        document.getElementById('output_final_arr').innerText = '$' + finalArr.toFixed(2);

        updateChart(finalArr, lost);
        window.logHistory({
            base_price: base,
            discount_percent: disc,
            revenue_lost: '$' + lost.toFixed(2)
        });
    };

    function updateChart(finalArr, lost) {
        const ctx = document.getElementById('chart_impactChart');
        if (!ctx) return;
        const activeTab = document.querySelector('.chart-tab.active')?.dataset.tab || 'breakdown';
        
        if (chart) chart.destroy();
        
        if (activeTab === 'breakdown') {
            chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Final ARR', 'Lost to Discount'],
                    datasets: [{
                        data: [finalArr, lost],
                        backgroundColor: ['#3b82f6', '#ef4444']
                    }]
                }
            });
        } else {
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Revenue Impact'],
                    datasets: [
                        { label: 'Final ARR', data: [finalArr], backgroundColor: '#3b82f6' },
                        { label: 'Lost', data: [lost], backgroundColor: '#ef4444' }
                    ]
                }
            });
        }
    }

    window.switchChartTab = function(tabId) {
        document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        window.updateTool();
    };

    window.resetTool = function() {
        document.getElementById('input_base_price').value = '10000';
        document.getElementById('input_discount_percent').value = '15';
        document.getElementById('input_volume').value = '50';
        window.switchChartTab('breakdown');
        window.updateTool();
    };

    setTimeout(window.updateTool, 100);
})();
