import * as React from 'react'

export class PlayerListHeader extends React.Component<{}, {}> {
	render() {
		return (
			<thead>
			<tr>
				<th scope="col">Name</th>
				<th scope="col">Form</th>
			</tr>
			</thead>
		)
	}
}