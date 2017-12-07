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
		let value = this.props.cell.getValue(this.props.dataItem);

		if (Array.isArray(value)){
			value = value.length ===0 ? null : value[0].picUrl;
		}

		const result = value ? <img src={(window as any).Server.images.getResizedToBoxUrl(value, 60, 60)}/> : null;

		return (
			<div className="eDataList_listItemCell">
				{result}
			</div>
		);
	}
}
