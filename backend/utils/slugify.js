const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // spaces → hyphens
    .replace(/[^\w\-]+/g, '')    // remove non-word chars
    .replace(/\-\-+/g, '-')      // collapse multiple hyphens
    .replace(/^-+/, '')          // strip leading hyphens
    .replace(/-+$/, '');         // strip trailing hyphens
};

module.exports = { slugify };
