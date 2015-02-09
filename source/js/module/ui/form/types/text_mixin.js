var TextMixin = {
	render: function () {
		var self = this;

		return (
			<div className="eForm_fieldInput">
				<input type="text" onBlur={self.setValue} onChange={self.changeValue} />
			</div>
		)
	}
};

module.exports = TextMixin;