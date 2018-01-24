import * as BPromise from 'bluebird';
import {Profile} from "module/models/profile/profile";
import {ServiceList} from "module/core/service_list/service_list";

export function getUserInfo(): BPromise<Profile> {
	return (window.Server as ServiceList).profile.get();
}