import * as	React from 'react';
import {Button} from '../../../../ui/button/button';
import './../../../../../../styles/ui/b_add_event_button_wrapper.scss';

interface AddEventButtonProps {
	handleClick: () => void
}

const BUTTON_TEXT = 'Add event';

export const AddEventButton = (React as any).createClass({
	render: function(){
		return (
			<div className="bAddEventButtonWrapper mNegativeMargin">
				<Button
					text				= {BUTTON_TEXT}
					onClick				= {this.props.handleClick}
					extraStyleClasses	= {'mAddEvent'}
				/>
			</div>
		);
	}
});