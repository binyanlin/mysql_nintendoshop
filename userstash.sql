DROP DATABASE IF EXISTS nintendoFan_db;

CREATE DATABASE nintendoFan_db;

USE nintendoFan_db;

CREATE TABLE fanInventory(
  id INT NOT NULL AUTO_INCREMENT,
  category VARCHAR(30) NOT NULL,
  console VARCHAR(30) NOT NULL,
  item VARCHAR(30) NOT NULL,
  stock INT(5) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id)
);

