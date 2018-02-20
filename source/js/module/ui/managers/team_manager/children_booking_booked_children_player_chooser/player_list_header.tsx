import * as React from 'react'

export class PlayerListHeader extends React.Component<{}, {}> {
	render() {
		return (
			<thead>
			<tr>
				<th scope="col">Student name</th>
				<th scope="col">Form</th>
				<th scope="col">Parent name</th>
				<th scope="col">Invitation status</th>
			</tr>
			</thead>
		)
	}
}