const React = require('react');

const TeamName = React.createClass({
	propTypes: {
		handleChangeName	: React.PropTypes.func.isRequired,
		name				: React.PropTypes.string,
		isShowError			: React.PropTypes.bool
	},
	getInitialState: function() {
		return {
			isFocused: false
		};
	},
	getDefaultProps: function() {
		return {
			isShowError: false
		};
	},
	componentDidUpdate: function () {
		const cursor = this.state && this.state.cursor;

		if(cursor >= 0){
			this.refs.name.setSelectionRange(cursor, cursor);
		}
	},
	handleChangeTeamName: function(e) {
		this.props.handleChangeName(e.target.value);
		this.setState({cursor:e.target.selectionStart})
	},
	handleFocus: function() {
		this.setState({
			isFocused : true
		});
	},
	handleBlur: function() {
		this.setState({
			isFocused	: false,
			cursor		: -1
		});
	},
	renderInput: function() {
		// It shows warning input when isShowError is true and team name input isn't focused on.
		if(this.props.isShowError && !this.state.isFocused) {
			return (
				<input	className	= 'eTeamName_nameForm mWarning'
						ref 		= 'name'
						type		= {'text'}
						value		= {'Please enter team name'}
						onFocus		= {this.handleFocus}
				/>
			);
		} else {
			return (
				<input	className	= 'eTeamName_nameForm'
						ref 		= 'name'
						type		= { 'text' }
						placeholder	= { 'Team name' }
						onChange	= { this.handleChangeTeamName }
						onFocus		= { this.handleFocus}
						onBlur 		= { this.handleBlur }
						value		= { typeof this.props.name !== 'undefined' ? this.props.name : '' }
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