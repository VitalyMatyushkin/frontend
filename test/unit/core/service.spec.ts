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
	});

	it('should be creatable with one param', () => {
		const service = new Service('/public/schools/{schoolId}');
	});

	it('should be creatable with multiple params');
});