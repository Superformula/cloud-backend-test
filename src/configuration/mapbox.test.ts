import { accessTokenEnvName, configureMapbox } from './mapbox';

describe('Geolocation repository creation', () => {
	const OLD_ENV = process.env;

	beforeEach(() => {
		process.env = { ...OLD_ENV }; // We want to reset process.env state while calling each test
	});

	it('Should be created if access token environment variable is set', () => {
		const accessKey = 'test-access-key';
		process.env[accessTokenEnvName] = accessKey;
		const config = configureMapbox();
		expect(config).toBeDefined();
		expect(config.accessToken).toBe(accessKey);
	});

	it('Should throw error if access token variable is not set', () => {
		process.env['MAPBOX_ACCESS_TOKEN'] = undefined;
		try {
			configureMapbox();
			fail();
		} catch (error) {
			expect(error.message).toBe('No Mapbox access token provided');
		}
	});
});
