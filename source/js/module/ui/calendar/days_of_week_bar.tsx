/**
 * Created by wert on 28.08.16.
 */

import * as React	from 'react';
import {CalendarSize} from "module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard_calendar_widget/dashboard_calendar_widget";

export interface DaysOfWeekBarProps {
	size?: CalendarSize
}

/** This is bar with days of week name in calendar. It always Mon - Sun and always the same.
 * It looks like bar with days of week:
 * Mon Tue Wed Thu Fri Sat Sun
 **/
export class DaysOfWeekBar extends React.Component<DaysOfWeekBarProps, {}> {
	getSizeModifierStyle() {
		switch (this.props.size) {
			case CalendarSize.ExtraSmall: {
				return ' mExtraSmall';
			}
			case CalendarSize.Small: {
				return ' mSmall';
			}
			case CalendarSize.Medium: {
				return ' mMedium';
			}
			default: {
				return ''
			}
		}
	}

	render() {
		return (
			<div className="eMonth_row mWeeks">
				<span className={`eMonth_day mWeekName ${this.getSizeModifierStyle()}`}>Mon</span>
				<span className={`eMonth_day mWeekName ${this.getSizeModifierStyle()}`}>Tue</span>
				<span className={`eMonth_day mWeekName ${this.getSizeModifierStyle()}`}>Wed</span>
				<span className={`eMonth_day mWeekName ${this.getSizeModifierStyle()}`}>Thu</span>
				<span className={`eMonth_day mWeekName ${this.getSizeModifierStyle()}`}>Fri</span>
				<span className={`eMonth_day mWeekName ${this.getSizeModifierStyle()}`}>Sat</span>
				<span className={`eMonth_day mWeekName ${this.getSizeModifierStyle()}`}>Sun</span>
			</div>
		);
	}
}