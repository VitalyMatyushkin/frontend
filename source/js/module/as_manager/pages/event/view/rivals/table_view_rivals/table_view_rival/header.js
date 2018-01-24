const	React						= require('react');

const	EventHelper					= require('module/helpers/eventHelper');

const	TableViewRivalHeaderStyle	= require('../../../../../../../../../styles/ui/b_table_view_rivals/b_table_view_rivals_header.scss');

const Header = React.createClass({
	propTypes: {
		eventType: React.PropTypes.string.isRequired
	},
	render: function() {
		switch (this.props.eventType) {
			case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				return (
					<div className='bTableViewRivalsHeader'>
						<div className="eTableViewRivalsHeader_plug mShort">
						</div>
						<div className="eTableViewRivalsHeader_rank">
							Rank
						</div>
						<div className="eTableViewRivalsHeader_score">
							Score
						</div>
						<div className="eTableViewRivalsHeader_actions">
							Actions
						</div>
					</div>
				);
			case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				return (
					<div className='bTableViewRivalsHeader'>
						<div className="eTableViewRivalsHeader_plug mLong">
						</div>
						<div className="eTableViewRivalsHeader_score">
							Score
						</div>
					</div>
				);
			case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				return (
					<div className='bTableViewRivalsHeader'>
						<div className="eTableViewRivalsHeader_plug mShort">
						</div>
						<div className="eTableViewRivalsHeader_score">
							Score
						</div>
						<div className="eTableViewRivalsHeader_actions">
							Actions
						</div>
					</div>
				);
		}
	}
});

module.exports = Header;