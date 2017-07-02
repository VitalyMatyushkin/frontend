const React = require('react');

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
	componentDidMount(){
		this.setState({
			name: this.props.name
		});
	},
	componentWillReceiveProps: function(newProps) {
		const updName = newProps.name;

		if(updName !== 'undefined' && updName !== this.state.name) {
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
			isFocused : true,
			name: ''
		});
	},
	handleBlur: function() {
		this.setState({
			isFocused	: false
		});
	},
	renderInput: function() {
		// It shows warning input when isShowError is true and team name input isn't focused on.
		if(this.props.isShowError && !this.state.isFocused) {
			return (
				<input	className	= 'eTeamName_nameForm mWarning'
						type		= {'text'}
						value		= {'Please enter team name'}
						onFocus		= {this.handleFocus}
				/>
			);
		} else {
			return (
				<input	className	= 'eTeamName_nameForm'
						type		= { 'text' }
						placeholder	= { 'Team name' }
						onChange	= { this.handleChangeTeamName }
						onFocus		= { this.handleFocus}
						onBlur 		= { this.handleBlur }
						value		= { this.state.name }
				/>
			);
		}
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