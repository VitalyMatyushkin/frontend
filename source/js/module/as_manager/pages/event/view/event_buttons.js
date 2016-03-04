const   If              = require('module/ui/if/if'),
	    InvitesMixin    = require('module/as_manager/pages/invites/mixins/invites_mixin'),
        classNames      = require('classnames'),
        React           = require('react'),
        Immutable       = require('immutable'),
        SVG 				    = require('module/ui/svg');

const EventHeader = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
    displayName: 'EventButtons',
    closeMatch: function () {
        const   self    = this,
                binding = self.getDefaultBinding(),
                points  = binding.toJS('points'),
                event   = binding.toJS('model');

        window.Server.results.post({
            eventId: event.id,
            comment: binding.get('model.comment')
        }).then(function (result) {
            points.forEach(function (point) {
                point.resultId = result.id;

                window.Server.pointsInResult.post({resultId: result.id}, point).then(function (res) {
                    //console.log(res);
                    return res;
                });
                return point;
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
                return res;
            });
        });
    },
    isOwner: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            userId = self.getMoreartyContext().getBinding().get('userData.authorizationInfo.userId'),
            ownerId = binding.get('participants.0.school.ownerId'),
            verifiedUser = self.getMoreartyContext().getBinding().get('userData.userInfo.verified');
        return (userId === ownerId || (verifiedUser.get('email') && verifiedUser.get('phone') && verifiedUser.get('personal')));
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
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
            closeClasses = classNames({
                mClose: true,
                mRed: self.isEnableClose(),
                mDisable: !self.isEnableClose()
            });
		return (
        <If condition={self.isOwner() && !binding.get('model.resultId') && activeSchoolId}>
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
                    >Close match <SVG icon="icon_close_match"/></div>
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
        </If>
        );
	}
});


module.exports = EventHeader;
