const ManagerHelper = {
	/**
	 * Function returns string with binding path to isSearch flag from TeamManager component.
	 * @param order - Manager has two TeamManager components, order is an index of needed component.
	 */
	getPathToManagerIsSearchFlagByOrder: function(order) {
		return `teamModeView.teamWrapper.${order}.___teamManagerBinding.isSearch`;
	}
};

module.exports = ManagerHelper;