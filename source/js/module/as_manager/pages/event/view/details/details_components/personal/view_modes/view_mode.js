const	React			= require('react'),
		User			= require('./user'),
		Consts			= require('./../../consts'),
		DetailsStyle	= require('../../../../../../../../../../styles/ui/b_details.scss');

const ViewMode = React.createClass({
	propTypes: {
		personalList: React.PropTypes.array
	},
	renderPersonalList: function() {
		if(typeof this.props.personalList !== 'undefined') {
			return this.props.personalList.map(user =>
				<User key={user.userId} user={user} viewMode={Consts.REPORT_FILED_VIEW_MODE.VIEW}/>
			);
		} else {
			return null;
		}
	},
	render: function(){
		return (
			<div className="eDetails_textBlock">
				{this.renderPersonalList()}
			</div>
		);
	}
});

module.exports = ViewMode;