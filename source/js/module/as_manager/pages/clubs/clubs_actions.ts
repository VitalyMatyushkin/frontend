import * as Bpromise from "bluebird";

import {ServiceList} from "module/core/service_list/service_list";
import {Sport} from "module/models/sport/sport";
import {Club} from "module/models/club/club";

export const ClubsActions = {
	getSportsService(schoolId: string): (sportName: string) => Bpromise<Sport[]> {
		return (sportName) => {
			const filter = {
				filter: {
					where: {
						name: {
							like: sportName,
							options: 'i'
						},
						players: 'INDIVIDUAL',
						'points.display': 'PRESENCE_ONLY',
						isAllSports: true
					},
					limit: 50,
					order:'name ASC'
				}
			};

			return (window.Server as ServiceList).schoolSports.get({schoolId: schoolId}, filter);
		};
	},
	getClub(schoolId: string, clubId: string): Bpromise<Club> {
		return ((window.Server as ServiceList) as ServiceList).schoolClub.get(
			{
				schoolId:	schoolId,
				clubId:		clubId
			}
		)
	},
	activateClub(schoolId: string, clubId: string): Bpromise<void> {
		return (window.Server as ServiceList).schoolClubActivate.post(
			{
				schoolId:	schoolId,
				clubId:		clubId
			},
			{}
		);
	},
	removeParticipant(schoolId: string, clubId: string, participantId: string): Bpromise<void> {
		return (window.Server as ServiceList).schoolClubParticipant.delete(
			{
				schoolId:		schoolId,
				clubId:			clubId,
				participantId:	participantId
			}
		);
	},
	addParticipant(schoolId: string, clubId: string, participant: object): Bpromise<any> {
		return (window.Server as ServiceList).schoolClubParticipants.post(
			{
				schoolId:	schoolId,
				clubId:		clubId
			},
			participant
		);
	},
	getVenueService(schoolId: string): (venue: string) => Bpromise<any> {
		return (venue) => {
			const filter = {
				filter: {
					where: {
						text: {
							like: venue,
							options: 'i'
						}
					},
					limit: 50,
					order:'name ASC'
				}
			};

			return (window.Server as ServiceList).schoolPlaces.get({schoolId: schoolId}, filter);
		};
	}
};