var RegisterModal = require('module/pages/register'),
	RouterView = require('module/core/router'),
	ApplicationView,
	ApplicationWithCtx,
	Ctx;

Ctx = Morearty.createContext({
	nowShowing: 'default',
	section1: {
		modalIsOpen: false
	},
	routing: {
		current_page: 'main'
	}
});

ApplicationView = React.createClass({
	mixins: [Morearty.Mixin],
	toggleModal: function() {
		var self = this,
			binding = this.getDefaultBinding(),
			section1 = binding.sub('section1');

		section1.set('modalIsOpen', !section1.get('modalIsOpen'));
	},
	render: function() {
		var binding = this.getDefaultBinding();

		return (
			<div>
				<button onClick={this.toggleModal}>Show register form</button>
				<div><RouterView routes={ binding.sub('routing') } binding={binding} /></div>
				<RegisterModal binding={ binding.sub('section1') } onRequestClose={this.toggleModal}/>
			</div>
		);
	}
});

// isOpen={this.state.modalIsOpen}
//var Bootstrap = ctx.bootstrap(App);

ApplicationWithCtx = Ctx.bootstrap(ApplicationView);

React.render(
	<ApplicationWithCtx />,
	document.getElementById('jsMainLayout')
);