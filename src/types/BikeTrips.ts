import { Location } from "./Location";

//Typ trasy rowerowej
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

//Typ lokalizacji na trasie rowerowej
export interface BikeTripsLocation extends Location {
  id: number;
  trip_id: number;
}
