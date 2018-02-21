/**
 * Created by wert on 20.02.2018
 */


import * as chai from 'chai';

import chaiSubset = require("chai-subset");
import {Service} from "../../../source/js/module/core/service";	// yes, I know. This is crap import. But chai-subset typings are work only this way
chai.use(chaiSubset);

const expect = chai.expect;

describe.only('service', () => {
	it('should be creatable without params', () => {
		const service = new Service('/i/login');
		expect(service.requiredParams).to.be.undefined;	// to be empty array in future
	});

	it('should be creatable with one param', () => {
		const service = new Service('/public/schools/{schoolId}');
		expect(service.requiredParams).to.containSubset(['schoolId']);
	});

	it('should be creatable with multiple params', () => {
		const service = new Service('/public/schools/{schoolId}/forms/{formId}');
		expect(service.requiredParams).to.containSubset(['schoolId', 'formId']);
	});

	it('should be able to perform GET request to service without params in url', async () => {
		(window as any).apiBase = 'http://api.stage1.squadintouch.com';
		const service = new Service('/public/schools');
		const getSchoolsResponse = await service.get();
		expect(getSchoolsResponse).to.be.an('array');


		// debugger;


		delete (window as any).apiBase;
	});
});