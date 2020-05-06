/**
 * We make this error because we dont want to let human error be logged as logic error
 */

class InputError extends Error {
  constructor (...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super (...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) Error.captureStackTrace(this, InputError);

    this.name = 'InputError';
    this.date = new Date();
  };

  toJSON() {
    return ({
      name: this.name,
      message: this.message,
      date: this.date,
    });
  } // https://stackoverflow.com/a/18391400/4468834
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
module.exports = InputError;