const API_URL = process.env.API_URL || 'https://<secret>.appsync-api.us-west-2.amazonaws.com/graphql'
const API_KEY = process.env.API_KEY || 'da2-<secret>'

const WSS_URL = API_URL.replace('https','wss').replace('appsync-api','appsync-realtime-api')
const HOST = API_URL.replace('https://','').replace('/graphql','')

const api_header = {
    'host': HOST,
    'x-api-key': API_KEY
}
const header_encode = (obj: any) => btoa(JSON.stringify(obj));
const connection_url = WSS_URL + '?header=' + header_encode(api_header) + '&payload=' +  header_encode({})