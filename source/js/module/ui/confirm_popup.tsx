import * as React from 'react';
import * as classNames from 'classnames';

import {Button} from 'module/ui/button/button';

interface ConfirmPopupProps {
	isOkButtonLoading?:         boolean
	okButtonText?:			    string | string[]
	cancelButtonText?:		    string
	handleClickOkButton?:	    () => void
	handleClickCancelButton?:   () => void
	isShowButtons?:			    boolean
	isShowOkButton?:			boolean
	isShowCancelButton?:		boolean
	isOkButtonDisabled?:	    boolean
	customStyle?:		    	string
	customFooterStyle?: 		string
}

export class ConfirmPopup extends React.Component<ConfirmPopupProps, {}> {
	static defaultProps: Partial<ConfirmPopupProps> = {
		isOkButtonLoading: false,
		isShowButtons: true,
		isShowOkButton: true,
		isShowCancelButton: true,
		okButtonText: 'Ok',
		cancelButtonText: 'Cancel'
	};

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
			mCancel:		this.props.isOkButtonDisabled,
			mDisplayNone:   !this.props.isShowOkButton
		});

		const cancelButtonClassName: string = classNames({
			mCancel:	    true,
			mDisplayNone:   !this.props.isShowCancelButton
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
								extraStyleClasses	= { cancelButtonClassName }
							/>
							<Button
								isLoading           = { this.props.isOkButtonLoading }
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