/**
 * Created by vitaly on 29.09.17.
 */
const 	React				= require('react'),
		DefaultRival		= require('module/as_school/pages/school_home/fixture_list/multiparty_opponent_side/default_rival'),
		DefaultResults		= require('module/as_school/pages/school_home/fixture_list/multiparty_opponent_side/default_results');

const IndividualInternalSide = React.createClass({
	propTypes: {
		event:			React.PropTypes.any.isRequired,
		activeSchoolId: React.PropTypes.string.isRequired
	},
	render: function() {
		return (
			<div className="eFixture_rightSide">
				<DefaultRival
					event			= {this.props.event}
					activeSchoolId	= {this.props.activeSchoolId}
				/>
				<DefaultResults
					event			= {this.props.event}
					activeSchoolId	= {this.props.activeSchoolId}
				/>
			</div>
		)
	}
});

module.exports = IndividualInternalSide;