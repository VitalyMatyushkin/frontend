import * as React from 'react'
import { PlayerChoosersTabModel } from "module/ui/managers/models/player_choosers_tabs_model/player_choosers_tab_model"
import * as classNames from "classnames"

export interface PlayerChooserTabProps {
	handleClick:    (tabId: string) => void
	tab:            PlayerChoosersTabModel
	isSelected:     boolean
}

export class PlayerChooserTab extends React.Component<PlayerChooserTabProps, {}> {
	render() {
		const style = classNames({
			bPlayerChooserTab:  true,
			mSelected:          this.props.isSelected
		});

		return (
			<div
				className   = { style }
				onClick     = { tab => this.props.handleClick(this.props.tab.id) }
			>
				{ this.props.tab.text }
			</div>
		)
	}
}