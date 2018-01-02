import * as React from 'react';

export interface PlayerSubColumnProps {
    isChecked:				boolean
    handleClickPlayerSub:	(isChecked: boolean) => void
}

export class PlayerSubColumn extends React.Component<PlayerSubColumnProps, {}> {
    isChecked(): boolean {
        return typeof this.props.isChecked !== 'undefined' ? this.props.isChecked : false;
    }

    handleCheckBoxClick(eventDescriptor) {
        this.props.handleClickPlayerSub(eventDescriptor.target.checked);
        eventDescriptor.stopPropagation();
    }

    handleClick(eventDescriptor) {
        eventDescriptor.stopPropagation();
    }

    render() {
        return (
            <td
                className	= "col-md-1"
                onClick		= { e => this.handleClick(e) }
            >
                <input	onChange	= { e => this.handleCheckBoxClick(e) }
                          id  		= "sub_checkbox"
                          type		= "checkbox"
                          checked		= { this.isChecked() }
                />
            </td>
        );
    }
}

