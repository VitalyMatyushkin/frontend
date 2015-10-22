var HeadView = require('module/as_parents/head'),
	CenterView = require('module/as_parents/center'),
	ApplicationView;

ApplicationView = React.createClass({
	mixins: [Morearty.Mixin],
    componentDidMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        document.addEventListener('visibilitychange',function(){
                Helpers.cookie.remove('authorizationInfo');
                binding.sub('authorizationInfo').clear();
                document.location.hash = '#login';
                if(document.visibilityState ==='hidden'){
                    document.location.reload(true);
                }
            }
        );
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div>
				<HeadView binding={binding} />
				<CenterView binding={binding} />
			</div>
		);
	}
});


module.exports = ApplicationView;