import { Location } from "./Location";

export interface BikePath {
  id: number;
  name: string;
  length: number;
  difficulty: string;
  description: string;
  image: string;
  created_at: number;
}

export interface BikePathRequest extends Omit<BikePath, 'id' | 'created_at'> {}

export interface BikePathLocation extends Location {
  id: number;
  path_id: number;
}
