import * as React from 'react';
import '../../../../../../styles/ui/b_team_error_item.scss';


export interface ErrorItemProps {
    errorText: string
    number?: number
}

export class ErrorItem extends React.Component<ErrorItemProps, {}> {
    render() {
        return (
            <tr className='NoHover'>
                <td className="col-md-1" style={{position: 'relative', height: '50px'}}>
                    <div className='bTeamErrorItem'>
	                    {this.props.errorText}
                    </div>
                </td>
            </tr>
        );
    }
}