/**
 * Created by Woland on 24.03.2017.
 */
const TwitterHelper = {
	/**
	 * Function return count links from text for tweet
	 * @param {string} - text for tweet
	 * @returns {number} - count links
	 */
	getNumberLinksInTweet: function(textForTweet){
		const arrayOfMatches = textForTweet !== '' ? textForTweet.match(/https?:\/\//g) : [];
		
		return typeof arrayOfMatches !== 'undefined' && arrayOfMatches !== null ? arrayOfMatches.length : 0;
	},
	/**
	 * Function return length of tweet without links
	 * @param {string} - text for tweet
	 * @param {number} - count links
	 * @return {number} - length of tweet without links
	 */
	getTextWithoutLinkLength: function(textForTweet, numberLinksInTweet){
		
		for (let i = 0; i < numberLinksInTweet; i++) {
			let startPos, endPos, startStr, endStr;
			if (i === numberLinksInTweet - 1) {
				startPos = textForTweet.match(/https?:\/\//).index;
				endPos = textForTweet.indexOf(' ', startPos);
				if (endPos === -1) {
					textForTweet = textForTweet.substring(0, startPos);
				} else {
					startStr = textForTweet.substring(0, startPos - 1);
					endStr = textForTweet.substring(endPos + 1);
					textForTweet = startStr + endStr;
				}
			} else {
				startPos = textForTweet.match(/https?:\/\//).index;
				endPos = textForTweet.indexOf(' ', startPos);
				startStr = textForTweet.substring(0, startPos - 1);
				endStr = textForTweet.substring(endPos + 1);
				textForTweet = startStr + endStr;
			}
		}
		
		return textForTweet.length;
	}
};

module.exports = TwitterHelper;