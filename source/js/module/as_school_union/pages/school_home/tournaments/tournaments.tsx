/**
 * Created by vitaly on 05.12.17.
 */
const SchoolUnionTournamentsStyle = require('../../../../../../styles/ui/b_school_union_tournaments.scss');

import * as React    	from 'react';
import * as classNames	from 'classnames';
import {TournamentItem} from './tournament_item';
import {Tournament} 	from 'module/as_manager/pages/tournaments/tournament';

interface TournamentItemProps {
	tournaments: Tournament[]
}

interface TournamentItemState {
	currentPhoto: 	number,
	inputText: 		string
}

export class Tournaments extends React.Component<TournamentItemProps, TournamentItemState> {
	readonly TOURNAMENT_BANNER_WIDTH = 290;
	readonly COUNT_PHOTOS_FOR_PAGING = 4;
	readonly LAYOUT_WIDTH = 1160;

	constructor(props) {
		super(props);
		this.state = {
			currentPhoto: 	0,
			inputText: 		''
		};
	}

	renderTournamentList() {
		const tournaments = this.props.tournaments;
		return tournaments.map((tournament, index) => {
			return (
				<TournamentItem
					key			= { index }
					tournament	= { tournament }
				/>
			);
		});
	}

	onLeft(): void {
		let index = this.state.currentPhoto;
		index = index <= 0 ? 0 : index - this.COUNT_PHOTOS_FOR_PAGING;

		this.setState({currentPhoto: index});
	}
	onRight(): void {
		const countPhotos = this.props.tournaments.length;

		let index = this.state.currentPhoto;
		index = index >= countPhotos - Math.floor(this.LAYOUT_WIDTH/this.TOURNAMENT_BANNER_WIDTH) ? index
			: index + this.COUNT_PHOTOS_FOR_PAGING;

		this.setState({currentPhoto: index});
	}

	render() {
		const 	countPhotos 	= this.props.tournaments.length,
				widthStrip 		= countPhotos *  this.TOURNAMENT_BANNER_WIDTH,
				offset 			= this.state.currentPhoto * this.TOURNAMENT_BANNER_WIDTH,
				margin 			= offset +  this.LAYOUT_WIDTH <= widthStrip || offset === 0 ? -offset
					:  this.LAYOUT_WIDTH - widthStrip,
				style 			= {width:widthStrip, marginLeft:margin},
				lBtnClasses = classNames({
					eArrow:true,
					mLeft:true,
					mHidden: offset === 0
				}),
				rBtnClasses = classNames({
					eArrow:true,
					mRight:true,
					mHidden: offset >= countPhotos *  this.TOURNAMENT_BANNER_WIDTH -  this.LAYOUT_WIDTH
				});
		return (
			<div className="bSchoolUnionTournaments">
				<h1 className="eSchoolUnionTournaments_title">Tournaments</h1>
				<div className="eSchoolUnionTournaments_btnWrapper">
					<div className="eSchoolUnionTournaments_bodyWrapper">
						<div className="eSchoolUnionTournaments_body" style={style}>
							{this.renderTournamentList()}
						</div>
						<div className={lBtnClasses} onClick={() => this.onLeft()} />
						<div className={rBtnClasses} onClick={() => this.onRight()} />
					</div>
				</div>
			</div>
		);
	}
}