import * as React from 'react'
import * as Morearty from 'morearty'
import * as TypeMixin from'module/ui/form/types/type_mixin'

import Textarea from "react-textarea-autosize";

const MIN_ROWS = 10;

export const TypeTextArea = (React as any).createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	textArea: undefined,
	cursorPosition: 0,
	componentDidUpdate() {
		if(this.cursorPosition >= 0){
			this.textArea.setSelectionRange(this.cursorPosition, this.cursorPosition);
		}
	},
	handleChange(event) {
		this.cursorPosition = event.target.selectionStart;
		this.changeValue(event.target.value);
	},
	render() {
		return (
			<Textarea
				inputRef={textArea => (this.textArea = textArea)}
				minRows={MIN_ROWS}
				onChange={this.handleChange}
				value={this.getDefaultBinding().get('value')}
			/>
		)
	}
});