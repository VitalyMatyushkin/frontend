const	React			= require('react'),
	{If}			= require('../../../../../../../../ui/if/if'),
		Consts			= require('../../consts'),
		DetailsStyle	= require('../../../../../../../../../../styles/ui/b_details.scss');

const User = React.createClass({
	propTypes: {
		user			: React.PropTypes.object.isRequired,
		viewMode		: React.PropTypes.string.isRequired,
		handleDelete	: React.PropTypes.func
	},
	handleDelete: function() {
		this.props.handleDelete(this.props.user);
	},
	render: function(){
		return (
			<div className="eDetails_personalContainer">
				<div className="eDetails_personalName">
					{`${this.props.user.firstName} ${this.props.user.lastName}`}
				</div>
				<If condition={this.props.viewMode === Consts.REPORT_FILED_VIEW_MODE.EDIT}>
					<div	onClick		= {this.handleDelete}
							className	= "eDetails_deletePersonalButton"
					>
						<i className="fa fa-times" aria-hidden="true"></i>
					</div>
				</If>
			</div>
		);
	}
});

module.exports = User;