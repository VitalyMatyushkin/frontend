/**
 * Created by vitaly on 11.12.17.
 */

export class SchoolUnionActions {
	static getTournaments(page, schoolUnionId) {
		const binding = page.getDefaultBinding();
		(window as any).Server.publicTournaments.get({schoolUnionId})
			.then(tournaments => {
				const tournamentsWithLink = tournaments.filter(tournament => typeof tournament.link !== 'undefined');
				binding.sub('schoolHomePage')
					.atomically()
					.set('tournamentsIsSync', true)
					.set('tournaments', tournamentsWithLink)
					.set('tournamentsShow', tournamentsWithLink.length > 0)
					.commit();
			});
	}
}