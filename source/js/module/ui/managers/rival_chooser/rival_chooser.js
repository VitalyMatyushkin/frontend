// Main components
const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		Button				= require('module/ui/button/button'),
		classNames			= require('classnames');

// Helpers
const	TeamHelper			= require('../helpers/team_helper'),
		MoreartyHelper		= require('./../../../helpers/morearty_helper');

// Styles
const	TeamChooserStyles	= require('../../../../../styles/ui/teams_manager/b_rival_chooser.scss');

const RivalChooser = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		isInviteMode			: React.PropTypes.bool,
		handleClickAddTeam		: React.PropTypes.func,
		indexOfDisplayingRival	: React.PropTypes.number
	},
	onChooseRival: function (index) {
		this.getBinding('selectedRivalIndex').set(Immutable.fromJS(index));
	},
	getRivals: function () {
		const	selectedRivalIndex	= this.getBinding('selectedRivalIndex').toJS(),
				rivals				= this.getBinding('rivals').toJS();

		const event = this.getDefaultBinding().toJS('model');

		return rivals.map((rival, index) => {
			const	disable		= this.isRivalDisable(rival),
					eventType	= TeamHelper.getEventType(this.getDefaultBinding().toJS('model'));

			let text = '';
			switch (eventType) {
				case 'houses':
				case 'inter-schools':
					text = rival.name;
					break;
				case 'internal':
					const names = ['First', 'Second', 'Third'];
					if(index <= 2) {
						text = `${names[index]} team`;
					} else if(index > 2) {
						text = `${index + 1} team`;
					}
					break;
			}

			if(
				!TeamHelper.isInternalEventForIndividualSport(event) &&
				this.isShowRivals() &&
				(typeof this.props.indexOfDisplayingRival !== 'undefined' ? index === this.props.indexOfDisplayingRival : true)
			) {
				const xmlRivals = [];

				if(
					typeof this.props.indexOfDisplayingRival === 'undefined' &&
					index !== 0 &&
					index !== rivals.length
				) {
					xmlRivals.push(
						<span	key			= 'team-index-separator'
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
					<span	key			={`team-index-${index}`}
							className	={teamClasses}
							onClick		={!disable ? this.onChooseRival.bind(null, index) : null}
					>
						{text}
					</span>
				);

				return xmlRivals;
			}
		});
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
	isShowRivals: function() {
		const event = this.getDefaultBinding().toJS('model');

		return 	!this.props.isInviteMode &&
				!TeamHelper.isInternalEventForIndividualSport(event);
	},
	renderAddRivalButton: function() {
		const	binding	= this.getDefaultBinding(),
				event	= binding.toJS('model');

		if(TeamHelper.isInternalEventForTeamSport(event)) {
			return (
				<Button
					text	= "Add team"
					onClick	= { this.props.handleClickAddTeam }
				/>
			);
		} else {
			return null;
		}
	},
	render: function() {
		return (
			<div className="bRivalChooser">
				{ this.getRivals() }
				{ this.renderAddRivalButton() }
			</div>
		);
	}
});

module.exports = RivalChooser;