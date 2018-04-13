
import { PubSubMixin, $ as PubSubMixin$ } from './src/pubsub.js'
import { superclass } from './src/mixin-hierarchy.js'

const expect = chai.expect

describe('PubSub Mixin', function() {

	it('should export a function', function() {
		expect(PubSubMixin).to.be.a('function')
	})

	describe('Internals', function() {

		let Subclass
		
		it('should self-initialize topics', function() {
			let { $_topics, $_publishSync } = PubSubMixin$

			Subclass = class Subclass extends superclass(class {}).withMixins(PubSubMixin) {
				testTopics() {
					expect(this).to.have.all.keys($_topics, $_publishSync)
				}
			}
			
			new Subclass().testTopics()
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

			it('should return a promise when publishing asynchronously', function() {
				expect(new Subclass().publish('').promise).to.be.an.instanceof(Promise)
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

			it('should accept: asynchronous, skip available message, not active', function() {
				expect(() => instance.subscribe('a', fn), false, false, false).to.not.throw()
			})

			it('should accept: asynchronous, skip available message, active', function() {
				expect(() => instance.subscribe('a', fn), false, false, true).to.not.throw()
			})

			it('should accept: asynchronous, send available message, not active', function() {
				expect(() => instance.subscribe('a', fn), false, true, false).to.not.throw()
			})

			it('should accept: asynchronous, send available message, active', function() {
				expect(() => instance.subscribe('a', fn), false, true, true).to.not.throw()
			})

			it('should accept: synchronous, skip available message, not active', function() {
				expect(() => instance.subscribe('a', fn), true, false, false).to.not.throw()
			})

			it('should accept: synchronous, skip available message, active', function() {
				expect(() => instance.subscribe('a', fn), true, false, true).to.not.throw()
			})

			it('should accept: synchronous, send available message, not active', function() {
				expect(() => instance.subscribe('a', fn), true, true, false).to.not.throw()
			})

			it('should accept: synchronous, send available message, active', function() {
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

			it('should receive the available message when requested and active', function() {
				instance.publish('log', message, true)
				instance.subscribe('log', subFn, true, true, true)

				expect(message.count).to.equal(1)
			})

			it('should not receive the available message when requested and inactive', function() {
				instance.publish('log', message, true)
				instance.subscribe('log', subFn, true, true, false)

				expect(message.count).to.equal(0)
			})

			it('should not receive the available message when not requested and active', function() {
				instance.publish('log', message, true)
				instance.subscribe('log', subFn, true, false, true)

				expect(message.count).to.equal(0)
			})

			it('should not receive the available message when not requested and inactive', function() {
				instance.publish('log', message, true)
				instance.subscribe('log', subFn, true, false, false)

				expect(message.count).to.equal(0)
			})

			it('should receive the available message and new messages', function() {
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

			it('should support toggling subscriptions and receiving the available message', function() {
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

			it('should support turning subscriptions on/off and receiving the available message', function() {
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
				instance.publish('log', message)

				expect(message.count).to.equal(2)
			})

		})

		describe('Async Publish, Sync Subscribe', function() {

			let Subclass, instance, message, subFn

			before(function() {
				Subclass = class Subclass extends superclass(class {}).withMixins(PubSubMixin) {}
				subFn = ( count, topicId, data ) => {
					data.count += 1
					if( count !== null ) {
						expect(data.count).to.equal(count)
					}
				}
			})

			beforeEach(function() {
				instance = new Subclass()
				message = { count: 0 }
			})

			it('should receive the available message when requested and active', function( done ) {
				instance.publish('log', message, false).promise.then(() => {
					instance.subscribe('log', subFn.bind(null, 1), true, true, true)
					done()
				})
				expect(message.count).to.equal(0)
			})

			it('should not receive the available message when requested and inactive', function( done ) {
				instance.publish('log', message, false).promise.then(() => {
					instance.subscribe('log', subFn.bind(null, 1), true, true, false)
					done()
				})
				expect(message.count).to.equal(0)
			})

			it('should not receive the available message when not requested and active', function( done ) {
				instance.publish('log', message, false).promise.then(() => {
					instance.subscribe('log', subFn.bind(null, 1), true, false, true)
					done()
				})
				expect(message.count).to.equal(0)
			})

			it('should not receive the available message when not requested and inactive', function( done ) {
				instance.publish('log', message, false).promise.then(() => {
					instance.subscribe('log', subFn.bind(null, 1), true, false, false)
					done()
				})
				expect(message.count).to.equal(0)
			})

			it('should receive the available message and new messages', function( done ) {
				instance.publish('log', message, false) // 1
				instance.subscribe('log', subFn.bind(null, null), true, true, true) 
				instance.publish('log', message, false) // 2
				instance.publish('log', message, false).promise.then(() => {
					expect(message.count).to.equal(3)
					done()
				}) // 3 
				expect(message.count).to.equal(0)
			})

			it('should support duplicate subscriptions', function( done ) {
				const fn = subFn.bind(null, null)
				instance.publish('log', message, false) // 1 
				instance.subscribe('log', fn, true, true, true)
				instance.publish('log', message, false) // 2
				instance.subscribe('log', fn, true, true, true) // x2
				instance.publish('log', message, false).promise.then(() => {
					expect(message.count).to.equal(6)
					done()
				}) // 3 x 2 = 6
				expect(message.count).to.equal(0)
			})

			it('should support toggling subscriptions and receiving the available message', function( done ) {
				let ctrl = instance.subscribe('log', subFn.bind(null, null), true, true, true)
				instance.publish('log', message, false).promise.then(() => {
					expect(message.count).to.equal(1)
					ctrl.toggle()
				})

				instance.publish('log', message, false).promise.then(() => {
					ctrl.toggle()
					expect(message.count).to.equal(2)
					done()
				})
				expect(message.count).to.equal(0)
			})
			
			it('should support turning subscriptions on/off', function( done ) {
				let ctrl = instance.subscribe('log', subFn.bind(null, null), true, false, false)
				instance.publish('log', message, false).promise.then(() => {
					expect(message.count).to.equal(0)
					ctrl.on()
				})
				instance.publish('log', message, false).promise.then(() => {
					expect(message.count).to.equal(1)
					ctrl.off()
				})
				instance.publish('log', message, false).promise.then(() => {
					expect(message.count).to.equal(1)
					done()
				})
				expect(message.count).to.equal(0)
			})

			it('should support turning subscriptions on/off and receiving the available message', function() {
				let ctrl = instance.subscribe('log', subFn.bind(null, null), true, true, false)
				instance.publish('log', message, false).promise.then(() => {
					ctrl.on()
					expect(message.count).to.equal(1)
				})
				instance.publish('log', message, false).promise.then(() => {
					expect(message.count).to.equal(2)
					ctrl.off()
				})
				instance.publish('log', message, false).promise.then(() => {
					expect(message.count).to.equal(2)
					done()
				})
				expect(message.count).to.equal(0)
			})

		})

	})

})

