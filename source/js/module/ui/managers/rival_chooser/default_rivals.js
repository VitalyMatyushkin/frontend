// Main components
const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		classNames			= require('classnames');

// Helpers
const	TeamHelper			= require('../helpers/team_helper'),
		MoreartyHelper		= require('./../../../helpers/morearty_helper');

// Styles
const	TeamChooserStyles	= require('../../../../../styles/ui/teams_manager/b_rival_chooser.scss');

const DefaultRivals = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		isShowAddTeamButton		: React.PropTypes.bool,
		activeSchoolId			: React.PropTypes.string,
		handleClickAddTeam		: React.PropTypes.func,
		indexOfDisplayingRival	: React.PropTypes.number,
		handleChooseRival		: React.PropTypes.func.isRequired
	},
	onChooseRival: function (index) {
		this.getDefaultBinding().set('teamModeView.selectedRivalIndex', Immutable.fromJS(index));
	},
	getRivals: function () {
		const	selectedRivalIndex	= this.getDefaultBinding().toJS('teamModeView.selectedRivalIndex'),
				rivals				= this.getBinding('rivals').toJS();

		const event = this.getDefaultBinding().toJS('model');

		return rivals.map((rival, index) => {
			const	disable		= this.isRivalDisable(rival),
					eventType	= TeamHelper.getEventType(this.getDefaultBinding().toJS('model'));

			let text = '';
			switch (eventType) {
				case 'inter-schools':
					text = rival.school.name;
					break;
				case 'houses':
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
				(typeof this.props.indexOfDisplayingRival !== 'undefined' ? index === this.props.indexOfDisplayingRival : true)
			) {
				const xmlRivals = [];

				if(
					typeof this.props.indexOfDisplayingRival === 'undefined' &&
					index !== 0 &&
					index !== rivals.length
				) {
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
					<span
						key			= {`team-index-${index}`}
						className	= {teamClasses}
						onClick		= {!disable ? this.props.handleChooseRival.bind(null, rival.id) : null}
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
			TeamHelper.getEventType(event) === 'inter-schools' &&
			rival.school.id !== activeSchoolId
		);
	},
	render: function() {
		return (
			<div
				className="eRivalChooser_itemsContainer"
			>
				{this.getRivals()}
			</div>
		)
	}
});

module.exports = DefaultRivals;