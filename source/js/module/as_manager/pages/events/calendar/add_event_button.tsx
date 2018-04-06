import * as	React from 'react';
import {Button} from '../../../../ui/button/button';
import './../../../../../../styles/ui/b_add_event_button_wrapper.scss';
import {CalendarSize} from "module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard_calendar_widget/dashboard_calendar_widget";

interface AddEventButtonProps {
	size: CalendarSize,
	handleClick: () => void
}

const BUTTON_TEXT = 'Add event';

export const AddEventButton = (React as any).createClass({
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
	},
	render: function(){
		return (
			<div className="bAddEventButtonWrapper mNegativeMargin">
				<Button
					text				= {BUTTON_TEXT}
					onClick				= {this.props.handleClick}
					extraStyleClasses	= {`mAddEvent ${this.getSizeModifierStyle()}`}
				/>
			</div>
		);
	}
});