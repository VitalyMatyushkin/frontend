import * as React from 'react';

interface HelpItemProps {
	userId?:	string
	name?:      string
	className?: string
}

export class HelpItem extends React.Component<HelpItemProps> {
	handleClick(e): void {
		e.preventDefault();
		(document.getElementById('formUserId') as any).submit();
	}
	
	render() {
		return (
			<a className={this.props.className} onClick={this.handleClick}>
				{this.props.name}
				<form id='formUserId' method='post' target='_blank' action='http://docs.squadintouch.com/faq'>
					<input type='hidden' name='userId' value={this.props.userId} />
				</form>
			</a>
		);
	}
}