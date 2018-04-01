export const RegionHelper = {
	/*
		At the moment we can get the user's region only by phone prefix
	 */
	getRegion: function(globalBinding) {
		const phone = globalBinding.toJS('userData.sessions.loginSession.phone');
		let region = undefined;

		if (typeof phone !== 'undefined' && phone.indexOf('+1') === 0) {
			region = 'US';
		} else {
			region = 'GB';
		}

		return region;
	}
};