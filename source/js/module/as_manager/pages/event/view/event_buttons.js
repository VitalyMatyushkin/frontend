var If = require('module/ui/if/if'),
	InvitesMixin = require('module/as_manager/pages/invites/mixins/invites_mixin'),
    classNames = require('classnames'),
	EventHeader;

EventHeader = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
    displayName: 'EventButtons',
    closeMatch: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            points = binding.toJS('points'),
            event = binding.toJS('model');

        window.Server.results.post({
            eventId: event.id,
            comment: binding.get('model.comment')
        }).then(function (result) {
            points.forEach(function (point) {
                point.resultId = result.id;

                window.Server.pointsInResult.post({resultId: result.id}, point).then(function (res) {
                    //console.log(res);
                });
            });

            delete event.participants;
            delete event.result;
            delete event.invites;

            event.resultId = result.id;

            window.Server.event.put({
                eventId: event.id
            }, event).then(function (res) {
                binding
                    .atomically()
                    .set('model.resultId', result.id)
                    .set('mode', 'general')
                    .commit();
            });
        });
    },
    isOwner: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            userId = self.getMoreartyContext().getBinding().get('userData.authorizationInfo.userId'),
            userRole = self.getMoreartyContext().getBinding().get('currentUserRole'), //Gets the global variable containing current role
            ownerId = binding.get('participants.0.school.ownerId'),
            authRoles = ['coach','manager','teacher']; //Roles that are allowed to control events
        return (userId === ownerId || authRoles.indexOf(userRole)!=-1);
    },
    isEnableClose: function () {
        var self = this,
            binding = self.getDefaultBinding();

        return binding.get('participants').count() > 1;
    },
    onClickReFormTeamMatch: function () {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('mode', 'edit_squad');
    },
    onClickCloseMatch: function () {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('mode', 'closing');
    },
    onClickOk: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            currentMode = binding.get('mode');

        if (currentMode === 'closing') {
            self.closeMatch();
        } else {
            binding.set('mode', 'general');
        }
    },
    onClickCancel: function () {
        var self = this,
            binding = self.getDefaultBinding();

        binding
            .atomically()
            .set('points', Immutable.List())
            .set('mode', 'general')
            .commit();
    },
	render: function() {
        var self = this,
			binding = self.getDefaultBinding(),
            closeClasses = classNames({
                bButton: true,
                mRed: self.isEnableClose(),
                mDisable: !self.isEnableClose()
            });
		return <If condition={self.isOwner() && !binding.get('model.resultId')}>
            <div className="bEventButtons">
                <If condition={binding.get('mode') === 'general'}>
                    <div
                        className="bButton"
                        onClick={self.onClickReFormTeamMatch}
                    >Edit squad</div>
                </If>
                <If condition={binding.get('mode') === 'general'}>
                    <div
                        className={closeClasses}
                        onClick={self.isEnableClose() ? self.onClickCloseMatch : null}
                    >Close match</div>
                </If>
                <If condition={binding.get('mode') !== 'general'}>
                    <div
                        className="bButton"
                        onClick={self.onClickOk}
                    >Ok</div>
                </If>
                <If condition={binding.get('mode') === 'closing'}>
                    <div
                        className="bButton mRed"
                        onClick={self.onClickCancel}
                    >Cancel</div>
                </If>
            </div>
        </If>;
	}
});


module.exports = EventHeader;
