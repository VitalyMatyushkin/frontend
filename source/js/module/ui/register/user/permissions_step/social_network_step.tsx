import * as React from 'react';

interface SocialNetworkStepProps {
	handleClickSocialButton: (type: string) => void
	handleClickBack: () => void
}

export const SOCIAL_NETWORK_TYPE = {
	FACEBOOK:       'FACEBOOK',
	GOOGLE:         'GOOGLE',
	SQUADINTOUCH:   'SQUADINTOUCH'
};

export class SocialNetworkStep extends React.Component<SocialNetworkStepProps, {}> {
	render() {
		return (
			<div className="bRegistrationMain">
				<div>
					<button className="bSocialNetwork_button bFacebook" onClick={() => this.props.handleClickSocialButton(SOCIAL_NETWORK_TYPE.FACEBOOK)}>Facebook</button>
					<button className="bSocialNetwork_button bGoogle" onClick={() => this.props.handleClickSocialButton(SOCIAL_NETWORK_TYPE.GOOGLE)}>Google+</button>
					<button className="bSocialNetwork_button bSquad" onClick={() => this.props.handleClickSocialButton(SOCIAL_NETWORK_TYPE.SQUADINTOUCH)}>Create a new account with SIT using email</button>
				</div>
				<div className="bRegistrationControlButtons">
					<button className="bButton mCancel" onClick={() => this.props.handleClickBack()}>Back</button>
				</div>
			</div>
		);
	}
}