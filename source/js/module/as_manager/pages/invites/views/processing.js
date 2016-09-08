const 	Morearty	= require('morearty'),
		Loader 		= require('module/ui/loader'),

	React 		= require('react');

/** Seems like it is stub which show 'Loading..' or 'You dont have invites' according state
 */
const ProcessingView = React.createClass({
    mixins: [Morearty.Mixin],
    render: function() {
        const 	self 	= this,
				binding = self.getDefaultBinding(),
				isSync 	= binding.get('sync'),
				count 	= binding.get('models') && binding.get('models').count();

        return <div className='eInvites_processing'>
			<Loader condition={!isSync} />
			{isSync && !count? <span>You don\'t have invites</span> : null}
		</div>
    }
});


module.exports = ProcessingView;
