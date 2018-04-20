import * as Moment from 'moment';

export const AccountFormHelper = {
	getTypes: function() {
		return [
			{value: 'individual', text: 'Individual'},
			{value: 'company', text: 'Company'}
		];
	},

	getCountries: function() {
		return [
			{value: 'GB', text: 'GB'},
			{value: 'US', text: 'US'}
		];
	},

	getCurrency: function() {
		return [
			{value: 'GBP', text: 'GBP'},
			{value: 'USD', text: 'USD'}
		];
	},

	dataToServer: function (data, region) {
		const formatMask = region === 'US' ? 'mm.dd.YYYY' : 'dd.mm.YYYY';
		if (data.stripeData.tosAcceptance && typeof  data.stripeData.tosAcceptance.date !== 'undefined') {
			data.stripeData.tosAcceptance.date = +Moment(data.stripeData.tosAcceptance.date, formatMask).format('X');
		}

		if (typeof  data.stripeData.tosAcceptance !== 'undefined' &&
			typeof  data.stripeData.tosAcceptance.date === 'undefined' &&
			typeof  data.stripeData.tosAcceptance.ip === 'undefined' &&
			typeof  data.stripeData.tosAcceptance.userAgent === 'undefined') {

			delete data.stripeData.tosAcceptance;
		}
		data.stripeData.externalAccount.routingNumber = data.stripeData.externalAccount.routingNumber === '' ? undefined :
			data.stripeData.externalAccount.routingNumber;
		data.stripeData.legalEntity.dob = {
			day: +Moment(data.stripeData.legalEntity.dob, formatMask).format('D') ,
			month: +Moment(data.stripeData.legalEntity.dob, formatMask).format('M') ,
			year: +Moment(data.stripeData.legalEntity.dob, formatMask).format('YYYY')
		};
		return data;
	},

	dataToClient: function (data) {
		const legalEntityDob = data.stripeData.legalEntity.dob;
		data.stripeData.legalEntity.dob = Moment([legalEntityDob.year, legalEntityDob.month-1, legalEntityDob.day]).format();
		data.stripeData.tosAcceptance.date = data.stripeData.tosAcceptance.date ? Moment.unix(data.stripeData.tosAcceptance.date).format() : null;
		data.stripeData.externalAccount.accountNumber = data.stripeData.externalAccount.accountNumberLast4;
		return data;
	}
};

export const DEFAULT_SELECT_DATA = {
	STATUS: 'ACTIVE',
	ACCOUNT_HOLDER_TYPE: 'individual',
	LEGAL_ENTITY_TYPE: 'individual',
	COUNTRY: 'GB',
	CURRENCY: 'GBP'
};