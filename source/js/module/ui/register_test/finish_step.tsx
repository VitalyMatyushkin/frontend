import * as React from 'react'
import 'styles/pages/register/b_register_test.scss';

interface FinishStepProps {
	handleClickBack?: () => void
}

export class FinishStep extends React.Component<FinishStepProps, {}> {
	render () {
		return (
			<div>Request is sent. Thank you for joining Squad In Touch.</div>
		);
	}
}