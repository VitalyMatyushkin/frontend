/**
 * Created by wert on 06.03.2018
 */

const	numeric			= '0123456789',
		alpha			= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
		alphanumeric	= alpha + numeric;

function makeId(length: number, dictionary: string = alphanumeric): string {
	let text = "";

	for (let i = 0; i < length; i++)
		text += dictionary.charAt(Math.floor(Math.random() * dictionary.length));

	return text;
}


export function getRandomEmail(optDomain: string = 'fakemail.squadintouch.com') {
	const randomPart = `${Date.now()}__${makeId(6)}`;
	return `selenium_test_email_${randomPart}@${optDomain}`;
}


export function getDefaultPassword(): string {
	return '111111Ab';
}

export function getRandomPhone() {
	const suffix = '' + Date.now() + makeId(5, numeric);
	return '+7900000000000#' + suffix;
}