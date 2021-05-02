export type LocationQueryInput = {
	value: string;
};

export type LocationInfo = {
	name: string;
	coordinates: number[];
};

export type LocationQueryOutput = {
	locations: LocationInfo[];
};
