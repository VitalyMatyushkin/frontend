import * as React from 'react'

export interface ConfirmMessageProps {
	email: string,
	phone: string
}

export class ConfirmMessage extends React.Component<ConfirmMessageProps, {}> {
	render() {
		return (
			<div>
				<h2> Please Read Carefully! </h2>

				<p className="eSimpleAlert_text">We use reasonable measures to check the identity of each User
					registering with Squad In Touch. We require
					that each User provides a valid mobile phone number and email address so we check their validity via
					confirmation codes.</p>

				<p className="eSimpleAlert_text">The Mobile phone and email address the User has verified is as
					follows:
					<p className="eSimpleAlert_mail">{this.props.email}</p>
					<p className="eSimpleAlert_phone">{this.props.phone}</p>
				</p>

				<p className="eSimpleAlert_text">Notwithstanding mobile phone and email address verification, it is the
					responsibility of the School to
					satisfy that the User’s identity has been verified prior to accepting a role request.
					If you are not completely satisfied the User is genuine, please complete additional checks before
					granting
					them any permissions in the system or simply decline a role request.</p>
			</div>
		);
	}
};