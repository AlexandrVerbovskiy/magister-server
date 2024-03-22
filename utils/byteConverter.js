function byteConverter(bytes) {
  const megabytes = Math.floor(bytes / (1024 * 1024));
  const kilobytes = Math.floor(bytes / 1024);

  if (megabytes > 0) {
    return megabytes + " MB";
  }

  if (kilobytes > 0) {
    return kilobytes + " KB";
  }

  return bytes + " B";
}

module.exports = byteConverter;
