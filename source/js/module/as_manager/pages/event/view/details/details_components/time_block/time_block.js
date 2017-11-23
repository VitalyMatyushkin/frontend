const	React				= require('react'),

		{DateHelper}			= require('../../../../../../../helpers/date_helper'),

		ViewMode			= require('./view_modes/view_mode'),
		EditMode			= require('./view_modes/edit_mode'),

		Consts				= require('./../consts'),
		DetailsStyle	= require('../../../../../../../../../styles/ui/b_details.scss');

const TimeBlock = React.createClass({
	propTypes:{
		label:			React.PropTypes.string.isRequired,
		dateString:		React.PropTypes.string,
		mode:			React.PropTypes.string,
		handleChange:	React.PropTypes.func
	},
	getDefaultProps: function () {
		const date = new Date();
		date.setHours(0);
		date.setMinutes(0);

		return {
			mode:		Consts.REPORT_FILED_VIEW_MODE.VIEW,
			dateString:	date.toISOString()
		}
	},
	render:function(){
		switch (this.props.mode) {
			case Consts.REPORT_FILED_VIEW_MODE.VIEW:
				return (
					<ViewMode	label		= {this.props.label}
								dateString	= {this.props.dateString}
					/>
				);
			case Consts.REPORT_FILED_VIEW_MODE.EDIT:
				return (
					<EditMode	label			= {this.props.label}
								dateString		= {this.props.dateString}
								handleChange	= {this.props.handleChange}
					/>
				);
		}
	}
});

module.exports = TimeBlock;