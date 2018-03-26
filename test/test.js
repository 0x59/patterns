'use strict';

const
	chai = require('chai'),
	assert = chai.assert,

	index = require('../')

describe('#index', function() {

	it('should return "Hello World!"', function() {
		assert.strictEqual(index(), 'Hello World!', 'Did not return "Hello World!"')
	})

})
