/**
 * Created by Anatoly on 30.08.2016.
 */
import * as React from 'react';
import {ChallengeModel} from 'module/ui/challenges/challenge_model';
import * as classNames from 'classnames';
import {Event} from 'module/as_manager/pages/events/events';

interface GameTypeProps {
	event: 				Event
	activeSchoolId?: 	string
}

export class GameType extends React.Component<GameTypeProps , {}> {
	render() {
		const 	event 			= this.props.event,
				activeSchoolId 	= this.props.activeSchoolId,
				model 			= new ChallengeModel(event, activeSchoolId, undefined, undefined),
				classResults 	= classNames({
					eChallenge_results:true,
					mDone: model.isFinished
				}),
				firstName 		= model.rivals[0].value,
				secondName 		= model.rivals[1].value;


		if(firstName === 'individual'){
			return (
				<div className="eChallenge_in">
					{"Individual Game"}
				</div>
			)
		}else {
			return (
				<div className="eChallenge_in">
					<div className="eChallenge_rivalName">
						{firstName}
					</div>
					<div className={classResults}>
						{model.score}
					</div>
					<div className="eChallenge_rivalName">
						{secondName}
					</div>
				</div>
			)
		}
	}
}
