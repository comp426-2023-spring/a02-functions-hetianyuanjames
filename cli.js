#!/usr/bin/env node
import minimist from "minimist";
import fetch from "node-fetch";
import moment from "moment-timezone";

const timezone = moment.tz.guess()

const args = minimist(process.argv.slice(2));

// if -h, print help message
if (args.h){
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


// assign latitude and longitude
let latitude;
let longitude;

// latitude
if (args.n) {
  latitude = args.n;
} else if (args.s) {
  latitude = -args.s;
} else {
  console.log("Latitude must be in range");
  process.exit(0);
}

// longitude
if (args.e) {
  longitude = args.e;
} else if (args.w) {
  longitude = -args.w;
} else {
  console.log("longitude must be in range");
  process.exit(0);
}

// make url
const url = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&timezone=" + timezone + "&daily=precipitation_hours";

// Make a request
const response = await fetch(url);

// Get the data from the request
const data = await response.json();


const days = args.d

// parse string message from data (if it's raining or sunny)

let string;

if(data.daily.precipitation_hours[days] > 0) {
    string = "It's raining ";
}
// else {
//     string = "It should be sunny ";
// }

if (days == 0) {
    string += "today.";
} else if (days > 1) {
    string += "in " + days + " days.";
} else {
    string += "tomorrow.";
}

// if -j, print json data object
// else, print the parsed string

if(args.j) {
    console.log(data);
    process.exit(0)
}
else {
    console.log(string);
}