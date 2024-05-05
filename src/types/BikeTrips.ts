import { Location } from "./Location";

export interface BikeTrips {
  id: number;
  name: string;
  length: number;
  difficulty: string;
  description: string;
  image: string;
  created_at: number;
}

export interface BikeTripsRequest extends Omit<BikeTrips, 'id' | 'created_at'> {}

export interface BikeTripsLocation extends Location {
  id: number;
  trip_id: number;
}
