class MyError extends Error {
  constructor(name, message) {
    super();
    this.name = name;
    this.stack = message;
  }
}

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



const checkForErrors = (code) => {
    if(code === 400) {
        throw new MyError(errorCodes[code].name, errorCodes[code].message)
    }
    if(code === 401) {
        throw new MyError(errorCodes[code].name, errorCodes[code].message)
      }
      if(code === 500) {
        throw new MyError(errorCodes[500].name, errorCodes[500].message)
      }
      if(code > 299  && (code !== 400 && code !== 401 && code !== 500 )) {
        throw new MyError(errorCodes['"Other'].name, errorCodes["Other"].message)
      }
}

module.exports = { MyError, checkForErrors };
