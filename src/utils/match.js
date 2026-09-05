const STOP_WORDS = new Set([
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
  'it',
  'this',
  'that',
  'with',
  'for',
]);

const SYNONYMS = new Map([
  ['cellphone', 'phone'],
  ['mobile', 'phone'],
  ['smartphone', 'phone'],
  ['iphone', 'phone'],
  ['samsung', 'phone'],
  ['notebook', 'laptop'],
  ['purse', 'wallet'],
  ['rucksack', 'bag'],
  ['backpack', 'bag'],
  ['spectacles', 'glasses'],
  ['specs', 'glasses'],
  ['jewellery', 'jewelry'],
]);

/** Score likely matches without requiring a database or external service. */
export function scoreMatches(lostItem, foundItems, topN = 5) {
  const lostTitle = extractKeywords(lostItem.title);
  const lostKeywords = extractKeywords(lostItem.title, lostItem.description);

  const scored = foundItems.map((found) => {
    let score = 0;
    const foundTitle = extractKeywords(found.title);
    const foundKeywords = extractKeywords(found.title, found.description);

    if (found.category === lostItem.category) {
      score += 5;
    }

    const titleOverlap = intersection(lostTitle, foundTitle);
    const keywordOverlap = intersection(lostKeywords, foundKeywords);
    score += titleOverlap.length * 4;
    score += Math.max(0, keywordOverlap.length - titleOverlap.length) * 2;

    if (lostItem.location && found.location === lostItem.location) {
      score += 3;
    }

    if (lostItem.date_lost && found.date_lost) {
      const daysApart = Math.abs(
        (Date.parse(found.date_lost) - Date.parse(lostItem.date_lost)) /
          (1000 * 60 * 60 * 24)
      );
      if (daysApart <= 3) score += 2;
      else if (daysApart <= 14) score += 1;
    }

    return { item: found, score, overlapCount: keywordOverlap.length };
  });

  return scored
    .filter((match) => match.overlapCount > 0)
    .sort((a, b) => b.score - a.score || b.overlapCount - a.overlapCount)
    .slice(0, topN)
    .map((s) => s.item);
}

function extractKeywords(title = '', description = '') {
  const text = `${title} ${description}`.toLowerCase();
  return text.match(/[a-z0-9]+/g)?.map(normalizeWord).filter(Boolean) || [];
}

function normalizeWord(word) {
  const synonym = SYNONYMS.get(word) || word;
  if (synonym.length <= 2 || STOP_WORDS.has(synonym)) return null;
  if (synonym.endsWith('ies') && synonym.length > 4) {
    return synonym.slice(0, -3) + 'y';
  }
  if (synonym.endsWith('s') && !synonym.endsWith('ss') && synonym.length > 3) {
    return synonym.slice(0, -1);
  }
  return synonym;
}

function intersection(first, second) {
  const secondSet = new Set(second);
  return [...new Set(first)].filter((word) => secondSet.has(word));
}
