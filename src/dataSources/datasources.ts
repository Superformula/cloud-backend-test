import Container from "typedi";
import { LocationService } from "../services/locationService";

export const dataSources = () => ({
    locationService:  Container.get(LocationService)
});