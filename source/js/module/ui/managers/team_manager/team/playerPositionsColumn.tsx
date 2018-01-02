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
        return this.props.positions.map((position, index) =>
            <option key={`${position._id}`} value={position._id}>{position.name}</option>
        );
    }

    render() {
        const {selectedPositionId} = this.props;

        return (
            <td className="col-md-5">
                <select className	= "eTeam_positionSelector"
                        id  		= "teamPosition_select"
                        value	    = {selectedPositionId}
                        onChange	= { e => this.handleChangePlayerPosition(e) }
                >
                    <option	key		= "not-selected-player-position"
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