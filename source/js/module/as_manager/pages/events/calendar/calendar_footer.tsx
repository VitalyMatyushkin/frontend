import * as	React from 'react';
import {CalendarSize} from "module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard_calendar_widget/dashboard_calendar_widget";
import {Button} from '../../../../ui/button/button';

import './../../../../../../styles/ui/b_calendar_footer.scss';

interface CalendarFooterProps {
	size: CalendarSize,
	extraStyle?: string,
	handleClick: () => void
	isShowBackButton?: boolean
	handleClickBackButton?: () => void
}

export class CalendarFooter extends React.Component<CalendarFooterProps, {}> {
	isShowBackButton() {
		return this.props.isShowBackButton && this.props.size === CalendarSize.Small;
	}
	getExtraStyle() {
		return typeof this.props.extraStyle !== 'undefined' ? this.props.extraStyle : '';
	}
	getSizeModifierStyle() {
		switch (this.props.size) {
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
			<div className="bCalendarFooter">
				{
					this.isShowBackButton() ?
						<Button
							text={'Back'}
							onClick={this.props.handleClickBackButton}
							extraStyleClasses='mBack mCancel'
						/> : null
				}
				<Button
					text='Add event'
					onClick={this.props.handleClick}
					extraStyleClasses={`mAddEvent ${this.getSizeModifierStyle()} ${this.getExtraStyle()}`}
				/>
			</div>
		);
	}
}