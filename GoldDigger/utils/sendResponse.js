export function sendResponse(res, statusCode, contentType, content) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", contentType);
  res.end(content);
}
