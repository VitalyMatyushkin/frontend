import * as React from 'react'

import {PlayersList} from 'module/ui/managers/team_manager/default_player_chooser/players_list';
import {PlayerSearchBox} from 'module/ui/managers/team_manager/player_chooser_components/player_search_box';
import {AddPlayerTeamButton} from 'module/ui/managers/team_manager/player_chooser_components/add_player_team_button';

import { If } from 'module/ui/if/if';
import * as Loader from 'module/ui/loader';
import {DefaultStudent} from "module/ui/managers/models/default_student";

export interface DefaultPlayerChooserProps {
	students: DefaultStudent[],
	handleChangeSearchText: (text: string) => void,
	handleClickStudent: (studentId: string) => void,
	handleClickAddTeamButton: () => void,
	isSearch: boolean,
	isAddTeamButtonBlocked: boolean
}

export class DefaultPlayerChooser extends React.Component<DefaultPlayerChooserProps, {}> {
	render() {
		return (
			<div>
				<div className="bPlayerChooser">
					<PlayerSearchBox handleChangeSearchText={this.props.handleChangeSearchText}/>
					<If condition={this.props.isSearch}>
						<Loader condition={true}/>
					</If>
					<If condition={!this.props.isSearch}>
						<PlayersList
							players={this.props.students}
							handleClickStudent={this.props.handleClickStudent}
						/>
					</If>
				</div>
				<AddPlayerTeamButton
					isAddTeamButtonBlocked={this.props.isAddTeamButtonBlocked}
					handleClickAddTeamButton={this.props.handleClickAddTeamButton}
				/>
			</div>
		);
	}
};