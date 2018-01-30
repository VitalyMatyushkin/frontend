/**
 * Created by wert on 02.09.16.
 */

import * as React from 'react';
import {SVG} from 'module/ui/svg';

interface DefaultItemProps {
	name?:			string
	num?:			string
	href?:			string
	className?:		string
	className2?:	string
	icon?:			string
	handleClick?:   (name: string, href: string) => void
}

export class DefaultItem extends React.Component<DefaultItemProps> {
	goByHref() {
		document.location.hash = this.props.href.substr(1);
	}

	handleClick() {
		if(typeof this.props.handleClick !== 'undefined' ) {
			const result = this.props.handleClick(
				this.props.name,
				this.props.href
			);
			if(result) {
				this.goByHref();
			}
		} else {
			this.goByHref();
		}
	}

	render() {
		const icon = this.props.icon ? <SVG classes={this.props.className} icon={this.props.icon} /> : null;

		return (
			<a onClick={() => this.handleClick()} className={this.props.className2}>
				{icon} {this.props.name} {this.props.num || ''}
			</a>
		);
	}
}