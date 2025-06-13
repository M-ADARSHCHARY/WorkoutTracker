-- CREATE DATABASE workoutTracker;
USE workoutTracker;



CREATE TABLE workoutData (
    _id VARCHAR(40) NOT NULL PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    Workoutname VARCHAR(100) NOT NULL,
    workout_date DATE,
    Exercise_name VARCHAR(200),
    t_sets INT NOT NULL,
    reps INT NOT NULL,
    weight INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_user_workout FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE
);


CREATE TABLE users (
    _id VARCHAR(40) NOT NULL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

