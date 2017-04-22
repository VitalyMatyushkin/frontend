const	React					= require('react'),
		Immutable				= require('immutable'),
		Morearty				= require('morearty'),
		Promise 				= require('bluebird'),
		RivalDisciplineBlock	= require('module/as_manager/pages/event/view/new_discipline/rival_discipline_block'),
		PencilButton			= require('module/ui/pencil_button'),
		TabHelper				= require('module/as_manager/pages/event/view/tab_helper'),
		RoleHelper				= require('../../../../../helpers/role_helper');

const NewDiscipline = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId : React.PropTypes.string.isRequired
	},
	getDiscipline: function() {
		return this.getDefaultBinding().toJS('model.results.individualDiscipline');
	},
	getBackupDiscipline: function() {
		return this.getDefaultBinding().toJS('disciplineTab.backupDiscipline');
	},
	backupDiscipline: function() {
		this.getDefaultBinding().set(
			'disciplineTab.backupDiscipline',
			Immutable.fromJS(this.getDiscipline())
		);
	},
	restoreDiscipline: function() {
		this.getDefaultBinding().set(
			'model.results.individualDiscipline',
			Immutable.fromJS(this.getBackupDiscipline())
		);
	},
	clearBackupDiscipline: function() {
		this.getDefaultBinding().set(
			'disciplineTab.backupDiscipline',
			undefined
		);
	},
	isEditMode: function() {
		return this.getDefaultBinding().toJS('disciplineTab.isEditMode');
	},
	isDataSync: function() {
		return this.getDefaultBinding().toJS('isRivalsSync');
	},
	isNewDisciplineItem: function(disciplineItem) {
		return typeof disciplineItem._id === "undefined";
	},
	isDisciplineItemChanged: function(disciplineItem) {
		return !this.isNewDisciplineItem(disciplineItem) && disciplineItem.isChanged;
	},
	getEvent: function() {
		return this.getDefaultBinding().toJS('model');
	},
	disciplineItems: function() {
		const event = this.getEvent();

		if(typeof event.sport.discipline !== "undefined") {
			return event.sport.discipline;
		} else {
			return [];
		}
	},
	disciplineValues: function() {
		const event = this.getEvent();

		if(
			typeof event.results !== "undefined" &&
			typeof event.results.individualDiscipline !== "undefined"
		) {
			return event.results.individualDiscipline;
		} else {
			return [];
		}
	},
	createNewDisciplineItem: function(event, individualDisciplineItem) {
		window.Server.schoolEventIndividualDiscipline.post(
			{
				schoolId:	this.props.activeSchoolId,
				eventId:	event.id
			},
			individualDisciplineItem
		)
	},
	updateDisciplineItem: function(event, individualDisciplineItem) {
		window.Server.schoolEventIndividualDisciplinePoint.put(
			{
				schoolId:			this.props.activeSchoolId,
				eventId:			event.id,
				disciplinePointId:	individualDisciplineItem._id
			},
			{
				value: individualDisciplineItem.value
			}
		)
	},
	submitIndividualDiscipline: function(event) {
		let promises = [];

		// create new discipline items
		promises.push(
			event.results.individualDiscipline
				.filter(individualDisciplineItem => this.isNewDisciplineItem(individualDisciplineItem))
				.map(individualDisciplineItem => this.createNewDisciplineItem(event, individualDisciplineItem))
		);
		// update discipline items
		promises.push(
			event.results.individualDiscipline
				.filter(individualDisciplineItem => this.isDisciplineItemChanged(individualDisciplineItem))
				.map(individualDisciplineItem => this.updateDisciplineItem(event, individualDisciplineItem))
		);

		return Promise.all(promises);
	},
	handleChange: function(userId, permissionId, teamId, disciplineId, valueObject) {
		const disciplineValues = this.disciplineValues();

		const foundDisciplineValueIndex = disciplineValues.findIndex(disciplineValue => {
			return disciplineValue.userId === userId && disciplineValue.disciplineId === disciplineId;
		});

		if(foundDisciplineValueIndex === -1) {
			disciplineValues.push({
				userId			: userId,
				permissionId	: permissionId,
				teamId			: teamId,
				disciplineId	: disciplineId,
				value			: valueObject.value
			});
		} else {
			disciplineValues[foundDisciplineValueIndex].value = valueObject.value;
			disciplineValues[foundDisciplineValueIndex].isChanged = true;
		}

		this.getDefaultBinding().set('model.results.individualDiscipline', Immutable.fromJS(disciplineValues));
	},
	changeViewMode: function() {
		this.getDefaultBinding().set(
			'disciplineTab.isEditMode',
			!this.isEditMode()
		);
	},
	handleClickChangeMode: function() {
		if(!this.isEditMode()) {
			this.backupDiscipline();
		}
		this.changeViewMode();
	},
	handleClickSaveButton: function() {
		this.submitIndividualDiscipline(this.getEvent());
		this.clearBackupDiscipline();
		this.changeViewMode();
	},
	handleClickCancelButton: function() {
		this.restoreDiscipline();
		this.clearBackupDiscipline();
		this.changeViewMode();
	},
	handleValueChange: function(userId, permissionId, teamId, disciplineId, valueObject) {
		const disciplineValues = this.disciplineValues();

		const foundDisciplineValueIndex = disciplineValues.findIndex(disciplineValue => {
			return disciplineValue.userId === userId && disciplineValue.disciplineId === disciplineId;
		});

		if(foundDisciplineValueIndex === -1) {
			disciplineValues.push({
				userId			: userId,
				permissionId	: permissionId,
				teamId			: teamId,
				disciplineId	: disciplineId,
				value			: valueObject.value
			});
		} else {
			disciplineValues[foundDisciplineValueIndex].value = valueObject.value;
			disciplineValues[foundDisciplineValueIndex].isChanged = true;
		}

		this.getDefaultBinding().set('model.results.individualDiscipline', Immutable.fromJS(disciplineValues));
	},
	renderEditModeControlButtonsBlock: function() {
		if(TabHelper.isShowEditButtonByEvent(this.props.activeSchoolId, this.getEvent())) {
			return (
				<div className="eEventPerformance_header">
					<div	className	= "bButton mCancel mMarginRight"
							onClick		= {this.handleClickCancelButton}
					>
						Cancel
					</div>
					<div	className	= "bButton"
							onClick		= {this.handleClickSaveButton}
					>
						Save
					</div>
				</div>
			);
		} else {
			return null;
		}
	},
	renderViewModeControlButtonsBlock: function() {
		if (
			RoleHelper.getLoggedInUserRole(this) !== 'PARENT' &&
			RoleHelper.getLoggedInUserRole(this) !== 'STUDENT' &&
			TabHelper.isShowEditButtonByEvent(this.props.activeSchoolId, this.getEvent())
		) {
			return (
				<div className="eEventPerformance_header">
					<PencilButton handleClick={this.handleClickChangeMode}/>
				</div>
			);
		} else {
			return null;
		}
	},
	renderControlButtonsBlock: function() {
		if(this.isEditMode()) {
			return this.renderEditModeControlButtonsBlock();
		} else {
			return this.renderViewModeControlButtonsBlock();
		}
	},
	renderRivalDisciplineBlocks: function() {
		const	binding	= this.getDefaultBinding(),
				event	= this.getEvent(),
				rivals	= binding.toJS('rivals');

		const xmlRivals = [];
		let row = [];

		rivals.forEach((rival, rivalIndex) => {
			row.push(
				<RivalDisciplineBlock
					key					= { `rival_performance_block_${rivalIndex}` }
					rival				= { rival }
					event				= { event }
					disciplineItems		= { this.disciplineItems() }
					disciplineValues	= { this.disciplineValues() }
					isEditMode			= { this.isEditMode() }
					handleValueChange	= { this.handleValueChange }
					activeSchoolId		= { this.props.activeSchoolId }
				/>
			);

			if(
				rivalIndex % 2 !== 0 ||
				rivalIndex === rivals.length - 1
			) {
				xmlRivals.push(
					<div
						key			= {`rival_performance_block_row_${rivalIndex}`}
						className	= {'eEventPerformance_row'}
					>
						{row}
					</div>
				);
				row = [];
			}
		});

		return xmlRivals;
	},
	render: function() {
		let body = null;

		if(this.isDataSync()) {
			return (
				<div className="bEventPerformance">
					{ this.renderControlButtonsBlock() }
					<div className="eEventPerformance_body">
						{ this.renderRivalDisciplineBlocks() }
					</div>
				</div>
			);
		}

		return body;
	}
});

module.exports = NewDiscipline;