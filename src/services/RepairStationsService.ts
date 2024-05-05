import { Env } from '../types';
import { RepairStation, RepairStationRequest } from '../types/RepairStation';

export const RepairStationsService = async (env: Env) => {
	const getAllRepairStations = async (): Promise<Response> => {
		const query = env.DB.prepare('SELECT * FROM BikeRepairStations');
		const { results } = await query.all<RepairStation>();
		return Response.json(results);
	};

	const addRepairStation = async (repairStation: RepairStationRequest): Promise<Response> => {
		const query = await env.DB.prepare(
			'INSERT INTO BikeRepairStations (name, description, image, latitude, longitude, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)'
		)
			.bind(
				repairStation.name,
				repairStation.description,
				repairStation.image,
				repairStation.latitude,
				repairStation.longitude,
				Date.now()
			)
			.run();

		return Response.json({
			id: query.meta.last_row_id,
			...repairStation,
			created_at: Date.now(),
		});
	};

	return {
		getAllRepairStations,
		addRepairStation,
	};
};
