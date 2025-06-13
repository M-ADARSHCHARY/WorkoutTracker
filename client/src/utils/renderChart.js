import { Chart } from 'chart.js/auto';

/**
 * Renders a line chart with weights and reps.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
 * @param {Array} workoutData - Workout data array.
 * @param {string} exerciseName - Name of the selected exercise.
 * @returns {Chart} - The created chart instance.
 */
export function renderChart(ctx, workoutData, exerciseName) {
  const dates = workoutData.map(item => new Date(item.workout_date).toLocaleDateString());
  const weights = workoutData.map(item => item.weight);
  const reps = workoutData.map(item => item.reps);

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: 'Weight (kg)',
          data: weights,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          yAxisID: 'y',
          tension: 0.3,
        },
        {
          label: 'Reps',
          data: reps,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          yAxisID: 'y1',
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: `${exerciseName} Progress`,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              label += context.parsed.y;
              return label;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date',
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Weight (kg)',
          },
          min: Math.min(...weights) - 5,
          max: Math.max(...weights) + 5,
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Reps',
          },
          min: Math.min(...reps) - 5,
          max: Math.max(...reps) + 5,
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    },
  });
}
