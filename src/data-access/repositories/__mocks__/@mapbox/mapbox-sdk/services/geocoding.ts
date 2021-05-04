import { MapiRequest } from '@mapbox/mapbox-sdk/lib/classes/mapi-request';
import { MapiResponse } from '@mapbox/mapbox-sdk/lib/classes/mapi-response';
import { GeocodeService } from '@mapbox/mapbox-sdk/services/geocoding';

export const sendFn = jest.fn().mockReturnValue({} as MapiResponse);
export const forwardFn = jest.fn().mockReturnValue({
	send: sendFn,
});

export default function Geocoding(): GeocodeService {
	return {
		forwardGeocode: forwardFn,
		reverseGeocode: () => {
			return {} as MapiRequest;
		},
	};
}
