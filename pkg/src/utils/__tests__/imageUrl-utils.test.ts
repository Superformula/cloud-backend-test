import { getImageUrl, getRandomImageUrl } from '../imageUrl-utils'

describe(`Trying to get an random avatar`, () => {
	it(`Calling the unplash api`, async () => {
		const url = await getRandomImageUrl()

		expect(url).toBeTruthy()
	})
})

describe(`Working with a database stored imageUrl`, () => {
	it(`Empty url provided`, () => { expect(() => getImageUrl(``)).toThrowError(`invalid image information`) })
	it(`Invalid url`, () => { expect(() => getImageUrl(`invalid url`)).toThrowError(`invalid image information`) })
	it(`Valid url`, () => {
		const imageUrl = getImageUrl(`https://avatars.githubusercontent.com/u/84103390?v=4`)
		expect(imageUrl).toBeTruthy()
	})
	it(`Unsplash information`, () => {
		const imageUrl = getImageUrl(`1621005281827-8df4fea4114b;MnwxfDB8MXxyYW5kb218fHx8fHx8fHwxNjIxMTY5ODAw`)
		expect(imageUrl).toBeTruthy()
	})
})
