const	React		= require('react'),
		classNames	= require('classnames');

const TeamName = React.createClass({
	propTypes: {
		handleChangeName	: React.PropTypes.func.isRequired,
		name				: React.PropTypes.string,
		isShowError			: React.PropTypes.bool
	},
	getInitialState: function() {
		return {
			isFocused: false,
			name: ''
		};
	},
	getDefaultProps: function() {
		return {
			isShowError: false
		};
	},
	componentWillMount(){
		typeof this.props.name !== 'undefined' && this.setState({name: this.props.name});
	},
	componentWillReceiveProps: function(newProps) {
		let updName = newProps.name;

		if(updName !== this.state.name) {
			if(typeof updName === 'undefined') {
				updName = '';
			}

			this.setState({
				name: updName
			});
		}
	},
	handleChangeTeamName: function(event) {
		this.setState({
			name: event.target.value
		});
		this.props.handleChangeName(event.target.value);
	},
	handleFocus: function() {
		this.setState({
			isFocused : true
		});
	},
	handleBlur: function() {
		this.setState({
			isFocused: false
		});
	},
	renderInput: function() {
		const	isShowError	= this.props.isShowError && !this.state.isFocused,
				className	= classNames({
					"eTeamName_nameForm": true,
					"mWarning": isShowError
				}),
				value		= isShowError ? 'Please enter team name' : this.state.name;

		return (
			<input
				autoCorrect	= "off"
				spellCheck	= "false"

				className	= { className }
				type		= { 'text' }
				placeholder	= { 'Team name' }
				onChange	= { this.handleChangeTeamName }
				onFocus		= { this.handleFocus}
				onBlur 		= { this.handleBlur }
				value		= { value }
			/>
		);
	},
	render: function() {
		return (
			<div className='bTeamName'>
				<div className='eTeamName_nameContainer'>
					{this.renderInput()}
				</div>
			</div>
		);
	}
});

module.exports = TeamName;