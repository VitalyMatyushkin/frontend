var ResultsPage,
	SVG = require('module/ui/svg');

ResultsPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div>

				<div className="bChallengeDate">
					<div className="eChallengeDate_date">Sa 22 May 2015</div>
					<div className="eChallengeDate_list">

						<div className="bChallenge">
							<div className="eChallenge_in">
								<div className="eChallenge_rivalName">
									<span>BOYS U14C</span></div>

								<div className="eChallenge_rivalInfo">
									<div className="eChallenge_hours">Hockey</div>
									<div className="eChallenge_results mDone">3 : 7</div>
									<div className="eChallenge_info">inter-schools</div>
								</div>
								<div className="eChallenge_rivalName">
									<span>BOYS U14B</span></div>
							</div>
						</div>

						<div className="bChallenge">
							<div className="eChallenge_in">
								<div className="eChallenge_rivalName">
									<span>BOYS U2A</span></div>

								<div className="eChallenge_rivalInfo">
									<div className="eChallenge_hours">Cricket</div>
									<div className="eChallenge_results mDone">5 : 7</div>
									<div className="eChallenge_info">inter-schools</div>
								</div>
								<div className="eChallenge_rivalName">
									<span>BOYS U4A</span></div>
							</div>
						</div>

					</div>
				</div>

			</div>
		)
	}
});


module.exports = ResultsPage;
