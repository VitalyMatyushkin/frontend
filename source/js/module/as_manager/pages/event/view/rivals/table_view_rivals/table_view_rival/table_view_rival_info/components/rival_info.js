const	React					= require('react');

const	classNames				= require('classnames');

const	EventHelper				= require('module/helpers/eventHelper');

const	TableViewRivalInfoStyle	= require('../../../../../../../../../../../styles/ui/b_table_view_rivals/b_table_view_rival_info.scss');

const RivalInfo = React.createClass({
	propTypes: {
		eventType:	React.PropTypes.string.isRequired,
		pic:		React.PropTypes.string.isRequired,
		name:		React.PropTypes.string.isRequired
	},
	getRivalInfoStyleName: function() {
		const classNameStyle =  classNames({
			bTableViewRivalInfo	:	true,
			mLong:					(
				this.props.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['houses'] ||
				this.props.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['internal']
			)
		});

		return classNameStyle;
	},
	render: function() {
		return (
			<div
				className={ this.getRivalInfoStyleName() }
			>
				<div
					className="eTableViewRivalInfo_logo"
				>
					<img
						className	= "eTableViewRivalInfo_logoPic"
						src			= { this.props.pic }
					/>
				</div>
				<div
					className="eTableViewRivalInfo_name"
				>
					{ this.props.name }
				</div>
			</div>
		);
	}
});

module.exports = RivalInfo;