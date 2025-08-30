const sanitizeHtml = require("sanitize-html");
const { AppError } = require("../errors/AppError");

function sanitize(value) {
    if (typeof value == "string") {
      // Trim spaces
      value = value.trim().replace(/\s+/g, " ");

      // Strip <script> and other unwanted tags
      value = sanitizeHtml(value, {
        allowedTags: [], // no HTML tags allowed
        allowedAttributes: {}, // no attributes allowed
      });
    } else if (typeof value === "object" && value !== null) {
      value = sanitizeObject(value); // recursive clean
    }
    if(value==="" || value===null || value==="undefined"){
        throw new AppError("Invalid Input",400);
    }
    return value;
}

function sanitizeObject(obj) {
  if(typeof obj == "string") return sanitize(obj);
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  const sanitized = {};
  for (const key in obj) {
    let value = obj[key];
    value = sanitize(value);
    sanitized[key] = value;
  }
  return sanitized;
}

function sanitizeRequests(req, res, next) {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
}

module.exports = { 
    sanitizeRequests
};