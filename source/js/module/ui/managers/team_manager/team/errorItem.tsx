import * as React from 'react';
import '../../../../../../styles/ui/b_team_error_item.scss';


export interface ErrorItemProps {
    errorText: string
    number?: number
}

export class ErrorItem extends React.Component<ErrorItemProps, {}> {
    render() {
        return (
            <tr>
                <td className="col-md-8" style={{position: 'relative', height: '50px'}}>
                    <div className='bTeamErrorItem'>
	                    {this.props.errorText}
                    </div>
                </td>
                <td className="col-md-4">
                </td>
            </tr>
        );
    }
}