const	React				= require('react');

const	ViewModeConsts		= require('module/ui/view_selector/consts/view_mode_consts');

const	classNames			= require('classnames');

const	EventHeaderStyle	= require('styles/pages/event/b_event_header.scss');

const ViewSelector = React.createClass({
	propTypes: {
		selectorList:	React.PropTypes.array.isRequired,
		handleClick:	React.PropTypes.func.isRequired,
		viewMode:		React.PropTypes.string.isRequired
	},
	getDefaultProps: function(){
		return {
			viewMode: ViewModeConsts.VIEW_MODE.BLOCK_VIEW
		};
	},
	handleClick: function(viewMode) {
		this.props.handleClick(viewMode);
	},
	render: function() {
		const links = this.props.selectorList.map(selectorModel =>
			<a
				className	= {
					classNames({
						eEventViewModeLink:	true,
						mActive:			this.props.viewMode === selectorModel.id
					})
				}
				onClick		= { this.handleClick.bind(this, selectorModel.id) }
				key			= { selectorModel.id }
			>
				{ selectorModel.text }
			</a>
		);

		return (
			<div className="bEventViewMode">
				{ links }
			</div>
		);
	}
});


module.exports = ViewSelector;
