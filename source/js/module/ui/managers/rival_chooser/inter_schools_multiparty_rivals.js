// Main components
const	React				= require('react'),
		Morearty			= require('morearty'),
		classNames			= require('classnames');

// Child react components
const	ActionList			= require('module/ui/action_list/action_list');

// Helpers
const	TeamHelper			= require('../helpers/team_helper'),
		MoreartyHelper		= require('./../../../helpers/morearty_helper');

// Styles
const	TeamChooserStyles	= require('../../../../../styles/ui/teams_manager/b_rival_chooser.scss');

const InterSchoolsMultipartyRivals = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		isInviteMode			: React.PropTypes.bool,
		activeSchoolId			: React.PropTypes.string,
		handleClickAddTeam		: React.PropTypes.func.isRequired,
		handleChooseRival		: React.PropTypes.func.isRequired,
		handleClickRemoveTeam	: React.PropTypes.func
	},
	getSchools: function () {
		const rivals = this.getBinding('rivals').toJS();

		let schools = [];
		// collect unique schools
		// because schools in rivals can be repeated
		rivals.forEach(rival => {
			const school = schools.find(s => s.id === rival.school.id);

			if(typeof school === 'undefined') {
				schools.push(rival.school);
			}
		});

		schools = schools.sort((school1, school2) => {
			if(school1.id === this.props.activeSchoolId && school2.id !== this.props.activeSchoolId) {
				return -1;
			}
			if(school1.id !== this.props.activeSchoolId && school2.id === this.props.activeSchoolId) {
				return 1;
			}

			return 0;
		});

		return schools.map((school, index) => {
			if(this.isShowSchoolByIndex(index)) {
				const xmlRivals = [];

				if(this.isShowVSLabelByIndex(index, rivals.length)) {
					xmlRivals.push(
						<span
							key			= 'team-index-separator'
							className	= 'eRivalChooser_separator'
						>
							vs.
						</span>
					);
				}

				xmlRivals.push(
					this.getSchool(school, index)
				);

				return xmlRivals;
			}
		});
	},
	/**
	 * It's a rule for displaying rivals.
	 * @param index
	 * @returns {boolean}
	 */
	isShowSchoolByIndex: function(index) {
		const indexOfDisplayingRival = this.props.indexOfDisplayingRival;

		if(this.props.isInviteMode) {
			// for invite mode show only first school
			return index === 0;
		} else {
			// Show any rivals if indexOfDisplayingRival is undefined or show only rival with index === indexOfDisplayingRival
			return typeof indexOfDisplayingRival !== 'undefined' ? index === indexOfDisplayingRival : true;
		}

	},
	/**
	 * It's a rule for displaying "vs" text label between rivals.
	 * @param currentRivalIndex
	 * @param rivalsLength
	 * @returns {boolean}
	 */
	isShowVSLabelByIndex: function(currentRivalIndex, rivalsLength) {
		const indexOfDisplayingRival = this.props.indexOfDisplayingRival;

		return (
			typeof indexOfDisplayingRival === 'undefined' &&
			currentRivalIndex !== 0 &&
			currentRivalIndex !== rivalsLength
		);
	},
	getSchool: function(school, index) {
		const	selectedRivalIndex	= this.getDefaultBinding().toJS('teamModeView.selectedRivalIndex'),
				eventType			= TeamHelper.getEventType(this.getDefaultBinding().toJS('model')),
				text				= school.name;

		if(school.id === this.props.activeSchoolId) {
			return (
				<ActionList
					buttonText					= { text }
					actionList					= { this.getRivalActionList(school.id) }
					handleClickActionItem		= { this.handleClickItemFromRivalActionList }
					handleClickRemoveActionItem	= { this.handleClickRemoveRival }
				/>
			);
		} else {
			const teamClasses = classNames({
				eRivalChooser_item	: true,
				mOnce				: typeof this.props.indexOfDisplayingRival !== 'undefined', //it mean that only one rival is displaying
				mNotActive			: eventType !== 'inter-schools' && selectedRivalIndex !== index,
				mDisable			: this.isSchoolDisable(school)
			});

			return (
				<span
					key			= {`team-index-${index}`}
					className	= {teamClasses}
				>
					{text}
				</span>
			);
		}
	},
	getRivalActionList: function(schoolId) {
		const rivals = this.getBinding('rivals').toJS();

		const rivalActionList = [];

		let teamCount = 0;
		rivals.forEach(rival => {
			if(rival.school.id === schoolId) {
				teamCount++;

				rivalActionList.push(
					{
						id:			rival.id,
						text:		`Team ${teamCount}`,
						options:	{
							isRemoveButtonEnable: true
						}
					}
				);
			}
		});
		if(teamCount === 1) {
			rivalActionList[0].options.isRemoveButtonEnable = false;
		}

		rivalActionList.push(
			{
				id:		'add_team',
				text:	'Add new team',
				options:	{
					isRemoveButtonEnable: false
				}
			}
		);

		return rivalActionList;
	},
	isSchoolDisable: function(school) {
		const	binding			= this.getDefaultBinding();

		const	event			= binding.toJS('model'),
				activeSchoolId	= MoreartyHelper.getActiveSchoolId(this);

		return (
			school.id !== activeSchoolId &&
			TeamHelper.getEventType(event) === 'inter-schools'
		);
	},
	handleClickItemFromRivalActionList: function(actionItemId) {
		switch (actionItemId) {
			case 'add_team':
				this.props.handleClickAddTeam();

				break;
			default:
				const rivalId = actionItemId;

				this.props.handleChooseRival(rivalId);
				break;
		}
	},
	handleClickRemoveRival: function(actionItemId) {
		const rivalId = actionItemId;

		this.props.handleClickRemoveTeam(rivalId);
	},
	render: function() {
		return (
			<div
				className="eRivalChooser_itemsContainer"
			>
				{this.getSchools()}
			</div>
		);
	}
});

module.exports = InterSchoolsMultipartyRivals;