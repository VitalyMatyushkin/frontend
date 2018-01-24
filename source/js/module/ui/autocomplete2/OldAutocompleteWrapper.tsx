import * as React    	from 'react';
import {ComboBox2}		from'module/ui/autocomplete2/ComboBox2';

interface AutocompleteProps {
	serverField:		string,
	serviceFullData?:	(text: string) => any,
	serviceFilter?:		(text: string) => any,
	onSelect?:			(id: string, element: any) => void,
	onBlur?:			() => void,
	onInput?:			() => void,
	placeholder?:		string,
	onEscapeSelection?:	() => void,
	clearAfterSelect?:	boolean,
	isBlocked?:			boolean,
	defaultItem?:		any,
	extraCssStyle?:		string,
	getElementTitle?:	(elem: any) => string,
	customListItem?:	any,
	id?:				string
}

interface SearchItem {
	sync:  	any[],
	async:	any
}
export class Autocomplete extends React.Component<AutocompleteProps> {
	
	searchFunction(text): SearchItem {
		return {
			sync	:  [],
			async	: this.props.serviceFilter ? this.props.serviceFilter(text) : this.props.serviceFullData(text)
		};
	}
	
	getEscapeSelectFunction(): any {
		if(this.props.onEscapeSelection === undefined) {
			return () => {};
		} else {
			return this.props.onEscapeSelection;
		}
	}
	
	getInputText(elem): any {
		if(typeof this.props.getElementTitle !== 'undefined') {
			return this.props.getElementTitle(elem);
		} else {
			return elem[this.props.serverField];
		}
	}
	
	getElementTooltip(elem): string {
		return  typeof elem.tooltip !== 'undefined' ? elem.tooltip : '';
	}
	
	render() {
		return (
			<ComboBox2
				defaultItem			= {this.props.defaultItem}
				placeholder			= {this.props.placeholder}
				searchFunction		= {this.searchFunction.bind(this)}
				onSelect			= {this.props.onSelect}
				getElementTitle		= {this.getInputText.bind(this)}
				getElementTooltip	= {this.getElementTooltip.bind(this)}
				onEscapeSelection	= {this.getEscapeSelectFunction()}
				clearAfterSelect	= {this.props.clearAfterSelect !== undefined ? this.props.clearAfterSelect : false}
				extraCssStyle		= {this.props.extraCssStyle}
				isBlocked			= {this.props.isBlocked}
				customListItem		= {this.props.customListItem}
				id					= {this.props.id}
			/>
		);
	}
}