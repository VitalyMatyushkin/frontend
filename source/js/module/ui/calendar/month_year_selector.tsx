import * as React		from 'react';
import * as Dropdown	from '../date_selector/dropdown/dropdown';
import {DateHelper}		from 'module/helpers/date_helper';
import 'styles/ui/b_month_year_selector.scss';
import {CalendarSize} from "module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard_calendar_widget/dashboard_calendar_widget";

interface MonthYearSelectorProps {
	size?:          CalendarSize
	isSync?:		boolean
	date:			any
	onMonthClick?:	(object: any) => void
}

interface MonthYearSelectorState {
	dateState: string
}

export class MonthYearSelector extends React.Component<MonthYearSelectorProps, MonthYearSelectorState> {
	readonly DROPDOWN_CSS_STYLE = 'mDateSelector';
	static defaultProps: Partial<MonthYearSelectorProps> = {isSync: true};
	
	constructor(props) {
		super(props);
		this.state = {
			dateState: ''
		};
	}
	
	componentWillMount(){
		this.setState({dateState: this.props.date});
	}
	
	componentWillReceiveProps(nextProps) {
		this.setState({dateState: nextProps.date});
	}

	getSizeModifierStyle() {
		switch (this.props.size) {
			case CalendarSize.Small: {
				return ' mMedium';
			}
			case CalendarSize.Medium: {
				return ' mMedium';
			}
			default: {
				return ''
			}
		}
	}

	getCurrentMonth(): number {
		return new Date(this.state.dateState).getMonth();
	}
	
	getCurrentYear(): number {
		return new Date(this.state.dateState).getFullYear();
	}
	
	getOptionsForMonthDropdown(): any {
		return DateHelper.monthNames.map((monthName, index) => {
				return {
					id:		String(index),
					value:	String(index),
					text:	monthName
				};
			}
		);
	}
	
	getOptionsForYearDropdown(): any {
		return DateHelper.getYearRangeArray().map((year, index) => {
				return {
					id:		String(index),
					value:	year,
					text:	year
				};
			}
		);
	}
	
	handleChangeMonth(newMonth: number): void {
		const dateObject = new Date(this.state.dateState);
		
		dateObject.setMonth(newMonth);
		this.setState({dateState: dateObject.toISOString()});
		this.props.onMonthClick(dateObject);
	}
	
	handleChangeYear(newYear: number): void {
		const dateObject = new Date(this.state.dateState);
		
		dateObject.setFullYear(newYear);
		this.setState({dateState: dateObject.toISOString()});
		this.props.onMonthClick(dateObject);
	}
	
	changeMonthAndYear(month: number, year: number): void {
		const dateObject = new Date(this.state.dateState);
		
		dateObject.setMonth(month);
		dateObject.setFullYear(year);
		this.setState({dateState: dateObject.toISOString()});
		this.props.onMonthClick(dateObject);
	}
	
	handleClickPrevMonth(): void {
		const currentMonth = this.getCurrentMonth();
		
		if(currentMonth === 0) {
			this.changeMonthAndYear(
				11,
				this.getCurrentYear() - 1
			);
		} else {
			this.handleChangeMonth(currentMonth - 1);
		}
	}
	
	handleClickNextMonth(): void {
		const currentMonth = this.getCurrentMonth();
		
		if(currentMonth === 11) {
			this.changeMonthAndYear(
				0,
				this.getCurrentYear() + 1
			);
		} else {
			this.handleChangeMonth(currentMonth + 1);
		}
	}
	
	renderPlaceHolder() {
		if(!this.props.isSync) {
			return (
				<div className="eMonthYearSelector_placeHolder">
				</div>
			);
		} else {
			return null;
		}
	}
	
	render() {
		return (
			<div className={`bMonthYearSelector ${this.getSizeModifierStyle()}`}>
				{ this.renderPlaceHolder() }
				<div className="eMonthYearSelector_smallSizeColumn mLeft">
					<div
						className	= "eMonthYearSelector_arrow mLeft"
						onClick		= {this.handleClickPrevMonth.bind(this)}
					>
						<i className="fa fa-arrow-left" aria-hidden="true"/>
					</div>
				</div>
				<div className="eMonthYearSelector_middleSizeColumn">
					<Dropdown
						optionsArray		= { this.getOptionsForMonthDropdown() }
						currentOptionId		= { String(this.getCurrentMonth()) }
						handleChange		= { this.handleChangeMonth.bind(this) }
						extraCssStyle		= { this.DROPDOWN_CSS_STYLE + this.getSizeModifierStyle() }
					/>
				</div>
				<div className="eMonthYearSelector_middleSizeColumn">
					<Dropdown
						optionsArray		= { this.getOptionsForYearDropdown() }
						currentOptionId		= { String(this.getCurrentYear()) }
						handleChange		= { this.handleChangeYear.bind(this) }
						extraCssStyle		= { this.DROPDOWN_CSS_STYLE + this.getSizeModifierStyle()}
					/>
				</div>
				<div className="eMonthYearSelector_smallSizeColumn mWithoutBorder mRight">
					<div
						className	= "eMonthYearSelector_arrow mRight"
						onClick		= {this.handleClickNextMonth.bind(this)}
					>
						<i className="fa fa-arrow-right" aria-hidden="true"/>
					</div>
				</div>
			</div>
		);
	}
}