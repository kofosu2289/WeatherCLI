require("dotenv").config();
const https = require("https");
const fs = require("fs");
const MyError = require('./utils/errorHandling');

const [cityName, tempUnitFlag] = [process.argv[2], process.argv[3]];
const tempUnit =
  tempUnitFlag === "-f"
    ? "°F"
    : tempUnitFlag === "-c"
    ? "°C"
    : tempUnitFlag === "-k"
    ? "K"
    : tempUnitFlag;
const unitGroup =
  tempUnitFlag === "-f"
    ? "us"
    : tempUnitFlag === "-c"
    ? "metric"
    : tempUnitFlag === "-k"
    ? "base"
    : tempUnitFlag;
const currentDateTime = `${new Date().toLocaleString()}`;

const errorCodes = {
  400: {
    name: "Location Error",
    message:
      "Ooos! It seems you input an invalid location. Check your spelling and try again.",
  },
  401: {
    name: "API Key Error",
    message:
      "It seems your API key is incorrect. Please check it for correctness and try again.",
  },
  500: {
    name: "Invalid Option Flag Error",
    message:
      "It appears you provided an invalid option for the temperature. The valid option flags are: -f or -fahrenheit, -c or -celsius, and -k or -kelvin.",
  },
  Other: {
    name: "Unknown Error",
    message:
      "There appears to be something wrong with the API. Please try again later.",
  },
};

https
  .get(
    `${process.env.BASE_URL}${cityName}?unitGroup=${unitGroup}&key=${process.env.API_KEY}`,
    (response) => {
      let data = "";

      if(response.statusCode === 400) {
        throw new MyError(errorCodes[400].name, errorCodes[400].message)
      } else if(response.statusCode === 401) {
        throw new MyError(errorCodes[401].name, errorCodes[401].message)
      } else if(response.statusCode === 500) {
        throw new MyError(errorCodes[500].name, errorCodes[500].message)
      } else {
        throw new MyError(errorCodes["Other"].name, errorCodes["Other"].message)
      }

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", async () => {
        const weatherData = await JSON.parse(data);
        const { currentConditions, resolvedAddress, description } = weatherData;
        const cliDisplay = `Current temperature in ${resolvedAddress} is ${currentConditions.temp}${tempUnit}.\nConditions are currently: ${currentConditions.conditions}.\nWhat you should expect: ${description}`;
        let fileStatus;

        fs.access("./weather.txt", fs.F_OK, (err) => {
          if (err) {
            fileStatus = "empty";
          } else {
            fileStatus = "exists";
          }

          const fileDataPrefix =
            fileStatus === "empty"
              ? `${currentDateTime}\n\n`
              : `\n\n${currentDateTime}`;

          fs.appendFile(
            "./weather.txt",
            fileDataPrefix + "\n" + cliDisplay,
            (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log(cliDisplay + "\n");
                console.log(
                  "Weather was added to your weather tracking file, weather.txt"
                );
              }
            }
          );
        });
      });
    }
  )
  .on("error", (err) => {
    console.log({ err });
  });
