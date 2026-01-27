// State capitals coordinates (latitude, longitude)
export const stateCoordinates: Record<string, { lat: number; lng: number; name: string }> = {
  'Acre': { lat: -9.9754, lng: -67.8249, name: 'AC' },
  'Alagoas': { lat: -9.6658, lng: -35.735, name: 'AL' },
  'Amapá': { lat: 0.0349, lng: -51.0694, name: 'AP' },
  'Amazonas': { lat: -3.119, lng: -60.0217, name: 'AM' },
  'Bahia': { lat: -12.9714, lng: -38.5014, name: 'BA' },
  'Ceará': { lat: -3.7172, lng: -38.5433, name: 'CE' },
  'Distrito Federal': { lat: -15.7801, lng: -47.9292, name: 'DF' },
  'Espírito Santo': { lat: -20.3155, lng: -40.3128, name: 'ES' },
  'Goiás': { lat: -16.6869, lng: -49.2648, name: 'GO' },
  'Maranhão': { lat: -2.5297, lng: -44.3028, name: 'MA' },
  'Mato Grosso': { lat: -15.596, lng: -56.0969, name: 'MT' },
  'Mato Grosso do Sul': { lat: -20.4697, lng: -54.6201, name: 'MS' },
  'Minas Gerais': { lat: -19.9191, lng: -43.9386, name: 'MG' },
  'Pará': { lat: -1.4558, lng: -48.4902, name: 'PA' },
  'Paraíba': { lat: -7.115, lng: -34.861, name: 'PB' },
  'Paraná': { lat: -25.4284, lng: -49.2733, name: 'PR' },
  'Pernambuco': { lat: -8.0476, lng: -34.877, name: 'PE' },
  'Piauí': { lat: -5.0892, lng: -42.8019, name: 'PI' },
  'Rio de Janeiro': { lat: -22.9068, lng: -43.1729, name: 'RJ' },
  'Rio Grande do Norte': { lat: -5.7945, lng: -35.211, name: 'RN' },
  'Rio Grande do Sul': { lat: -30.0346, lng: -51.2177, name: 'RS' },
  'Rondônia': { lat: -8.7612, lng: -63.9004, name: 'RO' },
  'Roraima': { lat: 2.8235, lng: -60.6758, name: 'RR' },
  'Santa Catarina': { lat: -27.5954, lng: -48.548, name: 'SC' },
  'São Paulo': { lat: -23.5505, lng: -46.6333, name: 'SP' },
  'Sergipe': { lat: -10.9472, lng: -37.0731, name: 'SE' },
  'Tocantins': { lat: -10.1689, lng: -48.3317, name: 'TO' },
};

// Haversine formula to calculate distance between two coordinates
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Calculate distance between two states
export function getDistanceBetweenStates(state1: string, state2: string): number | null {
  const coord1 = stateCoordinates[state1];
  const coord2 = stateCoordinates[state2];
  
  if (!coord1 || !coord2) return null;
  
  return calculateDistance(coord1.lat, coord1.lng, coord2.lat, coord2.lng);
}

// Format distance for display
export function formatDistance(km: number): string {
  if (km < 100) {
    return `~${km} km`;
  } else if (km < 1000) {
    return `~${Math.round(km / 10) * 10} km`;
  } else {
    return `~${(km / 1000).toFixed(1).replace('.0', '')} mil km`;
  }
}
