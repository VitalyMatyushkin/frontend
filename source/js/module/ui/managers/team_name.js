const React = require('react');

const TeamName = React.createClass({
	propTypes: {
		handleChangeName:	React.PropTypes.func,
		name:				React.PropTypes.string
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
	render: function() {
		const self = this;

		return (
			<div className="bTeamName">
				<div className="eTeamName_nameContainer">
					<input	className	= "eTeamName_nameForm mSaveAsNewTeam"
						  	ref 		= "name"
							type		= { 'text' }
							placeholder	= { 'Enter team name' }
							onChange	= { self.handleChangeTeamName }
							value		= { typeof self.props.name !== 'undefined' ? self.props.name : '' }
					/>
				</div>
			</div>
		);
	}
});

module.exports = TeamName;