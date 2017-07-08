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
		indexOfDisplayingRival	: React.PropTypes.number,
		handleClickAddTeam		: React.PropTypes.func.isRequired,
		handleChooseRival		: React.PropTypes.func.isRequired
	},
	getRivals: function () {
		const	selectedRivalIndex	= this.getBinding('selectedRivalIndex').toJS(),
				rivals				= this.getBinding('rivals').toJS();

		let		schools				= [];
		// collect unique schools
		rivals.forEach(rival => {
			const school = schools.find(s => s.id === rival.id);

			if(typeof school === 'undefined') {
				schools.push(rival);
			}
		});

		const event = this.getDefaultBinding().toJS('model');
		return schools.map((school, index) => {
			const	disable		= this.isRivalDisable(school),
					eventType	= TeamHelper.getEventType(event);

			let text = school.name;

			if(this.isShowCurrentRivalByIndex(index)) {
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

				const teamClasses = classNames({
					eRivalChooser_item	: true,
					mOnce				: typeof this.props.indexOfDisplayingRival !== 'undefined', //it mean that only one rival is displaying
					mNotActive			: eventType !== 'inter-schools' && selectedRivalIndex !== index,
					mDisable			: disable
				});

				xmlRivals.push(
					this.getRival(school.id, index, teamClasses, text, disable)
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
	isShowCurrentRivalByIndex: function(index) {
		const indexOfDisplayingRival = this.props.indexOfDisplayingRival;

		// Show any rivals if indexOfDisplayingRival is undefined or show only rival with index === indexOfDisplayingRival
		return typeof indexOfDisplayingRival !== 'undefined' ? index === indexOfDisplayingRival : true;
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
	getRival: function(schoolId, index, teamClasses, text, disable) {
		if(index === 0) {
			return (
				<ActionList
					buttonText				= {text}
					actionList				= {this.getRivalActionList(schoolId)}
					handleClickActionItem	= {this.handleClickItemFormRivalActionList.bind(null, schoolId)}
				/>
			);
		} else {
			return (
				<span
					key			= {`team-index-${index}`}
					className	= {teamClasses}
					onClick		= {!disable ? this.onChooseRival.bind(null, index) : null}
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
		rivals.forEach((rival, rivalIndex) => {
			if(rival.id === schoolId) {
				teamCount++;

				rivalActionList.push(
					{
						id:		String(rivalIndex),
						text:	`Team ${teamCount}`
					}
				);
			}
		});

		rivalActionList.push({id: 'add_team', text: 'Add new team'});

		return rivalActionList;
	},
	isRivalDisable: function(rival) {
		const	binding			= this.getDefaultBinding(),
				event			= binding.toJS('model'),
				activeSchoolId	= MoreartyHelper.getActiveSchoolId(this);

		return (
			rival.id !== activeSchoolId &&
			TeamHelper.getEventType(event) === 'inter-schools'
		);
	},
	handleClickItemFormRivalActionList: function(schoolId, actionItemId) {
		switch (actionItemId) {
			case 'add_team':
				this.props.handleClickAddTeam(schoolId);

				break;
			default:
				// This code string is only for show that by default actionItemId is a rivalIndex
				const rivalIndex = actionItemId;

				this.props.handleChooseRival(rivalIndex);
				break;
		}
	},
	render: function() {
		return (
			<span>
				{this.getRivals()}
			</span>
		);
	}
});

module.exports = InterSchoolsMultipartyRivals;