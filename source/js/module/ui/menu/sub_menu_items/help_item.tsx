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
		console.log(this.state.isOpen);
	}
	
	render() {
		return (
			<a className={classNames("eTopMenu_drop", {mOpen:this.state.isOpen})} onClick={(e) => this.handleClickHelp(e)}>
				<div className="eArrow"/>
				{this.props.name}
				<div className="eTopMenu_dropItems">
					<a className={"eTopMenu_dropItem_options"} onClick={(e) => this.handleClickUserGuide(e)}>
						User Guide
						<form id='formUserId' method='post' target='_blank' action='http://docs.squadintouch.com/faq'>
							<input type='hidden' name='userId' value={this.props.userId} />
						</form>
					</a>
					<a className={"eTopMenu_dropItem_options"} onClick={(e) => this.handleClickDemo(e)}>
						Quick Start Demo
					</a>
				</div>
			</a>
		);
	}
}