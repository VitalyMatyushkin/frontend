const	React				= require('react'),

		DateHelper			= require('module/helpers/date_helper'),
		Dropdown			= require('module/as_manager/pages/events/manager/manager_components/date_selector/dropdown/dropdown'),

		DateSelectorStyle	= require('styles/ui/b_month_year_selector.scss');

const MonthYearSelector = React.createClass({

	DROPDOWN_CSS_STYLE: 'mDateSelector',

	propTypes: {
		date: React.PropTypes.object.isRequired,
		onMonthClick: React.PropTypes.func
	},
	componentWillMount: function(){
		this.setState({dateState: this.props.date});
	},

	getCurrentMonth: function() {
		return String(new Date(this.state.dateState).getMonth());
	},
	getCurrentYear: function() {
		return String(new Date(this.state.dateState).getFullYear());
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

	handleChangeMonth: function(newMonth) {
		const dateObject = new Date(this.state.dateState);

		dateObject.setMonth(newMonth);
		this.setState({dateState: dateObject.toISOString()});
		this.props.onMonthClick(dateObject);
	},
	handleChangeYear: function(newYear) {
		const dateObject = new Date(this.state.dateState);

		dateObject.setFullYear(newYear);
		this.setState({dateState: dateObject.toISOString()});
		this.props.onMonthClick(dateObject);
	},

	render: function() {		
		const dateObject = new Date(this.state.dateState);

		return (
			<div className="bMonthYearSelector">
				<div className="eMonthYearSelector_leftSide">
					<Dropdown	optionsArray		= { this.getOptionsForMonthDropdown() }
								currentOptionId		= { this.getCurrentMonth() }
								handleChange		= { this.handleChangeMonth }
								extraCssStyle		= { this.DROPDOWN_CSS_STYLE }
					/>
				</div>
				<div className="eMonthYearSelector_rightSide">
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

module.exports = MonthYearSelector;