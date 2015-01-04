var default_state = require('module/states/default'),
	RegisterModal = require('module/pages/register'),
	ApplicationView,
	ApplicationCtx,
	Ctx;

Ctx = Morearty.createContext({
	nowShowing: 'default'
});

ApplicationView = React.createClass({
	//mixins: [Morearty.Mixin],
	getInitialState: function() {
		var self = this;

		return { modalIsOpen: false };
	},
	toggleModal: function() {
		var self = this;

		self.setState({modalIsOpen: !this.state.modalIsOpen});
	},    /*
	componentDidMount: function() {
		var binding = this.getDefaultBinding();

		Router({
			'/': binding.set.bind(binding, 'nowShowing', 'default'),
			'/me': binding.set.bind(binding, 'nowShowing', 'me')
		}).init();
	},      */
	render: function() {
		//var binding = this.getDefaultBinding();

		return (
			<div>
				<button onClick={this.toggleModal}>Show register form</button>
				<RegisterModal isOpen={this.state.modalIsOpen} onRequestClose={this.toggleModal}/>
			</div>
		);
	}
});




ApplicationCtx = Ctx.bootstrap(ApplicationView);

React.render(
	<ApplicationView />,
	document.getElementById('jsMainLayout')
);