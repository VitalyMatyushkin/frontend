/**
 * Created by wert on 20.02.2018
 */

import * as service from '../../../source/js/module/core/service';

import * as chai from 'chai';

import chaiSubset = require("chai-subset");	// yes, I know. This is crap import. But chai-subset typings are work only this way
chai.use(chaiSubset);

const expect = chai.expect;

describe('service', () => {
	it('should be creatable without params');
	it('should be creatable with one param');
	it('should be creatable with multiple params');
});