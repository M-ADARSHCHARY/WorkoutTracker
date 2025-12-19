 function changeKeys(addedWorkout) {
    const keyMapping = {
        workoutName: 'workout_name',
        exerciseName: 'exercise_name',
        maxWeight: 'weight',
        workoutDate: 'workout_date',
    };
    const newObject = {};
    for (const key in addedWorkout) {
        if (keyMapping[key]) {
            newObject[keyMapping[key]] = addedWorkout[key];
        } else {
            newObject[key] = addedWorkout[key];
        }
    }
    return newObject;
}

export { changeKeys };