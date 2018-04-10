
import Symbols from './src/module-symbols.js'

const expect = chai.expect

describe('Module Symbols', function() {

	describe('Symbols()', function() {

		it('should be a function', function() {
			expect(Symbols).to.be.a('function')
		})

		const $ = Symbols()

		it('should return symbols for arbitrary property access', function() {
			expect($.a).to.be.a('symbol')
			expect($['oijsdf']).to.be.a('symbol')
			expect($.abc).to.be.a('symbol')
		})

		it('should return the same symbols for subsequent property access', function() {
			expect($.a).to.equal($.a)
			expect($['oijsdf']).to.equal($['oijsdf'])
			expect($.abc).to.equal($.abc)
		})

	})

})

