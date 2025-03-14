document.addEventListener("DOMContentLoaded", async () => {

    const workoutData = await getData()
    if(workoutData != null){
        const ctx = document.getElementById('myChart').getContext('2d');
        
        const labels = workoutData.map(item => item.workout_date);
        const setsData = workoutData.map(item => item.reps);
        const weightData = workoutData.map(item => item.weight);
        
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Max Reps',
                        data: setsData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 2,
                        fill: false
                    },
                    {
                    label: 'Max Weight',
                    data: weightData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
  }

    async function getData() {
        try {
            let response = await fetch("/getData", { method: 'GET' });
            let data = await response.json(); // Assuming JSON response
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    }
    })  