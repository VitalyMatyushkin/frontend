const	React				= require('react'),
		{DateHelper}			= require('module/helpers/date_helper'),
		Dropdown			= require('../date_selector/dropdown/dropdown'),
		DateSelectorStyle	= require('styles/ui/b_month_year_selector.scss');

const MonthYearSelector = React.createClass({

	DROPDOWN_CSS_STYLE: 'mDateSelector',

	propTypes: {
		isSync:			React.PropTypes.bool,
		date:			React.PropTypes.object.isRequired,
		onMonthClick:	React.PropTypes.func
	},
	componentWillMount: function(){
		this.setState({dateState: this.props.date});
	},
	getDefaultProps: function(){
		return {
			isSync: true
		};
	},
	componentWillReceiveProps: function(nextProps) {
		this.setState({dateState: nextProps.date});
	},

	getCurrentMonth: function() {
		return new Date(this.state.dateState).getMonth();
	},
	getCurrentYear: function() {
		return new Date(this.state.dateState).getFullYear();
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
	changeMonthAndYear: function(month, year) {
		const dateObject = new Date(this.state.dateState);

		dateObject.setMonth(month);
		dateObject.setFullYear(year);
		this.setState({dateState: dateObject.toISOString()});
		this.props.onMonthClick(dateObject);
	},
	handleClickPrevMonth: function() {
		const currentMonth = this.getCurrentMonth();

		if(currentMonth === 0) {
			this.changeMonthAndYear(
				11,
				this.getCurrentYear() - 1
			);
		} else {
			this.handleChangeMonth(currentMonth - 1);
		}
	},
	handleClickNextMonth: function() {
		const currentMonth = this.getCurrentMonth();

		if(currentMonth === 11) {
			this.changeMonthAndYear(
				0,
				this.getCurrentYear() + 1
			);
		} else {
			this.handleChangeMonth(currentMonth + 1);
		}
	},
	renderPlaceHolder: function() {
		if(!this.props.isSync) {
			return (
				<div className="eMonthYearSelector_placeHolder">
				</div>
			);
		} else {
			return null;
		}
	},
	render: function() {
		return (
			<div className="bMonthYearSelector">
				{ this.renderPlaceHolder() }
				<div className="eMonthYearSelector_smallSizeColumn mLeft">
					<div	className	= "eMonthYearSelector_arrow mLeft"
							onClick		= {this.handleClickPrevMonth}
					>
						<i className="fa fa-arrow-left" aria-hidden="true"></i>
					</div>
				</div>
				<div className="eMonthYearSelector_middleSizeColumn">
					<Dropdown	optionsArray		= { this.getOptionsForMonthDropdown() }
								currentOptionId		= { String(this.getCurrentMonth()) }
								handleChange		= { this.handleChangeMonth }
								extraCssStyle		= { this.DROPDOWN_CSS_STYLE }
					/>
				</div>
				<div className="eMonthYearSelector_middleSizeColumn">
					<Dropdown	optionsArray		= { this.getOptionsForYearDropdown() }
								currentOptionId		= { String(this.getCurrentYear()) }
								handleChange		= { this.handleChangeYear }
								extraCssStyle		= { this.DROPDOWN_CSS_STYLE }
					/>
				</div>
				<div className="eMonthYearSelector_smallSizeColumn mWithoutBorder mRight">
					<div	className	= "eMonthYearSelector_arrow mRight"
							onClick		= {this.handleClickNextMonth}
					>
						<i className="fa fa-arrow-right" aria-hidden="true"></i>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = MonthYearSelector;