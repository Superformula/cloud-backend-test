import { IForwardGeoCodingResponse } from '../maps/map-box/interfaces'

export const mockForwardGeoCodingResponse = (): IForwardGeoCodingResponse => ({
  type: 'FeatureCollection',
  query: ['los', 'angeles'],
  features: [
    {
      id: 'place.4817561452465270',
      type: 'Feature',
      place_type: ['place'],
      relevance: 1,
      properties: {
        wikidata: 'Q65'
      },
      text: 'Los Angeles',
      place_name: 'Los Angeles, California, United States',
      bbox: [-118.521447, 33.900014, -118.126728, 34.161439],
      center: [-118.242766, 34.053691],
      geometry: {
        type: 'Point',
        coordinates: [-118.242766, 34.053691]
      },
      context: [
        {
          id: 'district.9101022958465270',
          wikidata: 'Q104994',
          text: 'Los Angeles County'
        },
        {
          id: 'region.9803118085738010',
          short_code: 'US-CA',
          wikidata: 'Q99',
          text: 'California'
        },
        {
          id: 'country.14135384517372290',
          wikidata: 'Q30',
          short_code: 'us',
          text: 'United States'
        }
      ]
    },
    {
      id: 'place.12140383987180310',
      type: 'Feature',
      place_type: ['place'],
      relevance: 1,
      properties: {
        wikidata: 'Q16910'
      },
      text: 'Los Ángeles',
      place_name: 'Los Ángeles, Bío Bío, Chile',
      bbox: [-72.682758, -37.66153, -72.038645, -37.17834],
      center: [-72.35, -37.46667],
      geometry: {
        type: 'Point',
        coordinates: [-72.35, -37.46667]
      },
      context: [
        {
          id: 'region.8544689811876870',
          short_code: 'CL-BI',
          wikidata: 'Q2170',
          text: 'Bío Bío'
        },
        {
          id: 'country.14014124184731110',
          wikidata: 'Q298',
          short_code: 'cl',
          text: 'Chile'
        }
      ]
    },
    {
      id: 'poi.300647807514',
      type: 'Feature',
      place_type: ['poi'],
      relevance: 1,
      properties: {
        foursquare: '439ec330f964a520102c1fe3',
        wikidata: 'Q8731',
        landmark: true,
        address: '1 World Way',
        category: 'airport',
        maki: 'airport'
      },
      text: 'Los Angeles International Airport (LAX)',
      place_name: 'Los Angeles International Airport (LAX), 1 World Way, Los Angeles, California 90045, United States',
      center: [-118.406829, 33.942912],
      geometry: {
        coordinates: [-118.406829, 33.942912],
        type: 'Point'
      },
      context: [
        {
          id: 'neighborhood.8948600002460480',
          text: 'Westchester'
        },
        {
          id: 'postcode.10089952189252730',
          text: '90045'
        },
        {
          id: 'place.4817561452465270',
          wikidata: 'Q65',
          text: 'Los Angeles'
        },
        {
          id: 'district.9101022958465270',
          wikidata: 'Q104994',
          text: 'Los Angeles County'
        },
        {
          id: 'region.9803118085738010',
          short_code: 'US-CA',
          wikidata: 'Q99',
          text: 'California'
        },
        {
          id: 'country.14135384517372290',
          wikidata: 'Q30',
          short_code: 'us',
          text: 'United States'
        }
      ]
    },
    {
      id: 'neighborhood.8442728253180310',
      type: 'Feature',
      place_type: ['neighborhood'],
      relevance: 1,
      properties: {
        wikidata: 'Q390462'
      },
      text: 'Los Ángeles',
      place_name: 'Los Ángeles, Madrid, Madrid, Spain',
      bbox: [-3.707082972, 40.345600311, -3.692974577, 40.364528217],
      center: [-3.699639, 40.356222],
      geometry: {
        type: 'Point',
        coordinates: [-3.699639, 40.356222]
      },
      context: [
        {
          id: 'postcode.9478133561850260',
          text: '28041'
        },
        {
          id: 'locality.12055761232598680',
          wikidata: 'Q919536',
          text: 'Villaverde'
        },
        {
          id: 'place.10708255346562040',
          wikidata: 'Q2807',
          text: 'Madrid'
        },
        {
          id: 'region.9368530433562040',
          wikidata: 'Q2807',
          text: 'Madrid'
        },
        {
          id: 'country.12507185778570100',
          wikidata: 'Q29',
          short_code: 'es',
          text: 'Spain'
        }
      ]
    },
    {
      id: 'poi.1108101583694',
      type: 'Feature',
      place_type: ['poi'],
      relevance: 1,
      properties: {
        foursquare: '40a6af00f964a52027f31ee3',
        landmark: true,
        address: '5905 Wilshire Blvd',
        category: 'art museum, art, museum, painting, art gallery, art galleries, galleries, gallery, museum, tourism'
      },
      text: 'Los Angeles County Museum of Art (LACMA)',
      place_name:
        'Los Angeles County Museum of Art (LACMA), 5905 Wilshire Blvd, Los Angeles, California 90036, United States',
      center: [-118.359204, 34.063476],
      geometry: {
        coordinates: [-118.359204, 34.063476],
        type: 'Point'
      },
      context: [
        {
          id: 'neighborhood.7715508380792720',
          text: 'Miracle Mile'
        },
        {
          id: 'postcode.8608298536194280',
          text: '90036'
        },
        {
          id: 'place.4817561452465270',
          wikidata: 'Q65',
          text: 'Los Angeles'
        },
        {
          id: 'district.9101022958465270',
          wikidata: 'Q104994',
          text: 'Los Angeles County'
        },
        {
          id: 'region.9803118085738010',
          short_code: 'US-CA',
          wikidata: 'Q99',
          text: 'California'
        },
        {
          id: 'country.14135384517372290',
          wikidata: 'Q30',
          short_code: 'us',
          text: 'United States'
        }
      ]
    }
  ],
  attribution:
    'NOTICE: © 2022 Mapbox and its suppliers. All rights reserved. Use of this data is subject to the Mapbox Terms of Service (https://www.mapbox.com/about/maps/). This response and the information it contains may not be retained. POI(s) provided by Foursquare.'
})
