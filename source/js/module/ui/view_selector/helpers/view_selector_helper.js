const	TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		ViewSelectorModel	= require('module/ui/view_selector/models/view_selector_model'),
		ViewModeConsts		= require('module/ui/view_selector/consts/view_mode_consts');

const ViewSelectorHelper = {
	getSelectorList: function (event) {
		switch (true) {
			case TeamHelper.isMultiparty(event) && TeamHelper.isIndividualSport(event): {
				return [
					new ViewSelectorModel(ViewModeConsts.VIEW_MODE.BLOCK_VIEW,		'Block View'),
					new ViewSelectorModel(ViewModeConsts.VIEW_MODE.TABLE_VIEW,		'Table View'),
					new ViewSelectorModel(ViewModeConsts.VIEW_MODE.OVERALL_VIEW,	'Overall View')
				];
			}
			case TeamHelper.isMultiparty(event) && TeamHelper.isTeamSport(event): {
				return [
					new ViewSelectorModel(ViewModeConsts.VIEW_MODE.BLOCK_VIEW,	'Block View'),
					new ViewSelectorModel(ViewModeConsts.VIEW_MODE.TABLE_VIEW,	'Table View')
				];
			}
			case !TeamHelper.isMultiparty(event) && TeamHelper.isTeamSport(event): {
				return [
					new ViewSelectorModel(ViewModeConsts.VIEW_MODE.BLOCK_VIEW,	'Block View'),
					new ViewSelectorModel(ViewModeConsts.VIEW_MODE.TABLE_VIEW,	'Table View')
				];
			}
			case !TeamHelper.isMultiparty(event) && TeamHelper.isNonTeamSport(event): {
				return [
					new ViewSelectorModel(ViewModeConsts.VIEW_MODE.BLOCK_VIEW,		'Block View'),
					new ViewSelectorModel(ViewModeConsts.VIEW_MODE.OVERALL_VIEW,	'Overall View')
				];
			}
		}
	}
};

module.exports = ViewSelectorHelper;