import * as React from 'react';
import * as Reactmarkdown from 'react-markdown';
import {Button} from 'module/ui/button/button';

import * as TweetEmbed from 'module/ui/tweet_embed/tweet_embed';

interface MarkdownState {
	textSource: 		string,
	textDestination: 	string
}

export class Markdown extends React.Component<{}, MarkdownState>{
	constructor(props) {
		super(props);
		this.state = {
			textSource: 		'',
			textDestination: 	''
		};
	}

	onChange(event): void {
		this.setState({ textSource: event.target.value });
	}

	onClick(): void{
		this.setState({ textDestination: this.state.textSource });
	}
	// TODO: Write separate renders for Twitter and YouTube and transfer it in Reactmarkdown:
	// renderers = {{link: link}}
	/*function getCoreProps(props) {
			return props['data-sourcepos'] ? {'data-sourcepos': props['data-sourcepos']} : {}
		}
		const link = (props) => {
			switch(true){
				case (Array.isArray(props.children) && props.children[0].indexOf('twitter') !== -1):
					return <TweetEmbed link = { props.children[0] }>{ props.children }</TweetEmbed>;
				default:
					return React.createElement('a', getCoreProps(props), props.children)
			}
		};*/
	render() {

		return (
			<div>
				<textarea
					onChange 	= { (event) => this.onChange(event) }
					value 		= { this.state.textSource }
				/>
				<div>
					<Button
						text 				= { "Render it" }
						onClick 			= { () => this.onClick() }
						extraStyleClasses 	= { 'eMarkdown' }
					/>
				</div>
				<Reactmarkdown
					escapeHtml 	= { true }
					source 		= { this.state.textDestination }
				/>
			</div>
		);
	}
}