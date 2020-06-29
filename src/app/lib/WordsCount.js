class WordsCount {
  topWords(text) {
    const wordsArray = this.splitByWords(text);
    const wordsMap = this.createWordMap(wordsArray);
    const finalWordsArray = this.sortByCount(wordsMap);

    return finalWordsArray;
  }

  splitByWords(text) {
    // split string by spaces (including spaces, tabs, and newlines)
    const wordsArray = text.split(/\s+/);
    return wordsArray;
  }

  createWordMap(wordsArray) {
    // create map for word counts
    const wordsMap = {};
    wordsArray.forEach(function(key) {
      if (wordsMap.hasOwnProperty(key)) {
        wordsMap[key]++;
      } else {
        wordsMap[key] = 1;
      }
    });

    return wordsMap;
  }

  sortByCount(wordsMap) {
    // sort by count in descending order
    let finalWordsArray = [];
    finalWordsArray = Object.keys(wordsMap).map(function(key) {
      return {
        name: key,
        total: wordsMap[key],
      };
    });

    finalWordsArray.sort(function(a, b) {
      return b.total - a.total;
    });

    return finalWordsArray;
  }
}

export default new WordsCount();
