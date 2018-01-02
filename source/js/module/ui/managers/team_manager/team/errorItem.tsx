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
                <th scope="row">
                    { this.props.number }
                </th>
                <td className="bTeamErrorItem col-md-8">
                    {this.props.errorText}
                </td>
                <td className="col-md-4">
                </td>
            </tr>
        );
    }
}