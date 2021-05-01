import { UserRepository } from '../../database/repositories/user-repository';

export interface Context {
	userRepository: UserRepository;
}
