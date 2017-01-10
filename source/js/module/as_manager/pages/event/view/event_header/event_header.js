const	React			= require('react'),

		DateHelper		= require('module/helpers/date_helper');

const EventHeader = React.createClass({
	propTypes: {
		model: 	React.PropTypes.object
	},
	render: function() {
		const model 			= this.props.model,
			name				= model.name,
			date				= DateHelper.toLocalWithMonthName(model.dateUTC),
			time				= model.time,
			sport				= model.sport;

		return (
			<div className="bEventHeader_leftSide">
				<div className="eEventHeader_field mEvent">{`${name}`}</div>
				<div className="eEventHeader_field mDate">{`${time} / ${date} / ${sport}`}</div>
			</div>
		);
	}
});


module.exports = EventHeader;
