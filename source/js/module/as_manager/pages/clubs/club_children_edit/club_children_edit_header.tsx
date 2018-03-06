import * as React from 'react'

import {ClubChildrenEditHelper} from 'module/as_manager/pages/clubs/club_children_edit/club_children_edit_helper'

import 'styles/pages/b_club_children_manager_wrapper.scss'

export class ClubsChildrenEditHeader extends React.Component<{}, {}> {
	render() {
		return (
			<div className='eClubChildrenManagerWrapper_header'>
				<h2>
					Edit children
				</h2>
				{
					ClubChildrenEditHelper.TEXT.map((text, index) =>
						<p key={`cub_children_edit_header_text_${index}`}>{text}</p>
					)
				}
			</div>
		);
	}
};