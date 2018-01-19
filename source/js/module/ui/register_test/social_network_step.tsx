import * as React from 'react'
import 'styles/pages/register/b_register_test.scss';

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
			<div>
				<div>
					<button className="bSocialNetwork_button bFacebook" onClick={() => this.props.handleClickSocialButton(SOCIAL_NETWORK_TYPE.FACEBOOK)}>Facebook</button>
					<button className="bSocialNetwork_button bGoogle" onClick={() => this.props.handleClickSocialButton(SOCIAL_NETWORK_TYPE.GOOGLE)}>Google+</button>
					<button className="bSocialNetwork_button bSquad" onClick={() => this.props.handleClickSocialButton(SOCIAL_NETWORK_TYPE.SQUADINTOUCH)}>Create a new account with SIT using email</button>
				</div>
				<button className="bButton mCancel" onClick={() => this.props.handleClickBack()}>Back</button>
			</div>
		);
	}
}