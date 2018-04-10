
import { PubSubMixin, $ as PubSubMixin$ } from './src/pubsub.js'
import { superclass } from './src/mixin-hierarchy.js'

const expect = chai.expect

describe('PubSub Mixin', function() {

	it('should export a function', function() {
		expect(PubSubMixin).to.be.a('function')
	})

	describe('Internals', function() {

		let Subclass, object, $_topics
		
		before(function() {
			$_topics = PubSubMixin$.$_topics
		})

		it('should self-initialize topics', function() {
			Subclass = class Subclass extends superclass(class {}).withMixins(PubSubMixin) {
				testTopics() {
					expect(this).to.have.all.keys($_topics)
				}
			}
			
			let test = new Subclass().testTopics()
		})

	})

	describe('Interface', function() {

		let Subclass

		before(function() {
			Subclass = PubSubMixin(class {})
		})

		it('should provide a way to publish', function() {
			expect(Subclass).to.respondTo('publish')
		})

		it('should provide a way to subscribe', function() {
			expect(Subclass).to.respondTo('subscribe')
		})

	})

	describe('Usage', function() {

		let Subclass

		before(function() {
			Subclass = class Subclass extends superclass(class {}).withMixins(PubSubMixin) {}
		})

		describe('#publish()', function() {

			it('should require a topic to publish', function() {
				expect(new Subclass().publish).to.throw()
				expect(() => new Subclass().publish('')).to.not.throw()
				expect(() => new Subclass().publish('a')).to.not.throw()
			})

			it('should accept data to publish', function() {
				expect(() => new Subclass().publish('a', {})).to.not.throw()
			})

			it('should accept synchronous requests', function() {
				expect(() => new Subclass().publish('a', {}, true)).to.not.throw()
			})

			it('should publish synchronously', function() {
				
			})

		})

		describe('#subscribe()', function() {
			
		})

	})

})

