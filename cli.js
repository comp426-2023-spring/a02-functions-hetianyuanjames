#!/usr/bin/env node

// Import packages
import moment from "moment-timezone";
import minimist from "minimist";
import fetch from "node-fetch";

const args = minimist(process.argv.slice(2));

//  -h  Show help message and exit.
if (args.h) {
  console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
        -h            Show this help message and exit.
        -n, -s        Latitude: N positive; S negative.
        -e, -w        Longitude: E positive; W negative.
        -z            Time zone: uses tz.guess() from moment-timezone by default.
        -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
        -j            Echo pretty JSON from open-meteo API and exit.
    `);
  process.exit(0);
}

let latitude;
let longitude;

//Latitude
if (args.n) {
  latitude = args.n;
} else if (args.s) {
  latitude = -args.s;
} else {
  console.log("Latitude must be in range");
  process.exit(0);
}

//Longitude
if (args.e) {
  longitude = args.e;
} else if (args.w) {
  longitude = -args.w;
} else {
  console.log("longitude must be in range");
  process.exit(0);
}

//Timezone
const timezone = moment.tz.guess();

const url =
  "https://api.open-meteo.com/v1/forecast?latitude=" +
  latitude +
  "&longitude=" +
  longitude +
  "&daily=precipitation_hours&current_weather=true&timezone=" +
  timezone;

const response = await fetch(url);
// Get the data from the request
const data = await response.json();
//return Json data
if (args.j) {
  console.log(data);
  process.exit(0);
}

const days = args.d;

if (days == 0) {
  console.log(
    "It will rain for " +
      data["daily"]["precipitation_hours"][0] +
      "hours today."
  );
} else if (days > 1) {
  console.log(
    "It will rain for " +
      data["daily"]["precipitation_hours"][days] +
      "hours in " +
      days +
      " days."
  );
} else {
  console.log(
    "It will rain for " +
      data["daily"]["precipitation_hours"][1] +
      "hours tomorrow."
  );
}



  