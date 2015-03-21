var ProcessingView;

ProcessingView = React.createClass({
    mixins: [Morearty.Mixin],
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
			isSync = binding.get('sync'),
			count = binding.get('models') && binding.get('models').count();

        return <div className='eInvites_processing'>
			{!isSync ? <span>Loading...</span> : <span>{!count ? 'You don\'t have invites' : null}</span>}
		</div>
    }
});


module.exports = ProcessingView;
