/**
 * Created by wert on 20.02.2018
 */


import * as chai from 'chai';

import chaiSubset = require("chai-subset");
import {Service} from "../../../source/js/module/core/service";	// yes, I know. This is crap import. But chai-subset typings are work only this way
chai.use(chaiSubset);

const expect = chai.expect;

describe('service', () => {
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
		// I hope there always will be at least 10 schools there
		expect(getSchoolsResponse).to.be.an('array');
		expect(getSchoolsResponse).to.be.lengthOf(10);
		delete (window as any).apiBase;
	});
	
	it('should be able to perform GET request to service with param in url', async () => {
		(window as any).apiBase = 'http://api.stage1.squadintouch.com';
		const allSсhoolService = new Service('/public/schools');
		const getSchoolsResponse = await allSсhoolService.get();
		const schoolId = getSchoolsResponse[0].id;

		const getSchoolByIdService = new Service('/public/schools/{schoolId}');
		const getSchoolByIdResponse = await getSchoolByIdService.get({ schoolId });

		expect(getSchoolByIdResponse).to.containSubset({
			id: schoolId
		});

		delete (window as any).apiBase;
	});

	it('should throw an error in case when cannot GET correct response data (non 2xx status code)', async () => {
		(window as any).apiBase = 'http://api.stage1.squadintouch.com';
		const allSсhoolService = new Service('/public/schools/123');
		const getSchoolsResponsePromise = allSсhoolService.get();
		return getSchoolsResponsePromise
			.then( () => { throw new Error('should not happened')}, err => {
				expect(err).to.be.instanceof(Error);
			})
			.finally( () => {
				delete (window as any).apiBase;
			});
	});

	it('should be able to perform POST request to service without params in url', async () => {
		(window as any).apiBase = 'https://jsonplaceholder.typicode.com';
		const postsService = new Service('/posts');

		const data = { title: 'My post', body: 'My content'};

		const postResult = await postsService.post({...data});

		expect(postResult).to.containSubset(data);

		delete (window as any).apiBase;
	});

	it('should be able to perform POST request to service with params in url', async () => {
		(window as any).apiBase = 'https://jsonplaceholder.typicode.com';
		const postsService = new Service('/posts/{postId}/comments');

		const data = { name: 'My comment', body: 'My comment body'};

		const postResult = await postsService.post({postId: 1},{...data});

		expect(postResult).to.containSubset(data);

		delete (window as any).apiBase;
	});

});