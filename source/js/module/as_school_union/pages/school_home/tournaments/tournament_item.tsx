/**
 * Created by vitaly on 05.12.17.
 */

import {DateHelper}  from 'module/helpers/date_helper';
import * as React    from 'react';
import {Tournament}	 from 'module/as_manager/pages/tournaments/tournament';

interface TournamentItemProps {
	tournament: Tournament
	region: string
}

export class TournamentItem extends React.Component<TournamentItemProps> {
	onClick(): void {
		(window as any).open(this.props.tournament.link);
	}

	render() {
		const picUrl = typeof this.props.tournament.photos[0].picUrl !== 'undefined' ?
			this.props.tournament.photos[0].picUrl : 'images/logo.svg';

		return (
			<div className="bPublicSchoolUnionTournamentItem" onClick={() => this.onClick()}>
				<div className="ePublicSchoolUnionTournamentItem_tournamentPictureWrapper">
					<div className="ePublicSchoolUnionTournamenItem_tournamenPicture">
						<img
							src		= {picUrl}
						/>
					</div>
				</div>
				<div className="ePublicSchoolUnionTournamenItem_tournamenName">
					{this.props.tournament.name}
				</div>
				<div className="ePublicSchoolUnionTournamenItem_tournamenDate">
					{DateHelper.getFormatDateTimeFromISOByRegion(this.props.tournament.startTime, this.props.region)} -
					{DateHelper.getFormatDateTimeFromISOByRegion(this.props.tournament.endTime, this.props.region)}
				</div>
			</div>
	);
	}
}
