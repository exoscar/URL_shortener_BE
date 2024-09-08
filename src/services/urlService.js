import { redisClient } from "../config/redis.js";
import { encodeBase62, generateUUID } from "../utils/index.js";
import { Op } from "sequelize";
import db from "../../models/index.js";
const URL = db.URL;
const errors = {
  urlNotFound: {
    message: "URL not found",
    statusCode: 404,
  },
  aliasAlreadyTaken: {
    message: "Custom alias is already taken.",
    statusCode: 409,
  },
  internalServerError: (message) => ({
    message: message || "Internal Server Error",
    statusCode: 500,
  }),
};

async function generateShortUrl(longUrl, customAlias = null) {
  try {
    let attempts = 0;
    const maxAttempts = 5;
    let shortUrl = null;

    if (!customAlias) {
      while (attempts < maxAttempts) {
        const id = generateUUID();
        shortUrl = encodeBase62(parseInt(id.replace(/-/g, ""), 16));
        const isExistingUrl = await URL.findOne({
          where: { shortUrl: shortUrl, isActive: true },
        });
        if (!isExistingUrl) {
          break;
        }
        attempts++;
      }
      const isExistingUrl = await URL.findOne({
        where: { shortUrl: shortUrl, isActive: true },
      });
      if (isExistingUrl) {
        throw errors.internalServerError("Short URL already exists");
      }
    }
    if (customAlias) {
      const existingAlias = await URL.findOne({ where: { customAlias } });
      if (existingAlias) {
        throw errors.aliasAlreadyTaken;
      }
      shortUrl = customAlias;
      await redisClient.set(customAlias, longUrl);
    } else {  
      await redisClient.set(shortUrl, longUrl);
    }

    const createdUrl = await URL.create({
      shortUrl: shortUrl,
      longUrl: longUrl,
      isActive: true,
      ipAddress: "12",
    });

    return { statusCode: 201, data: createdUrl };
  } catch (error) {
    if (error.statusCode) {
      return { statusCode: error.statusCode, message: error.message };
    } else {
      const internalError = errors.internalServerError(error.message);
      return {
        statusCode: internalError.statusCode,
        message: internalError.message,
      };
    }
  }
}

export async function shortenUrl(longUrl, customAlias = null) {
  const result = await generateShortUrl(longUrl, customAlias);
  if (result.statusCode !== 201) {
    return result;
  }
  const shortPath = customAlias || result.data.shortUrl;
  return { statusCode: 200, data: `${process.env.BASE_URL}/${shortPath}` };
}

export async function getOriginalUrl(shortUrl) {
  try {
    const cachedUrl = await redisClient.get(shortUrl);
    if (cachedUrl) {
      return { statusCode: 200, data: cachedUrl };
    }

    const url = await URL.findOne({
      where: {
        [Op.or]: [{ shortUrl }, { customAlias: shortUrl }],
      },
    });

    if (!url) {
      throw errors.urlNotFound;
    }

    await redisClient.set(shortUrl, url.longUrl);
    return { statusCode: 200, data: url.longUrl };
  } catch (error) {
    if (error.statusCode) {
      return { statusCode: error.statusCode, message: error.message };
    } else {
      const internalError = errors.internalServerError(error.message);
      return {
        statusCode: internalError.statusCode,
        message: internalError.message,
      };
    }
  }
}
