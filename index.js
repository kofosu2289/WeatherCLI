require("dotenv").config();
const weatherAPI = require("./utils/api");

const [cityName, tempUnitFlag] = [process.argv[2], process.argv[3]];
const tempSettings =
  tempUnitFlag === "-f" || tempUnitFlag === "-fahrenheit"
    ? { tempUnit: "°F", tempUnitGroup: "us" }
    : tempUnitFlag === "-c" || tempUnitFlag === "-celsius"
    ? { tempUnit: "°C", tempUnitGroup: "metric" }
    : tempUnitFlag === "-k" || tempUnitFlag === "-kelvin"
    ? { tempUnit: "K", tempUnitGroup: "base" }
    : { tempUnit: tempUnitFlag, tempUnitGroup: tempUnitFlag };

const currentDateTime = `${new Date().toLocaleString()}`;

weatherAPI(cityName, tempSettings, currentDateTime);
