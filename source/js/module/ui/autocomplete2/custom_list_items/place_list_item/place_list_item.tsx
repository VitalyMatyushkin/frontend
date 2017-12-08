import * as React    	from 'react';
import '../../../../../../styles/ui/b_place_list_item.scss';

interface PlaceListItemProps {
	isSelected: 	boolean,
	onMouseDown: 	() => void,
	data: 			Place
}

interface Place {
	id:					string
	name:				string
	point: 				Point
	postcode:			string
	postcodeId:			string
	postcodeNoSpaces:	string
	schoolId:			string
	tooltip:			string
}

interface Point {
	coordinates: [number, number]
	lat: number
	lng: number
}

export class PlaceListItem extends React.Component<PlaceListItemProps> {
	/**
	 * props.place can be place or can be postcode.
	 * @param place
	 * @returns {boolean}
	 */
	isPlace(): boolean {
		return typeof this.props.data.name !== 'undefined';
	}
	
	getPostcodeTooltip(): string {
		return typeof this.props.data.tooltip !== 'undefined' ? this.props.data.tooltip : '';
	}
	
	renderPostcode() {
		return (
			<div
				className	= "bPlaceListItem"
				onMouseDown	= {this.props.onMouseDown}
			>
				{`${this.props.data.postcode} `}
				<span className="ePlaceListItem_tooltipText">{this.getPostcodeTooltip()}</span>
			</div>
		);
	}
	
	renderPlace() {
		return (
			<div
				className	= "bPlaceListItem"
				onMouseDown	= {this.props.onMouseDown}
			>
				{`${this.props.data.name} `}
				<span className="ePlaceListItem_tooltipText">{`(${this.props.data.postcode})`}</span>
			</div>
		);
	}
	
	render() {
		return this.isPlace() ? this.renderPlace() : this.renderPostcode();
	}
}