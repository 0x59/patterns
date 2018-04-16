
import { PubSubMixin, $ as $PubSubMixin } from './src/pubsub.js'
import { superclass } from './src/mixin-hierarchy.js'

const expect = chai.expect

describe('PubSub Mixin', function() {

	it('should export a function', function() {
		expect(PubSubMixin).to.be.a('function')
	})

	describe('Internals', function() {

		let Subclass
		
		it('should self-initialize state', function() {
			let { $_topics, $_publishSettings } = $PubSubMixin

			Subclass = class Subclass extends superclass(class {}).withMixins(PubSubMixin) {
				testTopics() {
					expect(this).to.have.all.keys($_topics, $_publishSettings)
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
				expect(() => new Subclass().publish('a', {}, { sync: true })).to.not.throw()
			})

			it('should return a promise when publishing asynchronously', function() {
				expect(new Subclass().publish('').promise).to.be.an.instanceof(Promise)
			})

			it('should not return a promise when publishing asynchronously and requested', function() {
				expect(new Subclass().publish('', {}, { usePromise: false }).promise).to.equal(null)
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

			it('should accept / async / skip available message / not active', function() {
				expect(() => instance.subscribe('a', fn), {
					sync: false,
					sendAvailableMessage: false,
					active: false
				}).to.not.throw()
			})

			it('should accept / async / skip available message / active', function() {
				expect(() => instance.subscribe('a', fn), {
					sync: false,
					sendAvailableMessage: false,
					active: true
				}).to.not.throw()
			})

			it('should accept / async / send available message / not active', function() {
				expect(() => instance.subscribe('a', fn), {
					sync: false,
					sendAvailableMessage: true,
					active: false
				}).to.not.throw()
			})

			it('should accept / async / send available message / active', function() {
				expect(() => instance.subscribe('a', fn), {
					sync: false,
					sendAvailableMessage: true,
					active: true 
				}).to.not.throw()
			})

			it('should accept / async / promise / send available message / active', function() {
				expect(() => instance.subscribe('a', fn), {
					sync: false,
					usePromise: true,
					sendAvailableMessage: true,
					active: true
				}).to.not.throw()
			})

			it('should accept / async / promise / skip available message / active', function() {
				expect(() => instance.subscribe('a', fn), {
					sync: false,
					usePromise: true,
					sendAvailableMessage: false,
					active: true
				}).to.not.throw()
			})

			it('should accept / sync / skip available message / not active', function() {
				expect(() => instance.subscribe('a', fn), {
					sync: true,
					sendAvailableMessage: false,
					active: false
				}).to.not.throw()
			})

			it('should accept / sync / skip available message / active', function() {
				expect(() => instance.subscribe('a', fn), {
					sync: true,
					sendAvailableMessage: false,
					active: true 
				}).to.not.throw()
			})

			it('should accept / sync / send available message / not active', function() {
				expect(() => instance.subscribe('a', fn), {
					sync: true,
					sendAvailableMessage: true,
					active: false
				}).to.not.throw()
			})

			it('should accept / sync / send available message / active', function() {
				expect(() => instance.subscribe('a', fn), {
					sync: true,
					sendAvailableMessage: true,
					active: true
				}).to.not.throw()
			})

			it('should accept / sync / promise / send available message / active', function() {
				expect(() => instance.subscribe('a', fn), {
					sync: true,
					usePromise: true,
					sendAvailableMessage: true,
					active: true
				}).to.not.throw()
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

			it('should receive the available message / send message / active', function() {
				instance.publish('log', message, { sync: true })
				instance.subscribe('log', subFn, {
					sync: true,
					sendAvailableMessage: true,
					active: true
				})
				expect(message.count).to.equal(1)
			})

			it('should not receive the available message / send message / inactive', function() {
				instance.publish('log', message, { sync: true })
				instance.subscribe('log', subFn, {
					sync: true,
					sendAvailableMessage: true,
					active: false
				})
				expect(message.count).to.equal(0)
			})

			it('should not receive the available message / skip message / active', function() {
				instance.publish('log', message, { sync: true })
				instance.subscribe('log', subFn, {
					sync: true,
					sendAvailableMessage: false,
					active: true
				})
				expect(message.count).to.equal(0)
			})

			it('should not receive the available message / skip message / inactive', function() {
				instance.publish('log', message, { sync: true })
				instance.subscribe('log', subFn, {
					sync: true,
					sendAvailableMessage: false,
					active: false
				})
				expect(message.count).to.equal(0)
			})

			it('should receive the available message and new messages / send message / active', function() {
				instance.publish('log', message, { sync: true }) // 0
				instance.subscribe('log', subFn, {
					sync: true,
					sendAvailableMessage: true,
					active: true
				}) // 1
				instance.publish('log', message, { sync: true }) // 2
				instance.publish('log', message, { sync: true }) // 3 
				expect(message.count).to.equal(3)
			})

			it('should support duplicate subscriptions', function() {
				instance.publish('log', message, { sync: true }) // 0
				instance.subscribe('log', subFn, {
					sync: true,
					sendAvailableMessage: true,
					active: true
				}) // 1
				instance.publish('log', message, { sync: true }) // 2
				instance.subscribe('log', subFn, {
					sync: true,
					sendAvailableMessage: true,
					active: true
				}) // 3
				instance.publish('log', message, { sync: true }) // 4, 5
				expect(message.count).to.equal(5)
			})

			it('should support toggling subscriptions and receiving the available message', function() {
				let ctrl = instance.subscribe('log', subFn, {
					sync: true,
					sendAvailableMessage: true,
					active: true
				})
				instance.publish('log', message, { sync: true })

				expect(message.count).to.equal(1)
				ctrl.toggle()

				instance.publish('log', message, { sync: true })

				expect(message.count).to.equal(1)
				ctrl.toggle()

				instance.publish('log', message, { sync: true })
				expect(message.count).to.equal(3)
			})
			
			it('should support turning subscriptions on/off', function() {
				let ctrl = instance.subscribe('log', subFn, {
					sync: true,
					sendAvailableMessage: false,
					active: false
				})
				instance.publish('log', message, { sync: true })

				expect(message.count).to.equal(0)
				ctrl.on()

				instance.publish('log', message, { sync: true })

				expect(message.count).to.equal(1)
				ctrl.off()

				instance.publish('log', message, { sync: true })

				expect(message.count).to.equal(1)
			})

			it('should support turning subscriptions on/off and receiving the available message', function() {
				let ctrl = instance.subscribe('log', subFn, {
					sync: true,
					sendAvailableMessage: true,
					active: false
				})
				instance.publish('log', message, { sync: true })

				expect(message.count).to.equal(0)
				ctrl.on()

				instance.publish('log', message, { sync: true })

				expect(message.count).to.equal(2)
				ctrl.off()

				instance.publish('log', message, { sync: true })
				expect(message.count).to.equal(2)
			})

			it('should support settings retention for publish', function() {
				let ctrl = instance.subscribe('log', subFn, {
					sync: true,
					sendAvailableMessage: false,
					active: true
				})
				instance.publish('log', message, { sync: true })
				instance.publish('log', message)

				expect(message.count).to.equal(2)

				instance.publish('log', message, { sync: false })
				instance.publish('log', message)

				expect(message.count).to.equal(2)
			})

		})

		describe('Sync Publish, Async Subscribe', function() {

			let Subclass, instance, message, subFn, subPromiseFn, checkMessageCount

			before(function() {
				Subclass = class Subclass extends superclass(class {}).withMixins(PubSubMixin) {}
				subFn = ( done, count, topicId, data ) => {
					if( data ) data.count += 1
					if( done ) {
						if( count !== null ) {
							expect(message.count).to.equal(count)
						}
						done()
					}
				}
				subPromiseFn = ( done, count, topicId, data ) => {
					data.promise.then(( data ) => {
						if( data ) data.count += 1
						if( done ) {
							if( count !== null ) {
								expect(message.count).to.equal(count)
							}
							done()
						}
					})
				}
				checkMessageCount = ( count, done ) => {
					expect(message.count).to.equal(count)
					if( done ) done()
				}
			})

			beforeEach(function() {
				instance = new Subclass()
				message = { count: 0 }
			})

			it('should receive available message / send message / no promise / active', function( done ) {
				const pubArtifacts = instance.publish('log', message, { sync: true })
				expect(pubArtifacts).to.be.an('array').that.is.empty
				instance.subscribe('log', subFn.bind(null, done, 1), {
					sync: false,
					usePromise: false,
					sendAvailableMessage: true,
					active: true
				})
				expect(message.count).to.equal(0)
			})

			it('should receive available message / send message / promise / active', function( done ) {
				const artifacts = instance.publish('log', message, { sync: true })
				expect(artifacts).to.be.an('array').that.is.empty
				instance.subscribe('log', subPromiseFn.bind(null, done, 1), {
					sync: false,
					usePromise: true,
					sendAvailableMessage: true,
					active: true
				})
				expect(message.count).to.equal(0)
			})

			it('should not receive available message / send message / no promise / inactive', function( done ) {
				instance.publish('log', message, { sync: true })
				instance.subscribe('log', subFn.bind(null, null, 1), {
					sync: false,
					usePromise: false,
					sendAvailableMessage: true,
					active: false
				})
				setTimeout(checkMessageCount, 0, 0, done)
				expect(message.count).to.equal(0)
			})

			it('should not receive available message / send message / promise / inactive', function( done ) {
				instance.publish('log', message, { sync: true })
				instance.subscribe('log', subPromiseFn.bind(null, null, 1), {
					sync: false,
					usePromise: true,
					sendAvailableMessage: true,
					active: false
				})
				setTimeout(checkMessageCount, 0, 0, done)
				expect(message.count).to.equal(0)
			})

			it('should not receive a message / skip message / no promise / active', function( done ) {
				instance.publish('log', message, { sync: true })
				instance.subscribe('log', subFn.bind(null, null, 1), {
					sync: false,
					usePromise: false,
					sendAvailableMessage: false,
					active: true
				})
				setTimeout(checkMessageCount, 0, 0, done)
				expect(message.count).to.equal(0)
			})

			it('should not receive a message / skip message / promise / active', function( done ) {
				instance.publish('log', message, { sync: true })
				instance.subscribe('log', subPromiseFn.bind(null, null, 1), {
					sync: false,
					usePromise: true,
					sendAvailableMessage: false,
					active: true
				})
				setTimeout(checkMessageCount, 0, 0, done)
				expect(message.count).to.equal(0)
			})

			it('should receive the available message and new messages / send message / promise / active',
			function( done ) {
				instance.publish('log', message, { sync: true }) // 0
				instance.subscribe('log', subPromiseFn.bind(null, null, null), {
					sync: false,
					usePromise: true,
					sendAvailableMessage: true,
					active: true
				}) // 1
				instance.publish('log', message, { sync: true }) // 2
				instance.publish('log', message, { sync: true }) // 3 
				setTimeout(checkMessageCount, 0, 3, done)
				expect(message.count).to.equal(0)
			})

			it('should support duplicate subscriptions / send message / promise / active', function( done ) {
				const fn = subPromiseFn.bind(null, null, null)
				instance.publish('log', message, { sync: true }) // 0
				instance.subscribe('log', fn, {
					sync: false,
					sendAvailableMessage: true,
					active: true
				}) // 1
				instance.publish('log', message, { sync: true }) // 2
				instance.subscribe('log', fn, {
					sync: false,
					sendAvailableMessage: true,
					active: true
				}) // 3
				instance.publish('log', message, { sync: true }) // 4, 5
				setTimeout(checkMessageCount, 0, 5, done)
				expect(message.count).to.equal(0)
			})

			it('should support toggling subscriptions and receiving the available message / promise / active',
			function( done ) {
				const ctrl = instance.subscribe('log', subPromiseFn.bind(null, null, null), {
					sync: false,
					usePromise: true,
					sendAvailableMessage: true,
					active: true
				})
				instance.publish('log', message, { sync: true })

				setTimeout(checkMessageCount, 0, 1, null)
				ctrl.toggle()

				instance.publish('log', message, { sync: true })

				setTimeout(checkMessageCount, 0, 1, null)
				ctrl.toggle()

				instance.publish('log', message, { sync: true })
				setTimeout(checkMessageCount, 0, 3, done)
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
				instance.publish('log', message, { sync: false }).promise.then(() => {
					instance.subscribe('log', subFn.bind(null, 1), {
						sync: true,
						sendAvailableMessage: true,
						active: true
					})
					done()
				})
				expect(message.count).to.equal(0)
			})

			it('should not receive the available message when requested and inactive', function( done ) {
				instance.publish('log', message, { sync: false }).promise.then(() => {
					instance.subscribe('log', subFn.bind(null, 1), {
						sync: true,
						sendAvailableMessage: true,
						active: false
					})
					done()
				})
				expect(message.count).to.equal(0)
			})

			it('should not receive the available message when not requested and active', function( done ) {
				instance.publish('log', message, { sync: false }).promise.then(() => {
					instance.subscribe('log', subFn.bind(null, 1), {
						sync: true,
						sendAvailableMessage: false,
						active: true
					})
					done()
				})
				expect(message.count).to.equal(0)
			})

			it('should not receive the available message when not requested and inactive', function( done ) {
				instance.publish('log', message, { sync: false }).promise.then(() => {
					instance.subscribe('log', subFn.bind(null, 1), {
						sync: true,
						sendAvailableMessage: false,
						active: false
					})
					done()
				})
				expect(message.count).to.equal(0)
			})

			it('should receive the available message and new messages', function( done ) {
				instance.publish('log', message, { sync: false }) // 1
				instance.subscribe('log', subFn.bind(null, null), { 
					sync: true,
					sendAvailableMessage: true,
					active: true
				})
				instance.publish('log', message, { sync: false }) // 2
				instance.publish('log', message, { sync: false }).promise.then(() => {
					expect(message.count).to.equal(3)
					done()
				}) // 3 
				expect(message.count).to.equal(0)
			})

			it('should support duplicate subscriptions', function( done ) {
				const fn = subFn.bind(null, null)
				instance.publish('log', message, { sync: false }) // 1 
				instance.subscribe('log', fn, {
					sync: true,
					sendAvailableMessage: true,
					active: true
				})
				instance.publish('log', message, { sync: false }) // 2
				instance.subscribe('log', fn, {
					sync: true,
					sendAvailableMessage: true,
					active: true
				}) // x2
				instance.publish('log', message, { sync: false }).promise.then(() => {
					expect(message.count).to.equal(6)
					done()
				}) // 3 x 2 = 6
				expect(message.count).to.equal(0)
			})

			it('should support toggling subscriptions and receiving the available message', function( done ) {
				let ctrl = instance.subscribe('log', subFn.bind(null, null), { 
					sync: true,
					sendAvailableMessage: true,
					active: true
				})
				instance.publish('log', message, { sync: false }).promise.then(() => {
					expect(message.count).to.equal(1)
					ctrl.toggle()
				})

				instance.publish('log', message, { sync: false }).promise.then(() => {
					ctrl.toggle()
					expect(message.count).to.equal(2)
					done()
				})
				expect(message.count).to.equal(0)
			})
			
			it('should support turning subscriptions on/off', function( done ) {
				let ctrl = instance.subscribe('log', subFn.bind(null, null), { 
					sync: true,
					sendAvailableMessage: false,
					active: false
				})
				instance.publish('log', message, { sync: false }).promise.then(() => {
					expect(message.count).to.equal(0)
					ctrl.on()
				})
				instance.publish('log', message, { sync: false }).promise.then(() => {
					expect(message.count).to.equal(1)
					ctrl.off()
				})
				instance.publish('log', message, { sync: false }).promise.then(() => {
					expect(message.count).to.equal(1)
					done()
				})
				expect(message.count).to.equal(0)
			})

			it('should support turning subscriptions on/off and receiving the available message', function() {
				let ctrl = instance.subscribe('log', subFn.bind(null, null), { 
					sync: true,
					sendAvailableMessage: true,
					active: false
				})
				instance.publish('log', message, { sync: false }).promise.then(() => {
					ctrl.on()
					expect(message.count).to.equal(1)
				})
				instance.publish('log', message, { sync: false }).promise.then(() => {
					expect(message.count).to.equal(2)
					ctrl.off()
				})
				instance.publish('log', message, { sync: false }).promise.then(() => {
					expect(message.count).to.equal(2)
					done()
				})
				expect(message.count).to.equal(0)
			})

		})
		
		describe('Async Publish, Async Subscribe', function() {

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

		})

	})

})

