/**
 * Created by vitaly on 12.12.17.
 */

interface Profile {
	avatar: 			string
	birthday:			string
	createdAt:			string
	email:				string
	firstName:			string
	gender:				string
	id:					string
	lastName:			string
	notification:		any
	phone:				string
	status:				string
	updatedAt:			string
	verification:		any
	webIntroEnabled:	boolean
	webIntroShowTimes:	number
}

export function getUserInfo(): Promise<Profile> {
	return (window as any).Server.profile.get().then(profile => {
		return profile;
	});
}