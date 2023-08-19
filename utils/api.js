const https = require("https");
const fs = require("fs");
const { checkForErrors } = require("./errorHandling");

const weatherAPI = (cityName, tempSettings, currentDateTime) => {
  https
    .get(
      `${process.env.BASE_URL}${cityName}?unitGroup=${tempSettings.tempUnitGroup}&key=${process.env.API_KEY}`,
      (response) => {
        let data = "";

        checkForErrors(response.statusCode);
        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", async () => {
          const weatherData = await JSON.parse(data);
          const { currentConditions, resolvedAddress, description } =
            weatherData;
          const cliDisplay = `Current temperature in ${resolvedAddress} is ${currentConditions.temp}${tempSettings.tempUnit}.\nConditions are currently: ${currentConditions.conditions}.\nWhat you should expect: ${description}`;
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
};

module.exports = weatherAPI;
