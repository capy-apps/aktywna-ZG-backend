
export interface BikePaths {
  id: number;
  name: string;
  length: number;
}

export interface BikePathsRequest extends Omit<BikePaths, 'id'> {}