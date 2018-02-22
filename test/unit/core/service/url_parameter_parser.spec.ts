/**
 * Created by wert on 21.02.2018
 */

import * as chai from 'chai';
import chaiSubset = require("chai-subset");
chai.use(chaiSubset);

const expect = chai.expect;

import {urlParameterParser} from "../../../../source/js/module/core/service/url_parameter_parser";

describe('urlParameterParser', () => {
	it('should return empty array of params when there is no params', () => {
		const result = urlParameterParser('/i/login');
		expect(result).to.be.an('array');
		expect(result).to.be.lengthOf(0);
	});

	it('should return array with params when there are multiple unique params', () => {
		const result = urlParameterParser('/i/schools/{schoolId}/forms/{formId}/students/{studentId}');
		expect(result).to.be.an('array');
		expect(result).to.be.lengthOf(3);
		expect(result).to.containSubset(['schoolId', 'formId', 'studentId']);
	});

	it('should return array without duplicates when some params are duplicated', () => {
		const result = urlParameterParser('/i/schools/{schoolId}/forms/{schoolId}/students/{studentId}');
		expect(result).to.be.an('array');
		expect(result).to.be.lengthOf(2);
		expect(result).to.containSubset(['schoolId', 'studentId']);
	});

});