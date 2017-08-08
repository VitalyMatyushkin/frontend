const MODE = {
	'CHANGE_TEAM'	: 'CHANGE_TEAM',
	'ADD_TEAM'		: 'ADD_TEAM'
};

const VIEW_MODE = {
	'NEW_TEAM_VIEW'	: 'NEW_TEAM_VIEW',
	'OLD_TEAM_VIEW'	: 'OLD_TEAM_VIEW'
};

const SAVING_CHANGES_MODE = {
	// Save changes to selected prototype team
	'SAVE_CHANGES_TO_PROTOTYPE_TEAM'		: 'SAVE_CHANGES_TO_PROTOTYPE_TEAM',
	// Save changes to new prototype team
	'SAVE_CHANGES_TO_NEW_PROTOTYPE_TEAM'	: 'SAVE_CHANGES_TO_NEW_PROTOTYPE_TEAM',
	// Doesn't save changes
	'DOESNT_SAVE_CHANGES'					: 'DOESNT_SAVE_CHANGES'
};

module.exports.MODE					= MODE;
module.exports.SAVING_CHANGES_MODE	= SAVING_CHANGES_MODE;
module.exports.VIEW_MODE			= VIEW_MODE;