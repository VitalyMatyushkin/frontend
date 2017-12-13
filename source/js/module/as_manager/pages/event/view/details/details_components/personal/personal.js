const	React			= require('react'),

		ViewMode		= require('./view_modes/view_mode'),
		EditMode		= require('./view_modes/edit_mode'),

		Consts			= require('./../consts'),
		DetailsStyle	= require('../../../../../../../../../styles/ui/b_details.scss');

const Personal = React.createClass({
	propTypes:{
		activeSchoolId: 	React.PropTypes.string.isRequired,
		handleChange: 		React.PropTypes.func.isRequired,
		handleDelete: 		React.PropTypes.func.isRequired,
		personalType: 		React.PropTypes.string.isRequired,
		personalList: 		React.PropTypes.array.isRequired,
		mode: 				React.PropTypes.oneOf([Consts.REPORT_FILED_VIEW_MODE.VIEW, Consts.REPORT_FILED_VIEW_MODE.EDIT]).isRequired
	},
	getDefaultProps: function () {
		return {
			mode: Consts.REPORT_FILED_VIEW_MODE.VIEW
		}
	},
	render:function(){
		switch (this.props.mode) {
			case Consts.REPORT_FILED_VIEW_MODE.VIEW:
				return (
					<ViewMode personalList={this.props.personalList}/>
				);
			case Consts.REPORT_FILED_VIEW_MODE.EDIT:
				return (
					<EditMode	activeSchoolId	= {this.props.activeSchoolId}
								personalList	= {this.props.personalList}
								personalType	= {this.props.personalType}
								handleChange	= {this.props.handleChange}
								handleDelete	= {this.props.handleDelete}
					/>
				);
		}
	}
});

module.exports = Personal;