const 	React 			= require('react'),
    DateTimeMixin	= require('module/mixins/datetime'),
    EventHelper		= require('module/helpers/eventHelper'),
    SportIcon		= require('module/ui/icons/sport_icon'),
    ChallengeModel	= require('module/ui/challenges/challenge_model');

const FixtureListItem = React.createClass({

    mixins: [DateTimeMixin],

    propTypes: {
        event:			React.PropTypes.any.isRequired,
        activeSchoolId: React.PropTypes.string.isRequired
    },
    handleClickFixtureItem: function() {
        document.location.hash = `event/${this.props.event.id}`;
    },

    getFixtureInfo: function(event) {
        return(
            <div>
                <div className="eEventHeader_field mEvent">{event.name}</div>
                <div className="eEventHeader_field mDate">
                    {`${this.getDateFromIso(event.startTime)} / ${this.getTimeFromIso(event.startTime)} / ${event.sport.name}`}
                </div>
            </div>
        )
    },

    renderLeftOpponentSide: function (event, model) {
        return (
                <div>
                    <div className="eEventRival_logo">
                        <img className="eEventRivals_logoPic" src={model.rivals[0].schoolPic}/>
                    </div>
                    <div className="eEventRival_rivalName">{model.rivals[0].value}</div>
                    <div className="eEventRival_score">
                        <div className="ePlayer_score mBig">{`${model.scoreAr[0]}`}</div>
                    </div>
                </div>
        );
    },

    renderRightOpponentSide: function (event, model) {
        return (
                <div>
                    <div className="eEventRival_logo">
                        <img className="eEventRivals_logoPic" src={model.rivals[1].schoolPic}/>
                    </div>
                    <div className="eEventRival_rivalName">{model.rivals[1].value}</div>
                    <div className="eEventRival_score">
                        <div className="ePlayer_score mBig">{`${model.scoreAr[1]}`}</div>
                    </div>
                </div>
        );
    },
    handleClickGoBack: function() {
        document.location.hash = 'home';
    },
    render: function() {
        const 	event 			= this.props.event,
                activeSchoolId	= this.props.activeSchoolId,
                challengeModel	= new ChallengeModel(event, activeSchoolId);

        return (
            <div>
                <div className="bEventHeader">
                    <div className="bEventHeader_leftSide">
                        <div className="eEventHeader_field mEvent">
                            {this.getFixtureInfo(event)}
                        </div>
                    </div>

                    <div className="bEventHeader_rightSide">
                        <div	onClick		= { this.handleClickGoBack }
                                className	= "bButton mCancel"
                            >
                            Go Back
                        </div>
                    </div>
                </div>

                <div className="bEventInfo">
                    <div className="bEventRivals">
                        <div className="bEventRival tTeasttsts">
                            {this.renderLeftOpponentSide(event, challengeModel)}
                        </div>
                        <div className="bEventRival mRight">
                            {this.renderRightOpponentSide(event, challengeModel)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = FixtureListItem;
