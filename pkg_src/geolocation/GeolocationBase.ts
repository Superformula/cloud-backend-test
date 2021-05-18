import axios from 'axios'

/**
 * Geo location abstraction
 * having an address an endpoint and an apiKey,
 * this class is able to calculate latitude and longitude coordinates with a 3rd party service
 */
export default abstract class GeolocationBase
{
	lat?: number
	lon?: number

	apiKey? = ``
	isPublic = false
	address: string

	/**
	 * default constructor
	 * @param address the addres to have it's coordinates fetched
	 */
	constructor(address: string, isPublic = false)
	{
		this.address = address
		this.isPublic = isPublic
	}

	/**
	 * creates a custom request's url
	 * IF overriden, it's outpur will override the createUrl's
	 */
	createCustomUrl(): string | null
	{
		return null
	}

	/**
	 * parses the get geocode response, into valid latitude and longitude values
	 * @returns the pair of latitude and longitude values (if contained in the given payload)
	 */
	// eslint-disable-next-line
	abstract parseResult(payload: {}): { lat: number, lon: number }

	/**
	 * creates the specific request url for this vendor
	 */
	createUrl(): string
	{
		const endpoint = process.env.MAP_BOX_ENDPOINT
		if (!endpoint) throw Error(`impossible to create a request url without the vendor endpoint`)
		if (!this.isPublic)
		{
			const accessKey = process.env.MAP_BOX_ACCESS_KEY
			if (!accessKey) throw Error(`impossible to create a request url without the vendor accessKey`)
			
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return process.env.MAP_BOX_ENDPOINT!.replace(`@`, escape(this.address)).replace(`#`, process.env.MAP_BOX_ACCESS_KEY!)
		}
		else
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return process.env.MAP_BOX_ENDPOINT!.replace(`@`, escape(this.address))
	}

	/**
	 * actually fetches a set of coordinates for the given address
	 */
	async getCoordinates(): Promise<void>
	{
		const url = this.createUrl()
		const response = await axios.get(url)
		if (response.data)
		{
			const values = this.parseResult(response.data)
			if (values)
			{
				this.lat = values.lat
				this.lon = values.lon
			}
		}

	}
}