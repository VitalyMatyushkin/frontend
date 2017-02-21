/**
 * Created by wert on 28.08.16.
 */

const EVENT_STATUS = {
	'DRAFT'						: 'DRAFT',						// can be filled with any data, visible to creator only
	'SENDING_INVITES'			: 'SENDING_INVITES', 				// in process of generating and sending invites
	'INVITES_SENT'				: 'INVITES_SENT', 				// all invites are delivered to recipients
	'COLLECTING_INVITE_RESPONSE': 'COLLECTING_INVITE_RESPONSE', 	// got at least one decision from invite in case of multiple invites sent
	'ACCEPTED'					: 'ACCEPTED', 					// every invite recipient accepted invite
	'REJECTED'					: 'REJECTED', 					// every invite recipient rejected invite
	'FINISHED'					: 'FINISHED',						// event finished
	'ON_HOLD'					: 'ON_HOLD',						// event temporary paused
	'CANCELED'					: 'CANCELED'						// event canceled because of some reason
};

const EVENT_GENDERS = {
	FEMALE_ONLY:	'femaleOnly',
	MALE_ONLY:		'maleOnly',
	MIXED:			'mixed'
};

const EVENT_GENDERS_SERVER = {
	FEMALE_ONLY:	'FEMALE_ONLY',
	MALE_ONLY:		'MALE_ONLY',
	MIXED:			'MIXED'
};

const EVENT_GENDERS_FILTER = {
	FEMALE_ONLY:	'FEMALE_ONLY',
	MALE_ONLY:		'MALE_ONLY',
	MIXED:			'MIXED'
};

module.exports.EVENT_STATUS				= EVENT_STATUS;
module.exports.EVENT_GENDERS			= EVENT_GENDERS;
module.exports.EVENT_GENDERS_FILTER		= EVENT_GENDERS_FILTER;
module.exports.EVENT_GENDERS_SERVER		= EVENT_GENDERS_SERVER;