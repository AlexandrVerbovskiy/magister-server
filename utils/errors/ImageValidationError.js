class ImageValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = "ImageValidationError";
    }
  }
  
  module.exports = ImageValidationError;