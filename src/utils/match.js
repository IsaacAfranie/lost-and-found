/**
 * Score items by category match (2pts) + keyword overlap (1pt each)
 * Returns top N items sorted by score descending
 */
export function scoreMatches(lostItem, foundItems, topN = 5) {
  const lostKeywords = extractKeywords(lostItem.title, lostItem.description);

  const scored = foundItems.map((found) => {
    let score = 0;

    // Category match: 2 points
    if (found.category === lostItem.category) {
      score += 2;
    }

    // Keyword overlap: 1 point per keyword match
    const foundKeywords = extractKeywords(found.title, found.description);
    const overlap = lostKeywords.filter((kw) =>
      foundKeywords.some((fkw) => fkw.includes(kw) || kw.includes(fkw))
    );
    score += overlap.length;

    return { item: found, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map((s) => s.item);
}

/**
 * Extract keywords from title and description
 * Splits by spaces, removes common words, lowercases
 */
function extractKeywords(title = '', description = '') {
  const commonWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'of',
    'is',
    'was',
    'my',
    'i',
  ]);

  const text = `${title} ${description}`.toLowerCase();
  return text
    .split(/\s+/)
    .filter((word) => word.length > 2 && !commonWords.has(word));
}
