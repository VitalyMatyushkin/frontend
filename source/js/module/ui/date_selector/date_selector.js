const	React				= require('react'),
		{DateHelper}			= require('../../helpers/date_helper'),
		Dropdown			= require('./dropdown/dropdown'),
		DateSelectorStyle	= require('../../../../styles/ui/b_date_selector.scss');

const DateSelector = React.createClass({

	SMALL_DATE_SELECTOR_CSS_STYLE: 'mSmallView',
	DROPDOWN_CSS_STYLE: 'mBigDateSelector',
	SMALL_VIEW_DROPDOWN_CSS_STYLE: 'mSmallDateSelector',

	propTypes: {
		date:				React.PropTypes.string.isRequired,
		handleChangeDate:	React.PropTypes.func.isRequired,
		isSmallView:		React.PropTypes.bool,
		extraStyle:			React.PropTypes.string
	},
	getDefaultProps: function(){
		return {
			isSmallMode: false
		};
	},

	getExtraStyleForDateSelector: function () {
		let extraStyle = '';

		if(this.props.isSmallView) {
			extraStyle = this.SMALL_DATE_SELECTOR_CSS_STYLE;
		}

		if(typeof this.props.extraStyle !== 'undefined') {
			extraStyle += ' ' + this.props.extraStyle;
		}

		return extraStyle;
	},
	getExtraStyleForDropDown: function (type) {
		switch (true) {
			case this.props.isSmallView && type === 'DAY':
				return `${this.SMALL_VIEW_DROPDOWN_CSS_STYLE} mMonthDay`;
			case this.props.isSmallView && type === 'MONTH':
				return this.SMALL_VIEW_DROPDOWN_CSS_STYLE;
			case this.props.isSmallView && type === 'YEAR':
				return `${this.SMALL_VIEW_DROPDOWN_CSS_STYLE} mYear`;
			default:
				return this.DROPDOWN_CSS_STYLE;
		}
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
			<div className={ "bDateSelector " + this.getExtraStyleForDateSelector() }>
				<div className={ "eDateSelector_leftSide " + this.getExtraStyleForDateSelector() }>
					<Dropdown	optionsArray		= { this.getOptionsForDayDropdown(dateObject) }
								currentOptionId		= { this.getCurrentDay() }
								handleChange		= { this.handleChangeDay }
								extraCssStyle		= { this.getExtraStyleForDropDown('DAY') }
					/>
				</div>
				<div className={ "eDateSelector_centerSide " + this.getExtraStyleForDateSelector() }>
					<Dropdown	optionsArray		= { this.getOptionsForMonthDropdown() }
								currentOptionId		= { this.getCurrentMonth() }
								handleChange		= { this.handleChangeMonth }
								extraCssStyle		= { this.getExtraStyleForDropDown('MONTH') }
					/>
				</div>
				<div className={ "eDateSelector_rightSide " + this.getExtraStyleForDateSelector() }>
					<Dropdown	optionsArray		= { this.getOptionsForYearDropdown() }
								currentOptionId		= { this.getCurrentYear() }
								handleChange		= { this.handleChangeYear }
								extraCssStyle		= { this.getExtraStyleForDropDown('YEAR') }
					/>
				</div>
			</div>
		);
	}
});

module.exports = DateSelector;