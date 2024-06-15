import { Location } from "./Location";

export interface BikeTrips {
  id: number;
  public: boolean;
  name: string;
  length: number;
  difficulty: string;
  description: string;
  created_at: number;
}

export interface BikeTripsRequest extends Omit<BikeTrips, 'id' | 'public' | 'created_at' | 'length'> {}

export interface BikeTripsLocation extends Location {
  id: number;
  trip_id: number;
}
