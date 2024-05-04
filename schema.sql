CREATE TABLE IF NOT EXISTS BikePaths (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  length INTEGER,
  difficulty TEXT,
  description TEXT,
  image TEXT,
  created_at REAL
);

CREATE TABLE IF NOT EXISTS BikePathLocations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path_id INTEGER,
  latitude REAL,
  longitude REAL,
  FOREIGN KEY(path_id) REFERENCES BikePaths(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS BikeTrips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  length INTEGER,
  difficulty TEXT,
  description TEXT,
  created_at REAL
);

CREATE TABLE IF NOT EXISTS BikeTripLocations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trip_id INTEGER,
  latitude REAL,
  longitude REAL,
  FOREIGN KEY(trip_id) REFERENCES BikeTrips(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS BikeRepairStations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  description TEXT,
  image TEXT,
  latitude REAL,
  longitude REAL,
  created_at REAL
);

CREATE TABLE IF NOT EXISTS Events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  description TEXT,
  image TEXT,
  date REAL,
  created_at REAL
);