import * as React from 'react'
import { PlayerChoosersTabModel } from "module/ui/managers/models/player_choosers_tabs_model/player_choosers_tab_model"
import { PlayerChooserTab } from "module/ui/managers/team_manager/player_choosers/player_chooser_tab"

export interface PlayerChooserTabsProps {
	handleClick:    (tabId: string) => void
	selectedTabId:  string
	tabs:           PlayerChoosersTabModel[]
}

export class PlayerChooserTabs extends React.Component<PlayerChooserTabsProps, {}> {
	renderTabs() {
		return this.props.tabs.map(tab =>
			<PlayerChooserTab
				handleClick = { tabId => this.props.handleClick(tabId) }
				tab         = { tab }
				isSelected  = { tab.id === this.props.selectedTabId }
			/>
		);
	}

	render() {
		return (
			<div className = 'bPlayerChooserTabs'>
				{ this.renderTabs() }
			</div>
		)
	}
}