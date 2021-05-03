import { GeolocationRepository } from '../../data-access/repositories/geolocation-repository';
import { UserRepository } from '../../data-access/repositories/user-repository';

export interface Context {
	userRepository: UserRepository;
	geolocationRepository: GeolocationRepository;
}
