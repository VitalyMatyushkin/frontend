/**
 * Created by Anatoly on 21.07.2016.
 */

import * as React from 'react';
import * as GenderIcon from 'module/ui/icons/gender_icon';

export interface GenderTypeProps {
    cell: 		any
    dataItem:	any
}

export class GenderType extends React.Component<GenderTypeProps, {}> {

	getGender(gender: string) {
		if(gender) {
			return <GenderIcon classes="bIcon-gender" gender={gender}/>;
		} else
			return null;
	}

	render() {
		const value	= this.props.cell.getValue(this.props.dataItem);

		return (
			<div className="eDataList_listItemCell">
				{this.getGender(value)}
			</div>
		);
	}
}
