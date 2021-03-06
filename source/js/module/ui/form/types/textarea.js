/**
 * Created by bridark on 04/08/15.
 */
const 	TypeMixin	= require('module/ui/form/types/type_mixin'),
		Morearty	= require('morearty'),
		React		= require('react');

import Textarea from "react-textarea-autosize";

const MIN_ROWS = 3;

const TypeTextArea = React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	textArea: undefined,
	cursorPosition: 0,
	componentDidUpdate: function () {
		if(this.cursorPosition >= 0){
			this.textArea.setSelectionRange(this.cursorPosition, this.cursorPosition);
		}
	},
	handleChange: function(event) {
		this.cursorPosition = event.target.selectionStart;
		this.changeValue(event.target.value);
	},
	render: function () {
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

module.exports = TypeTextArea;