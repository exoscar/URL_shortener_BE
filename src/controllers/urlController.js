import { shortenUrl, getOriginalUrl } from "../services/urlService.js";

export async function shorten(req, res) {
  try {
    const { longUrl, customAlias } = req.body;

    if (!isValidUrl(longUrl)) {
      return res.status(400).json({ error: "Invalid URL format." });
    }

    if (customAlias && !isValidAlias(customAlias)) {
      return res.status(400).json({ error: "Invalid custom alias format." });
    }

    const shortUrl = await shortenUrl(longUrl, customAlias);
    res.json({ shortUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function redirect(req, res) {
  try {
    const shortUrl = req.params.shortUrl;
    const longUrl = await getOriginalUrl(shortUrl);
    res.redirect(longUrl.data);
  } catch (error) {
    res.status(404).json({ error: "URL not found" });
  }
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

function isValidAlias(alias) {
  const regex = /^[a-zA-Z0-9_]{3,50}$/;
  return regex.test(alias);
}
