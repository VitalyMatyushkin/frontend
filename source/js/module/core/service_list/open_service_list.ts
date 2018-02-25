import {Service} from 'module/core/service';
import {ImageService} from 'module/core/services/ImageService';

/** Collection of services to reach REST API from server */
export class OpenServiceList {
	publicSchool: Service;
	publicSchools: Service;
	images: any;

	// Services which require authorization
	constructor() {
		// Instead of find one we find all because we don't know school
		// id when user click or type in school domain url
		// so we query all schools
		this.publicSchool = new Service('/public/schools/{schoolId}', undefined);
		this.publicSchools = new Service('/public/schools', undefined);

		/* I don't like idea of using window.apiImg here, but it was easiest solution withoug global refactoring */
		this.images = new ImageService((window as any).apiImg);
	}
};