
import { PubSubMixin, $ as PubSubMixin$ } from './src/pubsub.js'
import { superclass } from './src/mixin-hierarchy.js'

const expect = chai.expect

describe('PubSub Mixin', function() {

	it('should export a function', function() {
		expect(PubSubMixin).to.be.a('function')
	})

	describe('Internals', function() {

		let Subclass, object, $_topics, $_publishSync
		
		before(function() {
			$_topics = PubSubMixin$.$_topics
			$_publishSync = PubSubMixin$.$_publishSync
		})

		it('should self-initialize topics', function() {
			Subclass = class Subclass extends superclass(class {}).withMixins(PubSubMixin) {
				testTopics() {
					expect(this).to.have.all.keys($_topics, $_publishSync)
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

			let instance, fn
			
			before(function() {
				fn = () => 0
			})
			
			beforeEach(function() {
				instance = new Subclass()
			})
			
			it('should require a topic and callback to subscribe', function() {
				expect(instance.subscribe).to.throw()
				expect(() => new Subclass().subscribe('')).to.throw()
				expect(() => new Subclass().subscribe('a')).to.throw()
				expect(() => new Subclass().subscribe('a', {})).to.throw()
				expect(() => new Subclass().subscribe('a', fn)).to.not.throw()
			})

			it('should accept: asynchronous, skip last message, not active', function() {
				expect(() => instance.subscribe('a', fn), false, false, false).to.not.throw()
			})

			it('should accept: asynchronous, skip last message, active', function() {
				expect(() => instance.subscribe('a', fn), false, false, true).to.not.throw()
			})

			it('should accept: asynchronous, send last message, not active', function() {
				expect(() => instance.subscribe('a', fn), false, true, false).to.not.throw()
			})

			it('should accept: asynchronous, send last message, active', function() {
				expect(() => instance.subscribe('a', fn), false, true, true).to.not.throw()
			})

			it('should accept: synchronous, skip last message, not active', function() {
				expect(() => instance.subscribe('a', fn), true, false, false).to.not.throw()
			})

			it('should accept: synchronous, skip last message, active', function() {
				expect(() => instance.subscribe('a', fn), true, false, true).to.not.throw()
			})

			it('should accept: synchronous, send last message, not active', function() {
				expect(() => instance.subscribe('a', fn), true, true, false).to.not.throw()
			})

			it('should accept: synchronous, send last message, active', function() {
				expect(() => instance.subscribe('a', fn), true, true, true).to.not.throw()
			})

		})

	})
	
	describe('Verification', function() {

		describe('Sync Publish, Sync Subscribe', function() {

			let Subclass, instance, message, subFn

			before(function() {
				Subclass = class Subclass extends superclass(class {}).withMixins(PubSubMixin) {}
				subFn = ( topicId, data ) => { if( data ) data.count += 1 }
			})

			beforeEach(function() {
				instance = new Subclass()
				message = { count: 0 }
			})

			it('should receive last message when requested and active', function() {
				instance.publish('log', message, true)
				instance.subscribe('log', subFn, true, true, true)

				expect(message.count).to.equal(1)
			})

			it('should not receive last message when requested and inactive', function() {
				instance.publish('log', message, true)
				instance.subscribe('log', subFn, true, true, false)

				expect(message.count).to.equal(0)
			})

			it('should not receive last message when not requested and active', function() {
				instance.publish('log', message, true)
				instance.subscribe('log', subFn, true, false, true)

				expect(message.count).to.equal(0)
			})

			it('should not receive last message when not requested and inactive', function() {
				instance.publish('log', message, true)
				instance.subscribe('log', subFn, true, false, false)

				expect(message.count).to.equal(0)
			})

			it('should receive the last message and new messages', function() {
				instance.publish('log', message, true) // 0
				instance.subscribe('log', subFn, true, true, true) // 1
				instance.publish('log', message, true) // 2
				instance.publish('log', message, true) // 3 

				expect(message.count).to.equal(3)
			})

			it('should support duplicate subscriptions', function() {
				instance.publish('log', message, true) // 0
				instance.subscribe('log', subFn, true, true, true) // 1
				instance.publish('log', message, true) // 2
				instance.subscribe('log', subFn, true, true, true) // 3
				instance.publish('log', message, true) // 4, 5

				expect(message.count).to.equal(5)
			})

			it('should support toggling subscriptions and receiving the last message', function() {
				let ctrl = instance.subscribe('log', subFn, true, true, true)
				instance.publish('log', message, true)

				expect(message.count).to.equal(1)
				ctrl.toggle()

				instance.publish('log', message, true)

				expect(message.count).to.equal(1)
				ctrl.toggle()

				instance.publish('log', message, true)

				expect(message.count).to.equal(3)
			})
			
			it('should support turning subscriptions on/off', function() {
				let ctrl = instance.subscribe('log', subFn, true, false, false)
				instance.publish('log', message, true)

				expect(message.count).to.equal(0)
				ctrl.on()

				instance.publish('log', message, true)

				expect(message.count).to.equal(1)
				ctrl.off()

				instance.publish('log', message, true)

				expect(message.count).to.equal(1)
			})

			it('should support turning subscriptions on/off and receiving the last message', function() {
				let ctrl = instance.subscribe('log', subFn, true, true, false)
				instance.publish('log', message, true)

				expect(message.count).to.equal(0)
				ctrl.on()

				instance.publish('log', message, true)

				expect(message.count).to.equal(2)
				ctrl.off()

				instance.publish('log', message, true)

				expect(message.count).to.equal(2)
			})

			it('should support sticky synchronicity for publish', function() {
				instance.subscribe('log', subFn, true, false, true)
				instance.publish('log', message, true)
				instance.publish('log', message)

				expect(message.count).to.equal(2)

				instance.publish('log', message, false)
				instance.publish('log', message, false)

				expect(message.count).to.equal(2)
			})

		})

	})

})

