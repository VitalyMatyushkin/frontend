const	React				= require('react'),
		DateHelper			= require('../../helpers/date_helper'),
		Dropdown			= require('./dropdown/dropdown'),
		DateSelectorStyle	= require('../../../../styles/ui/b_date_selector.scss');

const DateSelector = React.createClass({

	DROPDOWN_CSS_STYLE: 'mBigDateSelector',

	propTypes: {
		date:				React.PropTypes.string.isRequired,
		handleChangeDate:	React.PropTypes.func.isRequired
	},

	getCurrentDay: function() {
		return String(new Date(this.props.date).getDate());
	},
	getCurrentMonth: function() {
		return String(new Date(this.props.date).getMonth());
	},
	getCurrentYear: function() {
		return String(new Date(this.props.date).getFullYear());
	},

	getOptionsForDayDropdown: function(dateObject) {
		return DateHelper.getDaysFromCurrentMonth(dateObject.getFullYear(), dateObject.getMonth()).map(d => {
				return {
					id:		String(d),
					value:	d,
					text:	d
				};
			}
		);
	},
	getOptionsForMonthDropdown: function() {
		return DateHelper.monthNames.map((monthName, index) => {
				return {
					id:		String(index),
					value:	String(index),
					text:	monthName
				};
			}
		);
	},
	getOptionsForYearDropdown: function() {
		return DateHelper.getYearRangeArray().map((year, index) => {
				return {
					id:		String(index),
					value:	year,
					text:	year
				};
			}
		);
	},

	handleChangeDay: function(newDay) {
		const dateObject = new Date(this.props.date);

		dateObject.setDate(newDay);
		this.props.handleChangeDate(dateObject.toISOString());
	},
	handleChangeMonth: function(newMonth) {
		const dateObject = new Date(this.props.date);

		dateObject.setMonth(newMonth);
		this.props.handleChangeDate(dateObject.toISOString());
	},
	handleChangeYear: function(newYear) {
		const dateObject = new Date(this.props.date);

		dateObject.setFullYear(newYear);
		this.props.handleChangeDate(dateObject.toISOString());
	},


	render: function() {

		const dateObject = new Date(this.props.date);

		return (
			<div className="bDateSelector">
				<div className="eDateSelector_leftSide">
					<Dropdown	optionsArray		= { this.getOptionsForDayDropdown(dateObject) }
								currentOptionId		= { this.getCurrentDay() }
								handleChange		= { this.handleChangeDay }
								extraCssStyle		= { this.DROPDOWN_CSS_STYLE }
					/>
				</div>
				<div className="eDateSelector_centerSide">
					<Dropdown	optionsArray		= { this.getOptionsForMonthDropdown() }
								currentOptionId		= { this.getCurrentMonth() }
								handleChange		= { this.handleChangeMonth }
								extraCssStyle		= { this.DROPDOWN_CSS_STYLE }
					/>
				</div>
				<div className="eDateSelector_rightSide">
					<Dropdown	optionsArray		= { this.getOptionsForYearDropdown() }
								currentOptionId		= { this.getCurrentYear() }
								handleChange		= { this.handleChangeYear }
								extraCssStyle		= { this.DROPDOWN_CSS_STYLE }
					/>
				</div>
			</div>
		);
	}
});

module.exports = DateSelector;