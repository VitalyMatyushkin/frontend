/**
 * Created by wert on 21.02.2018
 */

/**
 * Extract params in curly braces from provided string.
 * for ex.:
 * 1. '/i/login' -> []
 * 2. '/i/schools/{schoolId}/forms/{formId}' -> ['schoolId', 'formId']
 * 3. '/i/schools/{schoolId}/schools/{schoolId}' -> ['schoolId']
 * @param {string} url
 * @return {string[]}
 */
export function urlParameterParser(url: string): string[] {
	const urlParams = [];

	if (url.indexOf('{') !== -1) {

		// using replace here because this is shortest way to inspect every value matched with regexp
		// result of .replace is useless. Using replace only for side effect
		url.replace(/\{(.*?)\}/g,(match, param) => {
			if(urlParams.indexOf(param) === -1) {	// not inserting duplicates
				urlParams.push(param);
			}

			return '';
		});
	}

	return urlParams;
}