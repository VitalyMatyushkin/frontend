import * as React from 'react';
import * as	classNames from 'classnames';

interface HelpItemProps {
	userId?:	string
	name?:      string
	className?: string
}

interface HelpItemState{
	isOpen: boolean
}

export class HelpItem extends React.Component<HelpItemProps, HelpItemState> {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false
		};
	}

	handleClickUserGuide(e): void {
		e.preventDefault();
		(document.getElementById('formUserId') as any).submit();
	}

	handleClickDemo(e): void {
		e.preventDefault();
		window.location.hash = '/demo';
	}

	handleClickHelp(e): void {
		e.preventDefault();
		const isOpen = this.state.isOpen;
		this.setState({isOpen: !isOpen});
	}

	onBlur(e): void {
		/**in IE11 onBlur is triggered faster than onClick, and onClick not triggered */
		setTimeout(() => {
			this.setState({isOpen: false});
		}, 100);

		e.stopPropagation();
	}
	
	render() {
		return (
			<div className={classNames("eTopMenu_drop", {mOpen:this.state.isOpen})} tabIndex={-1} onBlur={(e) => this.onBlur(e)}
			>
				<div className="eTopMenu_dropName" onClick={(e) => this.handleClickHelp(e)}>
					<div className="eArrow"/>
					{this.props.name}
				</div>
				<div className="eTopMenu_dropItems" >
					<div className={"eTopMenu_dropItem_options"} onClick={(e) => this.handleClickUserGuide(e)}>
						User Guide
						<form id='formUserId' method='post' target='_blank' action='http://docs.squadintouch.com/faq'>
							<input type='hidden' name='userId' value={this.props.userId} />
						</form>
					</div>
					<div className={"eTopMenu_dropItem_options"} onClick={(e) => this.handleClickDemo(e)}>
						Quick Start Demo
					</div>
				</div>
			</div>
		);
	}
}