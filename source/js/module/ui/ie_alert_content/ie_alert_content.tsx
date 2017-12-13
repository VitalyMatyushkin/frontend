import * as React from 'react';

export interface IeAlertContentProps {
	handleLinkClick: (event: any) => void,
}

export function IeAlertContent(props: IeAlertContentProps) {
	return (
		<div className='bIEAlertContent'>
			<p>
				Whilst we aim to support all modern browsers we cannot guarantee our system to be
				fully accessible and work correctly
				if you are using Internet Explorer 11 and below.
			</p>
			<p>
				{'To find more about our browser support and devices we use to test Squad In Touch please '}
				<a
					href        = { '/#supported_browsers' }
					onClick     = { event => props.handleLinkClick(event) }
				    className   = 'eIEAlertContent_link'
				>
					follow the link
				</a>
			</p>
		</div>
	) ;
}