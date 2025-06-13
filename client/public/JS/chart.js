const chartBtn = document.getElementById("showChartBtn");

chartBtn.addEventListener("click", async (e) => {
  const selectedEx = document.getElementById("exerciseSelect").value;
  if (!selectedEx) {
    alert("Select An Exercise First..!");
    return;
  }

  const workoutData = await getData(selectedEx);
  if(workoutData.length == 0){
    alert("No data available")
    return
  }

  renderChart(selectedEx,workoutData);
 

  
});

async function getData(selectedEx) {
    try {
      let response = await fetch(`/wt/getData/${selectedEx}`, {
        method: "GET",
      });
      let data = await response.json(); // Assuming JSON response
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  function renderChart(exerciseName,data) {
    const chartContainer = document.getElementById("chartContainer");
    chartContainer.innerHTML = '<canvas id="exerciseChart"></canvas>';
    
    // Format dates for display
    const dates = data.map(item => new Date(item.workout_date).toLocaleDateString());
    const weights = data.map(item => item.weight);
    const reps = data.map(item => item.reps);
    console.log(dates)
    console.log(weights)
    console.log(reps)
    const ctx = document.getElementById('exerciseChart').getContext('2d');
    
    
    // Create new chart with dual axes
    window.exerciseChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Weight (kg)',
            data: weights,
            borderColor: '#10b981', // Green
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            yAxisID: 'y',
            tension: 0.3
          },
          {
            label: 'Reps',
            data: reps,
            borderColor: '#3b82f6', // Blue
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            yAxisID: 'y1',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          title: {
            display: true,
            text: `${exerciseName} Progress`
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                label += context.parsed.y;
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Weight (kg)'
            },
            min: Math.min(...weights) - 5,
            max: Math.max(...weights) + 5
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Reps'
            },
            min: Math.min(...reps) - 5,
            max: Math.max(...reps) + 5,
            grid: {
              drawOnChartArea: false // only show grid for left axis
            }
          }
        }
      }
    });
  }

