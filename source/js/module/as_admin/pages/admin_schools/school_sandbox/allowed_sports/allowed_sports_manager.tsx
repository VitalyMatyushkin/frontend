import * as React from 'react';
import * as BPromise from 'bluebird';
import {AdminServiceList} from "module/core/service_list/admin_service_list";

import {Sport} from "module/models/sport/sport";

import * as Loader from "module/ui/loader";
import {Button} from "module/ui/button/button";
import {SportListManager} from "./sport_list_manager";

import "styles/pages/admin_allowed_sports/b_allowed_sports_manager.scss";

interface AllowedSportsManagerProps {
	schoolId: string
}

interface AllowedSportsManagerState {
	isDataLoaded: 		boolean,
	allowedSports: 		Sport[],
	allSportsFiltered: 	Sport[]
}

export class AllowedSportsManager extends React.Component<AllowedSportsManagerProps, AllowedSportsManagerState> {
	constructor(props) {
		super(props);
		this.state = {
			isDataLoaded: 		false,
			allowedSports: 		[],
			allSportsFiltered: 	[]
		};
	}
	componentWillMount(){
		const allowedSportIdsPromise = (window.Server as AdminServiceList).schoolAllowedSports
			.get({ schoolId: this.props.schoolId } );

		const allSportsPromise = (window.Server as AdminServiceList).schoolSports
			.get(
				{ schoolId: this.props.schoolId },
				{ filter: { limit: 100 } }
				);

		BPromise.all([allowedSportIdsPromise, allSportsPromise])
			.then( ([allowedSportIds, allSports]) => {
			//Get sports without allowed sports
			const allSportsFiltered = allSports.filter(sport => allowedSportIds.every(allowedSportId => {
				return allowedSportId !== sport.id;
			}));

			//Get allowed sports info such as name etc.
			const allowedSports = allSports.filter(sport => allowedSportIds.some(allowedSportId => {
				return allowedSportId === sport.id;
			}));

			this.setState({
				allowedSports: 		allowedSports,
				allSportsFiltered: 	allSportsFiltered,
				isDataLoaded: 		true
			});
		});
	}
	onClickRowAllSportsManager(index: number): void {
		const 	allowedSports 	= this.state.allowedSports,
				allSports 		= this.state.allSportsFiltered;
		
		allowedSports.push(this.state.allSportsFiltered[index]);
		allSports.splice(index, 1);
		
		this.setState({
			allowedSports: 		allowedSports,
			allSportsFiltered: 	allSports
		});
	}
	onClickRowAllowedSportsManager(index: number): void {
		const 	allowedSports 	= this.state.allowedSports,
				allSports 		= this.state.allSportsFiltered;
		
		allSports.unshift(this.state.allowedSports[index]);
		allowedSports.splice(index, 1);
		
		this.setState({
			allowedSports: 		allowedSports,
			allSportsFiltered: 	allSports
		});
	}
	onClickButtonCancel(): void {
		window.history.back();
	}
	onClickButtonSave(): void {
		const allowedSportIds = this.state.allowedSports.map(allowedSport => allowedSport.id);

		(window.Server as AdminServiceList).schoolAllowedSports.put(
			{ schoolId: this.props.schoolId },
			{ sportIds: allowedSportIds })
		.then(
			sportIds => {
			(window as any).simpleAlert(
				'Changed successfully',
				'Ok',
				() => {}
			);
		},
			err => {
				(window as any).simpleAlert(
					'Error (see in console)',
					'Ok',
					() => {}
				);
				console.error(err.message);
			}
		);
		

	}
	render(){
		if (!this.state.isDataLoaded) {
			return (
				<Loader condition = { true } />
			);
		} else {
			return (
				<div>
					<div className="bAllowedSportsManager">
						<SportListManager
							sportList 	= { this.state.allowedSports }
							onClickRow 	= { (index) => this.onClickRowAllowedSportsManager(index) }
							title 		= { "Allowed sports" }
						/>
						<SportListManager
							onClickRow 	= { (index) => this.onClickRowAllSportsManager(index) }
							sportList 	= { this.state.allSportsFiltered }
							title 		= { "All sports" }
						/>
					</div>
					<Button
						text 				= "Cancel"
						onClick 			= { () => this.onClickButtonCancel() }
						extraStyleClasses 	= "mCancel mMarginRight"
					/>
					<Button
						text 	= "Save"
						onClick = { () => this.onClickButtonSave() }
					/>
				</div>
			);
		}
	}
}