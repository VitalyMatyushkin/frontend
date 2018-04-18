/**
 * Created by wert on 03.09.16.
 */

import * as React from 'react';

/** Item to be shown when no result found or still loading result or smth else.
 *  Just tiny wrapper for formatted text output
 */

interface NoResultItemProps {
	text: string
}

export class NoResultItem extends React.Component<NoResultItemProps, {}> {
	render() {
		return <div className="eChallenge mNotFound">{this.props.text}</div>;
	}
}