/**
 * Created by vitaly on 05.12.17.
 */

import * as Timezone from 'moment-timezone';
import * as React    from 'react';
import {Tournament}	 from 'module/as_manager/pages/tournaments/tournament';

interface TournamentItemProps {
	tournament: Tournament;
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
					{Timezone.tz(this.props.tournament.startTime, (window as any).timezone).format('DD.MM.YY HH:mm')} -
					{Timezone.tz(this.props.tournament.endTime, (window as any).timezone).format('DD.MM.YY HH:mm')}
				</div>
			</div>
	);
	}
}
