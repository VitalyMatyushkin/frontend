const	React			= require('react'),

	{If}			= require('../../../../../ui/if/if'),

		DisciplineView	= require('./discipline_view'),
		DisciplineEdit	= require('./discipline_edit');

const Discipline = React.createClass({
	propTypes: {
		role					: React.PropTypes.string.isRequired,
		isEditMode				: React.PropTypes.bool.isRequired,
		event					: React.PropTypes.object.isRequired,
		players					: React.PropTypes.array.isRequired,
		disciplineItems			: React.PropTypes.array.isRequired,
		disciplineValues		: React.PropTypes.array.isRequired,
		activeSchoolId			: React.PropTypes.string.isRequired,
		handleChange			: React.PropTypes.func.isRequired,
		handleClickChangeMode	: React.PropTypes.func.isRequired,
		onSave					: React.PropTypes.func.isRequired,
		onCancel				: React.PropTypes.func.isRequired
	},

	render: function() {
		return (
			<div>
				<If condition={!this.props.isEditMode}>
					<DisciplineView	role					= {this.props.role}
									event					= {this.props.event}
									players					= {this.props.players}
									disciplineItems			= {this.props.disciplineItems}
									disciplineValues		= {this.props.disciplineValues}
									activeSchoolId			= {this.props.activeSchoolId}
									handleClickChangeMode	= {this.props.handleClickChangeMode}
					/>
				</If>
				<If condition={this.props.isEditMode}>
					<DisciplineEdit	event				= {this.props.event}
									players				= {this.props.players}
									disciplineItems		= {this.props.disciplineItems}
									disciplineValues	= {this.props.disciplineValues}
									activeSchoolId		= {this.props.activeSchoolId}
									handleChange		= {this.props.handleChange}
									onSave				= {this.props.onSave}
									onCancel			= {this.props.onCancel}
					/>
				</If>
			</div>
		);
	}
});

module.exports = Discipline;