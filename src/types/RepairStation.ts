
export interface RepairStation {
	id: number;
	name: string;
	description: string;
	image: string;
	latitude: number;
	longitude: number;
	created_at: number;
}

export interface RepairStationRequest extends Omit<RepairStation, 'id' | 'created_at'> {}
