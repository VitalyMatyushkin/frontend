import * as React    	from 'react';
import * as propz    	from 'propz';
import '../../../../../../styles/ui/b_house_list_item.scss';

interface HouseListItemProps {
	isSelected: 	boolean,
	onMouseDown: 	() => void,
	data: 			House
}

interface House {
	colors:			string[]
	createdAt:		string
	description:	string
	id:				string
	name:			string
	pic:			string
	status: 		string
	statusUpdateBy:	any
}
export class HouseListItem extends React.Component<HouseListItemProps> {
	getHouseColor(): string {
		if(this.hasHouseColor()) {
			return this.props.data.colors[0];
		} else {
			return '';
		}
	}
	
	hasHouseColor(): boolean {
		const colors = propz.get(this.props.data, ['colors'], undefined);
		
		return colors.length > 0;
	}
	
	hasHouseLogo():boolean {
		const pic = propz.get(this.props.data, ['pic'], undefined);
		
		return typeof pic !== 'undefined';
	}
	
	renderColor() {
		if(this.hasHouseColor()) {
			return (
				<div className="eHouseListItem_picWrapper">
					<div
						className	= "eHouseListItem_color"
						style		= { { background: this.getHouseColor() } }
					>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
	
	renderHouseImage() {
		switch (true) {
			case this.hasHouseLogo():
				return this.renderHouseLogo();
			case this.hasHouseColor():
				return this.renderColor();
			default:
				return null;
		}
	}
	
	renderHouseLogo() {
		return (
			<div className = "eHouseListItem_picWrapper">
				<img	className	= "eHouseListItem_pic"
						src			= { this.props.data.pic }
				/>
			</div>
		);
	}
	
	render() {
		return (
			<div
				className	= "bHouseListItem"
				onMouseDown	= { () => this.props.onMouseDown() }
			>
				<div className="eHouseListItem_wrapper">
					{ this.renderHouseImage() }
					<div className= "eHouseListItem_name">
						{ this.props.data.name }
					</div>
				</div>
			</div>
		)
	}
}