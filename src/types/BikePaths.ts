
export interface BikePaths {
  id: number;
  name: string;
  length: number;
}

export interface BikePathsRequest extends Omit<BikePaths, 'id'> {}

export interface BikePathsLocation {
  id: number;
  path_id: number;
  latitude: number;
  longitude: number;
}