export const RegionHelper = {
	/*
		At the moment we can get the user's region only by phone prefix
	 */
	getRegion: function(globalBinding) {
		const phone = globalBinding.toJS('userData.sessions.loginSession.phone');
		let region = undefined;

		switch(true){
			case typeof phone !== 'undefined' && phone.indexOf('+1') === 0:
				region = 'US';
				break;
			case typeof phone !== 'undefined' && phone.indexOf('+44') === 0:
				region = 'GB';
				break;
			case typeof phone !== 'undefined' && phone.indexOf('+49') === 0:
				region = 'DE';
				break;
			default:
				region = 'GB';
				break;
		}

		return region;
	}
};