import * as React from 'react';

export interface Position {
    _id:    string,
    name:   string
}

export interface PlayerPositionColumnProps {
    selectedPositionId:			string
    positions: 					Position[]
    handleChangePlayerPosition:	(positionId: string) => void
}

export class PlayerPositionsColumn extends React.Component<PlayerPositionColumnProps, {}> {
    handleChangePlayerPosition(eventDescriptor) {
        this.props.handleChangePlayerPosition(eventDescriptor.target.value);
    }

    renderPositions() {
        return this.props.positions.map(position =>
            <option key={`${position._id}`} value={position._id}>{position.name}</option>
        );
    }

    render() {
        return (
            <td className="col-md-5">
                <select
	                id  		= "teamPosition_select"
                    className	= "eTeam_positionSelector"
                    value	    = {this.props.selectedPositionId}
                    onChange	= { e => this.handleChangePlayerPosition(e) }
                >
                    <option
                        key		= "not-selected-player-position"
                        value	= { undefined }
                    >
                        not selected
                    </option>
                    { this.renderPositions() }
                </select>
            </td>
        );
    }
}