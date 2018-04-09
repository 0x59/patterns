
import { superclass, MixinHierarchy } from './src/mixin-hierarchy.js'

const expect = chai.expect

describe('MixinHierarchy', function() {

	describe('superclass', function() {

		it('should be a function', function() {
			expect(superclass).to.be.a('function')
		})

		it('should return a MixinHierarchy instance', function() {
			expect(superclass()).to.be.an.instanceof(MixinHierarchy)
		})

	})

	const Superclass = class {}

	describe('MixinHierarchy', function() {
		
		describe('#withMixins()', function() {

			it('should not return a MixinHierarchy instance', function() {
				expect(superclass(Superclass).withMixins()).to.not.be.an.instanceof(MixinHierarchy)
			})

			it('should not return an object', function() {
				expect(superclass(Superclass).withMixins()).to.not.be.an('object')
			})

			it('should return a function', function() {
				expect(superclass(Superclass).withMixins()).to.be.a('function')
			})
		
		})

	})

	const Mixin1 = superclass => class Mixin1 extends superclass {}
	const Mixin2 = superclass => class Mixin2 extends superclass {}

	describe('superclass().withMixins()', function() {

		it('should return the passed superclass', function() {
			expect(superclass(Superclass).withMixins()).to.equal(Superclass)
		})

		it('should cache equivalent mixin applications', function() {
			expect
				(superclass(Superclass).withMixins(Mixin1))
			.to.equal
				(superclass(Superclass).withMixins(Mixin1))
		})

		it('should differentiate in cache mixin application sequence', function() {
			expect
				(superclass(Superclass).withMixins(Mixin1, Mixin2))
			.to.not.equal
				(superclass(Superclass).withMixins(Mixin2, Mixin1))
		})

	})

	const Subclass1 = class extends superclass(Superclass).withMixins(Mixin1) {}
	const Subclass2 = class extends superclass(Superclass).withMixins(Mixin1, Mixin2) {}

	describe('class extends superclass().withMixins()', function() {

		it('should create instances of the derived class with one mixin', function() {
			expect(new Subclass1).to.be.an.instanceof(Subclass1)
		})

		it('should create instances of the derived class with multiple mixins', function() {
			expect(new Subclass2).to.be.an.instanceof(Subclass2)
		})
	
		it('should create instances of the supplied superclass', function() {
			expect(new Subclass2).to.be.an.instanceof(Superclass)
		})

		it('should apply mixins from left to right', function() {
			const p = Object.getPrototypeOf(new Subclass2)
			let pNext = Object.getPrototypeOf(p)

			expect(pNext.constructor.name).to.be.equal('Mixin2')

			pNext = Object.getPrototypeOf(pNext)
			expect(pNext.constructor.name).to.be.equal('Mixin1')
		})

	})

})
