-- Usuwa tabele, jeśli istnieją

DROP TABLE IF EXISTS BikePathLocations;
DROP TABLE IF EXISTS BikePaths;
DROP TABLE IF EXISTS BikeTripLocations;
DROP TABLE IF EXISTS BikeTripsPhotos;
DROP TABLE IF EXISTS BikeTripsRatings;
DROP TABLE IF EXISTS BikeTrips;
DROP TABLE IF EXISTS BikeRepairStations;
DROP TABLE IF EXISTS EventParticipants;
DROP TABLE IF EXISTS Events;


-- Tworzy tablice BikePaths która przechowuje informacje o ścieżkach rowerowych.
 
CREATE TABLE IF NOT EXISTS BikePaths (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  length INTEGER
);

-- Tworzy tablice BikePathLocations która przechowuje informacje o lokalizacjach ścieżek rowerowych.

CREATE TABLE IF NOT EXISTS BikePathLocations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path_id INTEGER,
  latitude REAL,
  longitude REAL,
  FOREIGN KEY(path_id) REFERENCES BikePaths(id) ON DELETE CASCADE
);


-- Tworzy tablice BikeTrips która przechowuje informacje o trasach na wycieczki rowerowe.

CREATE TABLE IF NOT EXISTS BikeTrips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  public BOOLEAN DEFAULT 0,
  name TEXT,
  length INTEGER,
  difficulty TEXT,
  description TEXT,
  created_at REAL
);

-- Tworzy tablice BikeTripLocations która przechowuje informacje o lokalizacjach tras na wycieczki rowerowe.

CREATE TABLE IF NOT EXISTS BikeTripLocations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trip_id INTEGER,
  latitude REAL,
  longitude REAL,
  FOREIGN KEY(trip_id) REFERENCES BikeTrips(id) ON DELETE CASCADE
);

-- Tworzy tablice BikeTripsPhotos która przechowuje informacje o zdjęciach tras na wycieczki rowerowe.

CREATE TABLE IF NOT EXISTS BikeTripsPhotos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  public BOOLEAN DEFAULT 0,
  trip_id INTEGER,
  image BLOB,
  created_at REAL,
  FOREIGN KEY(trip_id) REFERENCES BikeTrips(id) ON DELETE CASCADE
);

-- Tworzy tablice BikeTripsRatings która przechowuje informacje o ocenach tras na wycieczki rowerowe.

CREATE TABLE IF NOT EXISTS BikeTripsRatings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trip_id INTEGER,
  rating INTEGER,
  FOREIGN KEY(trip_id) REFERENCES BikeTrips(id) ON DELETE CASCADE
);

-- Tworzy tablice BikeRepairStations która przechowuje informacje o stacjach serwisowych rowerów.

CREATE TABLE IF NOT EXISTS BikeRepairStations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  description TEXT,
  image BLOB,
  latitude REAL,
  longitude REAL,
  created_at REAL
);

-- Tworzy tablice Events która przechowuje informacje o wydarzeniach.

CREATE TABLE IF NOT EXISTS Events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  description TEXT,
  image BLOB,
  date REAL,
  created_at REAL
);

-- Tworzy tablice EventParticipants która przechowuje informacje o uczestnikach wydarzeń.

CREATE TABLE IF NOT EXISTS EventParticipants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER,
  user_uuid TEXT,
  FOREIGN KEY(event_id) REFERENCES Events(id) ON DELETE CASCADE
);