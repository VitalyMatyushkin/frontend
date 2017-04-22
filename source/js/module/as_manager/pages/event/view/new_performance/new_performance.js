const	React					= require('react'),
		Morearty				= require('morearty'),
		Immutable				= require('immutable'),
		Promise 				= require('bluebird'),
		If						= require('module/ui/if/if'),
		PencilButton			= require('module/ui/pencil_button'),
		TeamHelper				= require('module/ui/managers/helpers/team_helper'),
		TabHelper				= require('module/as_manager/pages/event/view/tab_helper'),
		RoleHelper				= require('module/helpers/role_helper'),
		RivalPerformanceBlock	= require('module/as_manager/pages/event/view/new_performance/rival_performance_block');

const NewPerformance = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired
	},
	getEvent: function() {
		return this.getDefaultBinding().toJS('model');
	},
	isSync: function() {
		return this.getDefaultBinding().toJS('isRivalsSync');
	},
	isEditMode: function() {
		return this.getDefaultBinding().toJS('performanceTab.isEditMode');
	},
	isPerformanceItemChanged: function(performanceItem) {
		return !this.isNewPerformanceItem(performanceItem) && performanceItem.isChanged;
	},
	isNewPerformanceItem: function(performanceItem) {
		return typeof performanceItem._id === "undefined";
	},
	getPerformanceData: function() {
		return this.getDefaultBinding().toJS('results.individualPerformance');
	},
	getBackupPerformanceData: function() {
		return this.getDefaultBinding().toJS('performanceTab.backupIndividualPerformance');
	},
	restorePerformanceData: function() {
		this.getDefaultBinding().set(
			'model.results.individualPerformance',
			Immutable.fromJS(this.getBackupPerformanceData())
		);
	},
	changeViewMode: function() {
		this.getDefaultBinding().set(
			'performanceTab.isEditMode',
			!this.isEditMode()
		);
	},
	backupPerformanceData: function() {
		this.getDefaultBinding().set(
			'performanceTab.backupIndividualPerformance',
			Immutable.fromJS(this.getPerformanceData())
		);
	},
	clearBackupPerformanceDate: function() {
		this.getDefaultBinding().set('performanceTab.backupIndividualPerformance', undefined);
	},
	createNewPerformanceItem: function(event, individualPerformanceItem) {
		return window.Server.schoolEventIndividualPerformance.post(
			{
				schoolId:	this.props.activeSchoolId,
				eventId:	event.id
			},
			individualPerformanceItem
		);
	},
	updatePerformanceItem: function (event, individualPerformanceItem) {
		return window.Server.schoolEventIndividualPerformancePoint.put(
			{
				schoolId			: this.props.activeSchoolId,
				eventId				: event.id,
				performancePointId	: individualPerformanceItem._id
			},
			{
				value: individualPerformanceItem.value
			}
		);
	},
	submitIndividualPerformance: function(event) {
		// create new performance items
		const newItemsArray = event.results.individualPerformance
			.filter(individualPerformanceItem => this.isNewPerformanceItem(individualPerformanceItem))
			.map(individualPerformanceItem => this.createNewPerformanceItem(event, individualPerformanceItem));

		// update performance items
		const updItemsArray = event.results.individualPerformance
			.filter(individualPerformanceItem => this.isPerformanceItemChanged(individualPerformanceItem))
			.map(individualPerformanceItem => this.updatePerformanceItem(event, individualPerformanceItem));

		return Promise.all([].concat(newItemsArray, updItemsArray));
	},
	updateEventResultsFromServer: function() {
		const	binding	= this.getDefaultBinding(),
				event	= this.getEvent();

		return window.Server.schoolEvent.get(
			{
				schoolId:	this.props.activeSchoolId,
				eventId:	event.id
			}
		).then(_updEvent => {
			binding.set('model.results', Immutable.fromJS(_updEvent.results));

			return true;
		});
	},
	handleClickSaveButton: function() {
		this.clearBackupPerformanceDate();
		this.submitIndividualPerformance(this.getEvent())
			.then(() => {
				return this.updateEventResultsFromServer();
			})
			.then(() => {
				this.changeViewMode();

				return true;
			});
	},
	handleClickCancelButton: function() {
		this.restorePerformanceData();
		this.clearBackupPerformanceDate();
		this.changeViewMode();
	},
	handleClickChangeMode: function() {
		if(!this.isEditMode()) {
			this.backupPerformanceData();
		}
		this.changeViewMode();
	},
	handleValueChange: function(player, permissionId, performanceId, value) {
		const binding = this.getDefaultBinding();

		const	event		= this.getEvent(),
				pDataIndex	= event.results.individualPerformance.findIndex(pData =>
					pData.userId === player.userId &&
					pData.permissionId === permissionId &&
					pData.performanceId === performanceId
				);

		if(pDataIndex === -1) {
			const newPerformancePlayerData = {
				userId:			player.userId,
				permissionId:	permissionId,
				performanceId:	performanceId,
				value:			value
			};

			if(TeamHelper.isTeamSport(event)) {
				event.teamsData.forEach((t) => {
					if(!newPerformancePlayerData.teamId) {
						const foundPlayer = t.players.find(p => p.id === player.id);

						foundPlayer && (newPerformancePlayerData.teamId = t.id);
					}
				})
			}

			event.results.individualPerformance.push(newPerformancePlayerData);
		} else {
			event.results.individualPerformance[pDataIndex].value = value;
			event.results.individualPerformance[pDataIndex].isChanged = 1; //because value sometimes may be equal 0
		}

		binding.set('model', Immutable.fromJS(event));
	},
	renderControlButtonsBlock: function() {
		if(this.isEditMode()) {
			return this.renderEditModeControlButtonsBlock();
		} else {
			return this.renderViewModeControlButtonsBlock();
		}
	},
	renderViewModeControlButtonsBlock: function() {
		const event = this.getEvent();

		if(
			RoleHelper.getLoggedInUserRole(this) !== 'PARENT' &&
			RoleHelper.getLoggedInUserRole(this) !== 'STUDENT' &&
			TabHelper.isShowEditButtonByEvent(this.props.activeSchoolId, event)
		) {
			return (
				<div className="eEventPerformance_header">
					<PencilButton handleClick={ this.handleClickChangeMode }/>
				</div>
			);
		} else {
			return null;
		}
	},
	renderEditModeControlButtonsBlock: function() {
		const event = this.getEvent();

		if(TabHelper.isShowEditButtonByEvent(this.props.activeSchoolId, event)) {
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
	renderRivalPerformanceBlocks: function() {
		const	binding	= this.getDefaultBinding(),
				event	= this.getEvent(),
				rivals	= binding.toJS('rivals');

		const xmlRivals = [];
		let row = [];

		rivals.forEach((rival, rivalIndex) => {
			row.push(
				<RivalPerformanceBlock
					key					= { `rival_performance_block_${rivalIndex}` }
					rival				= { rival }
					event				= { event }
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
		if(this.isSync()) {
			return (
				<div className="bEventPerformance">
					{ this.renderControlButtonsBlock() }
					<div className="eEventPerformance_teams">
						{ this.renderRivalPerformanceBlocks() }
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = NewPerformance;