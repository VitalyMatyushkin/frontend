const	React				= require('react');

const	ViewModeConsts		= require('module/as_manager/pages/event/view/rivals/consts/view_mode_consts');

const	classNames			= require('classnames');

const	EventHeaderStyle	= require('../../../../../../../styles/pages/event/b_event_header.scss');

const EventHeader = React.createClass({
	propTypes: {
		handleClick:	React.PropTypes.func.isRequired,
		viewMode:		React.PropTypes.string.isRequired
	},
	handleClick: function(viewMode) {
		this.props.handleClick(viewMode);
	},
	render: function() {
		return (
			<div className="bEventViewMode">
				<a
					className	= {
						classNames({
							eEventViewModeLink:	true,
							mActive:			this.props.viewMode === ViewModeConsts.VIEW_MODE.BLOCK_VIEW
						})
					}
					onClick		= { this.handleClick.bind(this, ViewModeConsts.VIEW_MODE.BLOCK_VIEW) }
					key			= { ViewModeConsts.VIEW_MODE.BLOCK_VIEW }
				>
					Block View
				</a>
				<a
					className	= {
						classNames({
							eEventViewModeLink:	true,
							mActive:			this.props.viewMode === ViewModeConsts.VIEW_MODE.TABLE_VIEW
						})
					}
					onClick		= { this.handleClick.bind(this, ViewModeConsts.VIEW_MODE.TABLE_VIEW) }
					key			= { ViewModeConsts.VIEW_MODE.TABLE_VIEW }
				>
					Table View
				</a>
			</div>
		);
	}
});


module.exports = EventHeader;