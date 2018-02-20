/**
 * Created by wert on 19.02.2018
 */

/** Any valid ajax implementation should pass that tests */

import {AxiosAjax as Ajax} from '../../../source/js/module/core/ajax/axios-ajax';
import {CancelError} from '../../../source/js/module/core/ajax/ajax';
import * as chai from 'chai';

import chaiSubset = require("chai-subset");	// yes, I know. This is crap import. But chai-subset typings are work only this way
chai.use(chaiSubset);

const expect = chai.expect;

describe('ajax', () => {

	it('should be creatable with "new" without any params', () => {
		const ajax = new Ajax();
	});

	it('should be able to perform simple GET request with json', () => {
		const ajax = new Ajax();
		const resultPromise = ajax.request({
			url:	'https://jsonplaceholder.typicode.com/posts/1',
			method:	'get'
		});

		return resultPromise.then( response => {
			expect(response.status).to.be.equal(200);
			expect(response.data).to.be.an('object');
			expect(response.headers).to.be.not.undefined;
		});
	});

	it('should be able to perform simple GET request with text content', () => {
		const ajax = new Ajax();
		const resultPromise = ajax.request({
			url:	'https://raw.githubusercontent.com/mongodb/mongo/master/README',
			method:	'get'
		});

		return resultPromise.then( response => {
			expect(response.status).to.be.equal(200);
			expect(response.data).to.be.a('string');
			expect(response.headers).to.be.not.undefined;
		});
	});

	it('should be able to perform POST request', () => {
		const ajax = new Ajax();

		const data = {
			title: 'Welcome to my beauty blog!',
			body: 'The Sun Shine!'
		};

		const resultPromise = ajax.request({
			url:	'http://jsonplaceholder.typicode.com/posts',
			method:	'post',
			data:	data
		});

		return resultPromise.then( response => {
			expect(response.status).to.be.equal(201);
			expect(response.data).to.containSubset({...data});
		});
	});

	it('should be able to perform PUT request', () => {
		const ajax = new Ajax();

		const data = {
			title: 'Welcome to my beauty blog!',
			body: 'The Sun Shine!'
		};

		const resultPromise = ajax.request({
			url:	'http://jsonplaceholder.typicode.com/posts/1',
			method:	'put',
			data:	data
		});

		return resultPromise.then( response => {
			expect(response.status).to.be.equal(200);
			expect(response.data).to.containSubset({...data});
		});
	});

	it('should be able to perform DELETE request', () => {
		const ajax = new Ajax();

		const resultPromise = ajax.request({
			url:	'http://jsonplaceholder.typicode.com/posts/1',
			method:	'delete'
		});

		return resultPromise.then( response => {
			expect(response.status).to.be.equal(200);
		});
	});

	/** I'm not sure how cancellation should work. Check source file for more comments */
	xit('should be cancellable without propagating canceled error', () => {
		const ajax = new Ajax();
		const resultPromise = ajax.request({
			url:	'https://jsonplaceholder.typicode.com/posts/1',
			method:	'get'
		});

		const testResult = resultPromise.then(
			successResult => { throw new Error('This should not happened') },
			err => {
			expect(err).to.be.an.instanceof(CancelError);
			return true;
		});

		resultPromise.cancel();


	});
});