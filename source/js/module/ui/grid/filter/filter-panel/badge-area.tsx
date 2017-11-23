/**
 * Created by Anatoly on 31.07.2016.
 */

import * as React from 'react';
import {Badge} from './badge';
import {BadgeModel} from "../model/badge-model";

export interface BadgeAreaModel {
    badges: {
        [key: string]: BadgeModel
    }
}

export interface BadgeAreaProps {
    model: BadgeAreaModel
}

export class BadgeArea extends React.Component<BadgeAreaProps, {}> {
	render() {
		const 	model 	= this.props.model,
				badges 	= model.badges;

		return (
			<div className="bBadgeArea">
					{Object.keys(badges).map((key, index) => {
						const badge = badges[key];
						return <Badge key={index} model={badge} />;
					})}
			</div>
		);
	}
}