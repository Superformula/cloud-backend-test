export type GeocodingResponse = {
	features: GeocodingFeature[]
}

export type GeocodingFeature = {
	relevance: number
	place_name: string
	center: [number, number] // [longitude,latitude]
}
