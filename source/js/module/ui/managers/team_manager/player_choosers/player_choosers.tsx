import * as React from 'react'
import * as DefaultPlayerChooser from "module/ui/managers/team_manager/default_player_chooser/default_player_chooser"
import * as ChildrenBookingBookedChildrenPlayerChooser from "module/ui/managers/team_manager/children_booking_booked_children_player_chooser/booked_children_player_chooser"
import * as ChildrenBookingAllChildrenPlayerChooser from 'module/ui/managers/team_manager/children_booking_all_children_player_chooser/all_children_player_chooser'
import * as classNames from "classnames"
import { PlayerChoosersTabsModel } from "module/ui/managers/models/player_choosers_tabs_model/player_choosers_tabs_model"
import { TabTypes } from "module/ui/managers/models/player_choosers_tabs_model/tab_types"
import { PlayerChooserTabs } from "module/ui/managers/team_manager/player_choosers/player_chooser_tabs";

export interface PlayerChoosersProps {
	playerChoosersTabsModel:    PlayerChoosersTabsModel,
	selectedTabId:              string
	students:					any[]
	handleChangeSearchText:		(text: string) => void
	handleClickStudent:			(studentId: string) => void
	handleClickAddTeamButton:	() => void
	handleClickTab:             (text: string) => void
	isSearch:					boolean
	isAddTeamButtonBlocked:		boolean
}

export class PlayerChoosers extends React.Component<PlayerChoosersProps, {}> {
	componentWillMount() {
		this.setState({
			selectedTabId: this.props.playerChoosersTabsModel.tabs[0].id
		});
	}

	getPlayerChooserWrapperStyleByTabId(tabId: string) {
		const style = classNames({
			ePlayerChoosers_playerChooserWrapper:   true,
			mDisable:                               this.props.selectedTabId !== tabId
		});

		return style;
	}

	handleClickTab(tabId) {
		this.setState({
			selectedTabId: tabId
		});
	}

	renderDefaultPlayerChooser() {
		return (
			<DefaultPlayerChooser
				students					= { this.props.students }
				handleChangeSearchText		= { (text) => this.props.handleChangeSearchText(text) }
				handleClickStudent			= { (studentId) => this.props.handleClickStudent(studentId) }
				handleClickAddTeamButton	= { () => this.props.handleClickAddTeamButton() }
				isSearch					= { this.props.isSearch }
				isAddTeamButtonBlocked		= { this.props.isAddTeamButtonBlocked }
			/>
		);
	}

	renderAllChildrenPlayerChooser() {
		return (
			<ChildrenBookingAllChildrenPlayerChooser
				students					= { this.props.students }
				handleChangeSearchText		= { (text) => this.props.handleChangeSearchText(text) }
				handleClickStudent			= { (studentId) => this.props.handleClickStudent(studentId) }
				handleClickAddTeamButton	= { () => this.props.handleClickAddTeamButton() }
				isSearch					= { this.props.isSearch }
				isAddTeamButtonBlocked		= { this.props.isAddTeamButtonBlocked }
			/>
		);
	}

	renderBookedChildrenPlayerChooser() {
		return (
			<ChildrenBookingBookedChildrenPlayerChooser
				students					= { this.props.students }
				handleChangeSearchText		= { (text) => this.props.handleChangeSearchText(text) }
				handleClickStudent			= { (studentId) => this.props.handleClickStudent(studentId) }
				handleClickAddTeamButton	= { () => this.props.handleClickAddTeamButton() }
				isSearch					= { this.props.isSearch }
				isAddTeamButtonBlocked		= { this.props.isAddTeamButtonBlocked }
			/>
		);
	}

	renderPlayerChooserByType(tabType: TabTypes) {
		let playerChooser = null;

		switch (tabType) {
			case TabTypes.DefaultTab: {
				playerChooser = this.renderDefaultPlayerChooser();
				break;
			}
			case TabTypes.ChildrenBookingAllChildrenTab: {
				playerChooser = this.renderAllChildrenPlayerChooser();
				break;
			}
			case TabTypes.ChildrenBookingBookedChildrenTab: {
				playerChooser = this.renderBookedChildrenPlayerChooser();
				break;
			}
		}

		return playerChooser;
	}

	renderPlayerChooserTabs() {
		let playerChooserTabs = null;

		if(this.props.playerChoosersTabsModel.isShowTabs) {
			playerChooserTabs = (
				<PlayerChooserTabs
					handleClick     = { (tabId) => this.props.handleClickTab(tabId) }
					tabs            = { this.props.playerChoosersTabsModel.tabs }
					selectedTabId   = { this.props.selectedTabId }
				/>
			);
		}

		return playerChooserTabs
	}

	renderPlayerChoosers() {
		return this.props.playerChoosersTabsModel.tabs.map(
			tab =>
				<div className = { this.getPlayerChooserWrapperStyleByTabId(tab.id) } >
					{ this.renderPlayerChooserByType(tab.type) }
				</div>
		);
	}

	render() {
		return (
			<div className='bPlayerChoosers'>
				{ this.renderPlayerChooserTabs() }
				{ this.renderPlayerChoosers() }
			</div>
		)
	}
}