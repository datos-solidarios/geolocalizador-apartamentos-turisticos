const request = require('request-promise')
const utf8 = require('utf8');
require('dotenv').config()
let apiKey = process.env.GEOCODING_API_KEY


let geolocate = async (address) => {
  let curatedGeolocation = {}
  address = utf8.encode(address)
  let url = `https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=${apiKey}&searchtext==${address}`
  let options = {
    'uri': url,
    'headers': {
       keepAlive: true
    },
    forever: true
  }
  let geolocationData = await request(url , function (error, response, body) {
    return body
  })
  geolocationData = get(["Response","View",0,"Result",0,"Location"], JSON.parse(geolocationData))
  if (geolocationData){
    curatedGeolocation.displayCoordenates = geolocationData.DisplayPosition
    curatedGeolocation.navCoordenates = geolocationData.NavigationPosition
    curatedGeolocation.apiAddress = geolocationData.Address.Label
    curatedGeolocation.postalCode = geolocationData.Address.PostalCode
    curatedGeolocation.apiLocationId = geolocationData.LocationId
    console.log(JSON.stringify(curatedGeolocation))
  }
  return curatedGeolocation
}

///////////// Helpers for accessing objects key values that can be null at any point of the process

const get = (p, o) => p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o)

module.exports = geolocate
