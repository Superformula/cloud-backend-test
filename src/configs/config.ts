import dotenv from 'dotenv';
import path from 'path'

var envPath = '';
const env = process.env.NODE_ENV?.trimEnd();
if(env == 'development' || env == 'test')
  envPath = path.join(__dirname, `../../${env}.env`);
else 
envPath = path.join(__dirname, `../${env}.env`);
  
const envFound = dotenv.config({path: envPath});
if (envFound.error) {
  
  throw new Error(`⚠️  Couldn't find .env file. ⚠️ path: ${envPath} | env: ${env}`);
}

export default {
  port: parseInt(process.env.PORT!, 10),

  googleMapsKey: process.env.GOOGLE_MAPS_KEY,

  logs: {
    level: process.env.LOG_LEVEL || 'ERROR',
  },

  appName: process.env.APP_NAME || 'location-Service'
};