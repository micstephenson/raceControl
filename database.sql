CREATE DATABASE raceControl

CREATE TABLE participants (
    participant_id SERIAL PRIMARY KEY,
    participant_first_name VARCHAR(50) NOT NULL,
    participant_last_name VARCHAR(50) NOT NULL,
    participant_runner_number INT NOT NULL

);

CREATE TABLE admin (
    admin_id SERIAL PRIMARY KEY,
    admin_first_name VARCHAR(50) NOT NULL,
    admin_last_name VARCHAR(50) NOT NULL,
    admin_password VARCHAR(255) NOT NULL
)