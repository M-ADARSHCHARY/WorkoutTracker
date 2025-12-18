CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE workouts (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,

  workout_name VARCHAR(100) NOT NULL,
  exercise_name VARCHAR(200) NOT NULL,
  workout_date DATE NOT NULL,

  sets INT NOT NULL,
  reps INT NOT NULL,
  weight INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_workouts_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);
