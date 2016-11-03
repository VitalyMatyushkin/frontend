const React = require('react');

const DefaultHeader = React.createClass({
	propTypes: {
		title: React.PropTypes.string.isRequired,
		logo: React.PropTypes.string.isRequired
	},

	timerId: undefined,

	TIME_UPDATE_INTERVAL: 60000,
	/*	INIT	*/
	getInitialState: function() {
		return {
			currentTime: this.getCurrentTimeString()
		};
	},

	componentWillMount: function () {
		this.timerId = setInterval(this.handleChangeTime, this.TIME_UPDATE_INTERVAL);
	},
	componentWillUnmount: function () {
		clearInterval(this.timerId);
	},

	/*	HELPERS	*/
	setCurrentTime: function() {
		this.setState(
			{'currentTime': this.getCurrentTimeString()}
		);
	},
	/**
	 * Get current time string from state
	 */
	getCurrentTime: function() {
		return this.state.currentTime;
	},
	/**
	 * Get current time string by new Date()
	 */
	getCurrentTimeString: function() {
		return new Date().toTimeString().substring(0,5);
	},

	/*	HANDLERS	*/
	handleChangeTime: function() {
		this.setCurrentTime();
	},

	/*	RENDER	*/
	render: function() {
		return (
			<div className="bBigScreenTitle">
				<div className="eBigScreenTitle_title">
					{ this.props.title }
				</div>
				<div className="eBigScreenTitle_logo">
					<img src={ this.props.logo } alt="Squadintouch"/>
				</div>
				<div className="eBigScreenTitle_time">
					{ this.getCurrentTime() }
				</div>
			</div>
		);
	}
});


module.exports = DefaultHeader;