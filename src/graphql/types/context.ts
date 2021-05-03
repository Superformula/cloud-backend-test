import { GeolocationRepository } from '../../database/repositories/geolocation-repository';
import { UserRepository } from '../../database/repositories/user-repository';

export interface Context {
	userRepository: UserRepository;
	geolocationRepository: GeolocationRepository;
}
