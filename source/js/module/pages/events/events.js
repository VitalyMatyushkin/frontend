var EventView,
    RouterView = require('module/core/router'),
    Route = require('module/core/route');

EventView = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            rootBinging = self.getMoreartyContext().getBinding(),
            metaBinding = binding.meta(),
            currentPath = metaBinding.get('routing.currentPath'),
            classes = {
                calendar: classNames({
                    eSubMenu_item: true,
                    mActive: currentPath === '/events/calendar'
                }),
                manager: classNames({
                    eSubMenu_item: true,
                    mActive: currentPath === '/events/manager'
                }),
                challenges: classNames({
                    eSubMenu_item: true,
                    mActive: currentPath === '/events/challenges'
                }),
                invites: classNames({
                    eSubMenu_item: true,
                    mActive: currentPath === '/events/invites'
                })
            };

		return <div>
            <div className='bSubMenu'>
                <a href='#events/calendar' className={classes.calendar}>Calendar</a>
                <a href='#events/challenges' className={classes.challenges}>Challenges</a>
                <a href='#events/invites' className={classes.invites}>Invites</a>
                <a href='#events/manager' className={classes.manager}>New Challenge...</a>
            </div>
            <div className='bEvents'>
                <RouterView routes={ metaBinding.sub('routing') } binding={binding}>
                    <Route path='/events/manager' binding={binding.sub('events')} component='module/pages/events/event_manager'  />
                    <Route path='/events/calendar'  binding={binding.sub('events')}component='module/pages/events/events_calendar'   />
                    <Route path='/events/challenges' binding={binding.sub('events')} component='module/pages/events/events_challenges'  />
                    <Route path='/events/invites' binding={binding.sub('invites')} component='module/pages/events/events_invites'  />
                    <Route path='/events/view' binding={binding.sub('events')} component='module/pages/events/view'  />
                </RouterView>
            </div>
        </div>;
	}
});


module.exports = EventView;
