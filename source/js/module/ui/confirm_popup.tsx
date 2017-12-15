import * as React from 'react';
import * as classNames from 'classnames';

import {Button} from 'module/ui/button/button';

interface ConfirmPopupProps {
	okButtonText?:			    string | string[]
	cancelButtonText?:		    string
	handleClickOkButton?:	    () => void
	handleClickCancelButton?:   () => void
	isShowButtons?:			    boolean
	isOkButtonDisabled?:	    boolean
	customStyle?:		    	string
	customFooterStyle?: 		string
}

export class ConfirmPopup extends React.Component<ConfirmPopupProps, {}> {
	static defaultProps: Partial<ConfirmPopupProps> = {isShowButtons: true};

	handleClickOkButton() {
		this.props.handleClickOkButton();
	}

	getConfirmPopupStyle() {
		let style = "bConfirmPopup";

		if(typeof this.props.customStyle !== 'undefined') {
			style = `${style} ${this.props.customStyle}`;
		}

		return style;
	}

	render() {
		const okButtonClassName: string = classNames({
			mMarginLeft:	true,
			mDisable:		this.props.isOkButtonDisabled
		});

		const bodyStyle: string = classNames({
				eConfirmPopup_body	: true,
				mZeroMargin			: !this.props.isShowButtons
			});

		const footerStyle: string = classNames(
			{
				eConfirmPopup_footer	: true,
				mHide					: !this.props.isShowButtons
			},
			this.props.customFooterStyle
		);

		return (
			<div>
				<div className = "eConfirmPopup_overlay" >
					<div className = { this.getConfirmPopupStyle() } >
						<div className = { bodyStyle } >
							{ this.props.children }
						</div>
						<div className = { footerStyle } >
							<Button
								text				= { this.props.cancelButtonText }
								onClick				= { () => this.props.handleClickCancelButton() }
								extraStyleClasses	= "mCancel"
							/>
							<Button
								text				= { this.props.okButtonText }
								onClick				= { () => this.handleClickOkButton() }
								extraStyleClasses	= { okButtonClassName }
								isDisabled			= { this.props.isOkButtonDisabled }
							/>
						</div>
					</div>
					<div className = 'bPopupBack mAcitve' >
					</div>
				</div>
			</div>
		);
	}
};