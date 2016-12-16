const	React			= require('react'),
		Morearty		= require('morearty'),

		DateHelper		= require('./../../../../helpers/date_helper'),

		EventButtons	= require('./event_buttons'),
		ChallengeModel	= require('./../../../../ui/challenges/challenge_model');

const EventHeader = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	render: function() {
		const	binding	= this.getDefaultBinding();

		const	model	= new ChallengeModel(binding.toJS('model'), this.props.activeSchoolId);

		const	name	= model.name,
				date	= DateHelper.toLocalWithMonthName(model.dateUTC),
				time	= model.time,
				sport	= model.sport;

		return (
			<div className="bEventHeader">
				<div className="bEventHeader_row">
					<div className="bEventHeader_leftSide">
						<div className="eEventHeader_field mEvent">{`${name}`}</div>
						<div className="eEventHeader_field mDate">{`${time} / ${date} / ${sport}`}</div>
					</div>
					<div className="bEventHeader_rightSide">
						<EventButtons binding={binding}/>
					</div>
				</div>
			</div>
		);
	}
});


module.exports = EventHeader;
