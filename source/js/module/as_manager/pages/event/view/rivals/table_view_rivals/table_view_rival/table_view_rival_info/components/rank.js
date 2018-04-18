const	React					= require('react'),
		classNames				= require('classnames');

const	{ChallengeModelHelper}	= require('module/ui/challenges/challenge_model_helper'),
		EventHelper				= require('module/helpers/eventHelper');

const	EventRivalsStyle		= require('../../../../../../../../../../../styles/pages/event/b_event_rivals.scss'),
		TableViewRivalRankStyle	= require('../../../../../../../../../../../styles/ui/b_table_view_rivals/b_table_view_rival_rank.scss');

const Rank = React.createClass({
	propTypes: {
		rival:	React.PropTypes.object.isRequired,
		event:	React.PropTypes.object.isRequired
	},
	render: function() {
		let medal = null;

		if(!EventHelper.isNotFinishedEvent(this.props.event) && this.props.event.invitedSchoolIds.length > 1) {
			const	places		= ChallengeModelHelper.getSortedPlaceArrayForInterSchoolsMultipartyTeamEvent(this.props.event),
					placeData	= places.find(p => p.schoolIds.find(id => id === this.props.rival.school.id));

			let placeNameStyle;
			if (typeof placeData !== 'undefined') {
				switch (placeData.place) {
					case 1:
						placeNameStyle = 'mFirstPlace';
						break;
					case 2:
						placeNameStyle = 'mSecondPlace';
						break;
					case 3:
						placeNameStyle = 'mThirdPlace';
						break;
				}
			}

			if(typeof placeNameStyle !== "undefined") {
				medal = (
					<div className={'eEventRival_medal mTableView ' + placeNameStyle}>
					</div>
				);
			}
		}

		const classNameStyle =  classNames({
			bTableViewRivalRank:	true,
			mEmpty:					medal === null
		});

		if(medal === null) {
			medal = '-';
		}

		return (
			<div className={classNameStyle}>
				{ medal }
			</div>
		);
	}
});

module.exports = Rank;