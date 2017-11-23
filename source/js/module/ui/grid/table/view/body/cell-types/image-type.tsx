/**
 * Created by Anatoly on 18.08.2016.
 */

import * as React from 'react';

export interface ImageTypeProps {
    cell: 		any
    dataItem:	any
}

export class ImageType extends React.Component<ImageTypeProps, {}> {
	render() {
		const   value = this.props.cell.getValue(this.props.dataItem),
			    result = value ? <img src={(window as any).Server.images.getResizedToBoxUrl(value, 60, 60)}/> : null;
		return (
			<div className="eDataList_listItemCell">
				{result}
			</div>
		);
	}
}
