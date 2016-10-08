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

module.exports.EVENT_STATUS = EVENT_STATUS;