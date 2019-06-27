DROP DATABASE IF EXISTS nintendo_db;

CREATE DATABASE nintendo_db;

USE nintendo_db;

CREATE TABLE inventory(
  id INT NOT NULL AUTO_INCREMENT,
  category VARCHAR(30) NOT NULL,
  console VARCHAR(30) NOT NULL,
  item VARCHAR(30) NOT NULL,
  stock INT(5) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  sold INT DEFAULT 0,
  PRIMARY KEY (id)
);

INSERT INTO inventory(category, console, item, stock, price, sold)
VALUES 
("video game","N64", "Banjo Kazooie", 4, 15.10, 1),
("video game","N64", "Paper Mario", 8, 20.10, 0),
("video game","N64", "Super Mario 64", 5, 25.10, 2),
("video game","N64", "Donkey Kong 64", 11, 18.05, 0),
("video game","N64", "Legend of Zelda, The Ocarina of Time", 20, 17.50, 11),
("video game","N64", "Legend of Zelda, Majora's Mask", 13, 25.00, 7),
("video game","N64", "Mario Kart 64", 6, 14.10, 0),
("video game","N64", "Kirby 64: The Crystal Shards", 2, 12.79, 3),
("video game","GameCube", "Paper Mario: The Thousand Year Door", 15, 20.00, 18),
("video game","GameCube", "Super Smash Bros Melee", 20, 40.50, 1222),
("video game","GameCube", "Super Metroid", 7, 25.50, 9),
("video game","GameCube", "Super Mario Sunshine", 18, 19.80, 20),
("video game","GameCube", "Legend of Zelda, The Windwaker", 15, 23.40, 10),
("video game","GameCube", "Mario Kart Double Dash", 13, 25.80, 17),
("video game","GameCube", "Fire Emblem: Path of Radiance", 4, 10.00, 0),
("video game","GameCube", "Fire Emblem: Radiant Dawn", 4, 10.00, 0),
("amiibo","Wii", "Mario", 6, 40.00, 2),
("amiibo","Wii", "Link", 5, 40.00, 4),
("amiibo","Wii", "Fox", 4, 40.00, 2),
("amiibo", "Wii", "Rosalina and Luma", 6, 45.00, 5),
("amiibo", "Wii", "Greninja", 5, 35.07, 5);

CREATE TABLE fanInventory(
  id INT NOT NULL AUTO_INCREMENT,
  category VARCHAR(100) NOT NULL,
  console VARCHAR(100) NOT NULL,
  item VARCHAR(100) NOT NULL,
  stock INT(5) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id)
);