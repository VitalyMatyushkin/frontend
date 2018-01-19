import * as React    	from 'react';
import {If} 			from '../../../if/if';
import * as propz    	from 'propz';
import '../../../../../../styles/ui/b_school_list_item.scss';

interface SchoolListItemProps {
	isSelected: 	boolean,
	onMouseDown: 	() => void,
	data: 			School
}

export interface School {
	address: 						string
	defaultAlbumId:					string
	domain:							string
	id:								string
	kind:							string
	name:							string
	pic:							string
	postcode:						any
	postcodeId:						string
	publicBigscreenSite:			any
	publicSite:						any
	studentSelfRegistrationEnabled:	boolean
}

export class SchoolListItem extends React.Component<SchoolListItemProps> {
	getAddress(): string {
		let postcode = propz.get(this.props.data, ['postcode', 'postcode'], undefined);
		
		if(typeof postcode !== 'undefined') {
			postcode = `(${postcode})`;
		} else {
			postcode = '';
		}
		
		return `${this.props.data.address} ${postcode}`;
	}
	
	render() {
		return (
			<div
				className	= "bSchoolListItem"
				onMouseDown	= {this.props.onMouseDown}
			>
				<div className="eSchoolListItem_wrapper">
					<If condition={typeof this.props.data.pic !== 'undefined'}>
						<div className = "eSchoolListItem_wrapper_pic">
							<img
								className	= "eSchoolListItem_pic"
								src			= {this.props.data.pic}
							/>
						</div>
					</If>
					<div
						className	= "eSchoolListItem_name">
						{this.props.data.name}
					</div>
				</div>
				<If condition={typeof this.props.data.address !== 'undefined'}>
					<div className="eSchoolListItem_address">
						Address: {this.getAddress()}
					</div>
				</If>
			</div>
		)
	}
}