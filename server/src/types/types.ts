import { LocationService } from '../modules/location/location.service';
import { UserService } from '../modules/user/user.service';

export type AppContext = {
  userService: UserService
  locationService: LocationService
}
