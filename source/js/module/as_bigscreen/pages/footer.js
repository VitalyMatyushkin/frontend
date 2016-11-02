const	React			= require('react'),

		ChallengeModel	= require('./../../ui/challenges/challenge_model');

const Footer = React.createClass({
	propTypes: {
		events:			React.PropTypes.array.isRequired,
		activeSchoolId:	React.PropTypes.string.isRequired
	},

	timerId					: undefined,
	TIME_UPDATE_INTERVAL	: 10000,

	getInitialState: function() {
		return {
			currentEventIndex: undefined
		};
	},

	componentWillMount: function () {
		this.setState( {currentEventIndex: this.getNextEventIndex()} );
		this.timerId = setInterval(this.handleChangeEvent, this.TIME_UPDATE_INTERVAL);
	},
	componentWillUnmount: function () {
		clearInterval(this.timerId);
	},

	handleChangeEvent: function() {
		this.setState( {currentEventIndex: this.getNextEventIndex()} );
	},
	getNextEventIndex: function() {
		switch (true) {
			case this.props.events.length === 0:
				return undefined;
			case typeof this.state.currentEventIndex === 'undefined':
				return 0;
			case this.state.currentEventIndex === this.props.events.length - 1:
				return 0;
			default:
				return this.state.currentEventIndex + 1;
		}
	},

	render: function() {
		if(typeof this.state.currentEventIndex === 'undefined') {
			return null;
		} else {
			const model = new ChallengeModel(
				this.props.events[this.state.currentEventIndex],
				this.props.activeSchoolId
			);

			return (
				<div className="bFooter">
					{`Upcoming: ${model.time} / ${model.sport} / ${model.rivals[0].value} vs. ${model.rivals[1].value}`}
				</div>
			);
		}
	}
});

module.exports = Footer;