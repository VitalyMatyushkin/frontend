import * as React from 'react';

export interface PlayerIsCaptainColumnProps {
    isChecked: boolean
    handleClickPlayerIsCaptain:	(isChecked: boolean) => void
}

export class PlayerIsCaptainColumn extends React.Component<PlayerIsCaptainColumnProps, {}> {
    isChecked(): boolean {
        return typeof this.props.isChecked !== 'undefined' ? this.props.isChecked : false;
    }

    handleCheckBoxClick(eventDescriptor: React.FormEvent<HTMLInputElement>) {
        // sorry for that typecasting. I'm not ready to dig deeper right now
        // but there is no .checked property in this object
        this.props.handleClickPlayerIsCaptain((eventDescriptor.target as any).checked);
        eventDescriptor.stopPropagation();
    }

    render() {
        return (
            <td className="col-md-1">
                <input	onChange	= { e => this.handleCheckBoxClick(e) }
                          id 	    = "captain_checkbox"
                          type		= "checkbox"
                          checked	= { this.isChecked() }
                />
            </td>
        );
    }
}