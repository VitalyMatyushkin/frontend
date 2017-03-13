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

const RivalChooser = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		isInviteMode			: React.PropTypes.bool,
		indexOfDisplayingRival	: React.PropTypes.number
	},
	onChooseRival: function (index) {
		this.getBinding('selectedRivalIndex').set(Immutable.fromJS(index));
	},
	getRivals: function () {
		const	selectedRivalIndex	= this.getBinding('selectedRivalIndex').toJS(),
				rivalsBinding		= this.getBinding('rivals');

		const event = this.getDefaultBinding().toJS('model');

		return rivalsBinding.get().map((rival, index) => {
			const	disable		= this.isRivalDisable(rival),
				eventType	= TeamHelper.getEventType(this.getDefaultBinding().toJS('model'));

			let text = '';
			switch (eventType) {
				case 'houses':
				case 'inter-schools':
					text = rival.get('name');
					break;
				case 'internal':
					if(index == 0) {
						text = "First team";
					} else {
						text = "Second team";
					}
					break;
			}

			if(
				!TeamHelper.isInternalEventForIndividualSport(event) &&
				this.isShowRivals() &&
				(typeof this.props.indexOfDisplayingRival !== 'undefined' ? index === this.props.indexOfDisplayingRival : true)
			) {
				const xmlRivals = [];

				if(typeof this.props.indexOfDisplayingRival === 'undefined' && index === 1) {
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
		}).toArray();
	},
	isRivalDisable: function(rival) {
		const	binding			= this.getDefaultBinding(),
				event			= binding.toJS('model'),
				activeSchoolId	= MoreartyHelper.getActiveSchoolId(this);

		return (
			rival.get('id') !== activeSchoolId &&
			TeamHelper.getEventType(event) === 'inter-schools'
		);
	},
	isShowRivals: function() {
		const event = this.getDefaultBinding().toJS('model');

		return !this.props.isInviteMode &&
			!(
				TeamHelper.isIndividualSport(event) &&
				TeamHelper.getEventType(event) !== 'houses'
			);
	},
	render: function() {
		return (
			<div className="bRivalChooser">
				{this.getRivals()}
			</div>
		);
	}
});

module.exports = RivalChooser;