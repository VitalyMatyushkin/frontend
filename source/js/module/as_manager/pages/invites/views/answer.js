var AnswerView;

AnswerView = React.createClass({
    mixins: [Morearty.Mixin],
	onClickYes: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			isDecline = binding.get('type') === 'decline',
			rootBinding = self.getMoreartyContext().getBinding().toJS();

		console.log(rootBinding);
	},
	onClickNo: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			isDecline = binding.get('type') === 'decline',
			rootBinding = self.getMoreartyContext().getBinding().toJS();

		console.log(rootBinding);
	},
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
			isDecline = binding.get('type') === 'decline',
			message = isDecline ? 'Are you sure you want to decline?' : 'Are you sure you want to cancel?';

        return <div className='eInvites_answer'>
			<span>{message}</span>
			<div className="eInvite_buttons">
				<span className="bButton" onClick={self.onClickYes.bind(null)}>Yes</span>
				<span className="bButton mRed" onClick={self.onClickNo.bind(null)}>No</span>
			</div>
		</div>
    }
});


module.exports = AnswerView;
