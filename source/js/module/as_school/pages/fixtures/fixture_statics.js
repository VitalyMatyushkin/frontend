const 	DateTimeMixin 	= require('module/mixins/datetime'),
	{If}				= require('module/ui/if/if'),
		Morearty        = require('morearty'),
		React 			= require('react');

const FixturesList = React.createClass({
	mixins: [Morearty.Mixin, DateTimeMixin],

	render: function() {
		var self = this;

		return (
			<div className="bFixturesStatics">
				<div className="eFixturesStatics_number">
					<div className="eFixturesStatics_value">?</div>
					<div className="eFixturesStatics_name">played</div>
				</div>

				<div className="eFixturesStatics_number">
					<div className="eFixturesStatics_value">?</div>
					<div className="eFixturesStatics_name">won</div>
				</div>

				<div className="eFixturesStatics_number">
					<div className="eFixturesStatics_value">?</div>
					<div className="eFixturesStatics_name mTwoLines">average<br/>points</div>
				</div>
			</div>
		)
	}
});


module.exports = FixturesList;
