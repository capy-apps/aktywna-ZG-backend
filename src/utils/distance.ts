import { Location } from '../types/Location';

//Funkcja obliczająca odległość między dwoma punktami na podstawie ich współrzędnych geograficznych
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
	const R = 6371;
	const dLat = (lat2 - lat1) * (Math.PI / 180);
	const dLon = (lon2 - lon1) * (Math.PI / 180);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * (Math.PI / 180)) *
			Math.cos(lat2 * (Math.PI / 180)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c;
	return d;
}

//Funkcja obliczająca całkowitą odległość między punktami w trasie
export function calculateTotalDistance(locations: Location[]): number {
	let totalDistance = 0;
	for (let i = 0; i < locations.length - 1; i++) {
		const { latitude: lat1, longitude: lon1 } = locations[i];
		const { latitude: lat2, longitude: lon2 } = locations[i + 1];
		totalDistance += calculateDistance(lat1, lon1, lat2, lon2);
	}
	return Math.round(totalDistance * 100) / 100
}
