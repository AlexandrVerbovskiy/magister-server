const Jimp = require("jimp");

async function cropImageByColor(inputPath, outputPath, color) {
  Jimp.read(inputPath)
    .then((image) => {
      image.color([{ apply: "mix", params: [color, 0] }]);

      // Шукаємо червоний колір (255, 0, 0) на рамці
      let redPixelFound = false;
      let xStart, yStart, xEnd, yEnd;

      // Перебираємо пікселі зображення
      image.scan(
        0,
        0,
        image.bitmap.width,
        image.bitmap.height,
        function (x, y, idx) {
          const red = this.bitmap.data[idx + 0];
          const green = this.bitmap.data[idx + 1];
          const blue = this.bitmap.data[idx + 2];

          // Перевіряємо, чи це червоний колір (255, 0, 0)
          if (red === 255 && green === 0 && blue === 0) {
            if (!redPixelFound) {
              // Якщо це перший червоний піксель, запам'ятовуємо його координати
              xStart = x;
              yStart = y;
              redPixelFound = true;
            } else {
              xEnd = x;
              yEnd = y;
              return false;
            }
          }
        }
      );

      if (redPixelFound) {
        const rectWidth = xEnd - xStart;
        const rectHeight = yEnd - yStart;

        image
          .crop(xStart+5, yStart+5, rectWidth-5, rectHeight-5)
          .write(outputPath, () => {
            console.log("Red rectangle content saved as output.png");
          });
      } else {
        console.log("Red rectangle not found on the frame");
      }
    })
    .catch((err) => {
      console.error("Error:", err);
    });
}

module.exports = cropImageByColor;
