
import { util as _ } from './utility.js'
import { Symbols } from './module-symbols.js'

const
	TOPIC_DEL = '/',
	$ = Symbols(), {
		$_addTopic,
		$_checkAndExecuteSubscriber,
		$_message,
		$_initTopics,
		$_makeAsyncPublisher,
		$_makeAsyncSubscriber,
		$_makeControl,
		$_makeDefaultPublishSettings,
		$_makeDefaultSubscribeSettings,
		$_makeMessage,
		$_makePromisePublisher,
		$_makePromiseSubscriber,
		$_makeSubscriber,
		$_makeSubscription,
		$_makeTopic,
		$_makeUnsubscribe,
		$_promiseSubscriber,
		$_publish,
		$_publishSettings,
		$_subscribe,
		$_subscribers,
		$_topics,
		$_topicIdByIndex,
		$_validatePublishSettings,
		$_validateSubscribeSettings
	} = $

const PubSubMixin = ( superclass ) => class PubSubMixin extends superclass {

	static [$_makeDefaultPublishSettings]() {
		return {
			usePromise: true,
			sync: false
		}
	}

	static [$_validatePublishSettings]( o ) {
		return _.hasOwnBooleans(o, 'usePromise', 'sync')
	}

	static [$_makeDefaultSubscribeSettings]() {
		return {
			usePromise: true,
			sync: false,
			sendAvailableMessage: false,
			active: true
		}
	}

	static [$_validateSubscribeSettings]( o ) {
		return _.hasOwnBooleans(o, 'usePromise', 'sync', 'sendAvailableMessage', 'active')
	}

	constructor( ...args ) {
		super(...args)
		this[$_initTopics]()
		this[$_publishSettings] = {}
	}

	publish( topicId, data, settings ) {
		_.nStr(topicId, 'Topic identifier required to publish')
		settings && _.nObj(settings, 'Settings must be an object to publish')

		if( !this[$_publishSettings][topicId] ) {
			this[$_publishSettings][topicId] = PubSubMixin[$_makeDefaultPublishSettings]()
		}

		if( settings ) {
			Object.assign(this[$_publishSettings][topicId], PubSubMixin[$_validatePublishSettings](settings))
		}

		let	{ sync,	usePromise,
			} = this[$_publishSettings][topicId],
			promise = null,
			timeoutId = null

		const
			topicIds = topicId.split(TOPIC_DEL),
			args = { topicIds, data, idIndex: 0, topic: this[$_topics] }

		if( sync ) {
			return this[$_publish](args)

		} else if( usePromise ) {
			promise = new Promise(( resolve ) => {
				timeoutId = setTimeout(() => resolve(this[$_publish](args)))
			})

		} else {
			timeoutId = setTimeout(this[$_publish].bind(this, args))
		}

		return { promise, timeoutId }
	}

	subscribe( topicId, fn, settings ) {
		_.nStr(topicId, 'Topic identifier required to subscribe')
		_.nFn(fn, 'Function required to subscribe')

		let validatedSettings = {}

		if( settings ) {
			_.nObj(settings, 'Settings must be an object to subscribe')
			
			Object.assign(validatedSettings, 
				PubSubMixin[$_makeDefaultSubscribeSettings](),
				PubSubMixin[$_validateSubscribeSettings](settings))
		}

		const
			topicIds = topicId.split(TOPIC_DEL),
			args = { topicIds, fn, ...validatedSettings,
				idIndex: 0,
				topic: this[$_topics]
			}

		return this[$_subscribe](args)
	}

	[$_initTopics]() {
		if( !this[$_topics] ) {
			this[$_topics] = this[$_makeTopic]()
		}
	}

	[$_addTopic]( topic, topicId, initialMessage ) {
		if( !topic.has(topicId) ) {
			topic.set(topicId, this[$_makeTopic](initialMessage))
		}

		return topic.get(topicId)
	}

	[$_makeTopic]( initialMessage ) {
		return new Map([
			[ $_message, initialMessage ],
			[ $_subscribers, new Map() ]
		])
	}

	[$_makeMessage]( payload ) {
		return {
			payload
		}
	}

	[$_publish]( args ) {
		const
			{ topicIds, topic, idIndex } = args,
			tLen = topicIds.length,
			artifacts = []

		if( !(idIndex === 0 && tLen === 1 && topicIds[0] === '')
			&& tLen > idIndex ) {
		
			const topicId = topicIds[idIndex]
			let nextTopic

			if( !topic.has(topicId) ) {
				nextTopic = this[$_addTopic](topic, topicId)
			
			} else {
				nextTopic = topic.get(topicId)
			}

			artifacts.push(...this[$_publish]({ ...args, 
				idIndex: idIndex + 1,
				topic: nextTopic
			}))
		}

		const
			topicId = this[$_topicIdByIndex](topicIds, idIndex),
			{ data } = args

		topic.set($_message, this[$_makeMessage](data))

		for( const [ sym, sub ] of topic.get($_subscribers) ) {
			if( sub.active ) {
				if( sub.usePromise && !sub.sync ) {
					artifacts.push(sub.fn(topicId, data))

				} else {
					sub.fn(topicId, data)
				}
			}
		}

		return artifacts
	}

	[$_makeControl]( args ) {
		return () => {
			const { subscriber, topicIds, idIndex, topic, active } = args
			subscriber.active = active === null ? !subscriber.active : !!active
			this[$_checkAndExecuteSubscriber](subscriber, topicIds, idIndex, topic)
		}
	}

	[$_makeUnsubscribe]( topic, token ) {
		return () => topic.get($_subscribers).delete(token)
	}

	[$_makeAsyncSubscriber]( fn ) {
		return ( topicId, data ) => setTimeout(fn, 0, topicId, data)
	}

	[$_makePromiseSubscriber]( fn ) {
		return this[$_promiseSubscriber].bind(this, fn)
	}

	[$_promiseSubscriber]( fn, topicId, data ) {
		let timeoutId
		const promise = new Promise(( resolve ) => {
			timeoutId = setTimeout(resolve, 0, data)
		})

		const artifacts = { promise, timeoutId }

		fn(topicId, artifacts)

		return artifacts
	}

	[$_makeSubscriber]( args ) {
		const
			{ fn: subFn, usePromise, sync, active, sendAvailableMessage } = args,
			fn = sync ? subFn : usePromise
				? this[$_makePromiseSubscriber](subFn)
				: this[$_makeAsyncSubscriber](subFn)

		return { usePromise, sync, active, sendAvailableMessage, fn }
	}

	[$_topicIdByIndex]( topicIds, idIndex ) {
		return topicIds.slice(0, idIndex).join(TOPIC_DEL)
	}

	[$_checkAndExecuteSubscriber]( subscriber, topicIds, idIndex, topic ) {
		if( subscriber.active && subscriber.sendAvailableMessage ) {
			const message = topic.get($_message)

			if( message ) {
				const topicId = this[$_topicIdByIndex](topicIds, idIndex)
				subscriber.fn(topicId, message.payload)
			}
		}
	}

	[$_makeSubscription]( args ) {
		const
			{ topicIds, fn, usePromise, sync, sendAvailableMessage,
			active, topic, idIndex } = args,
			token = Symbol(),
			subscriber = this[$_makeSubscriber]({ fn, usePromise, sync, active, sendAvailableMessage })

		topic.get($_subscribers).set(token, subscriber)

		this[$_checkAndExecuteSubscriber](subscriber, topicIds, idIndex, topic)
		
		const ctrlArgs = { subscriber, topicIds, idIndex, topic, active: true }

		return {
			on: this[$_makeControl](ctrlArgs),
			off: this[$_makeControl](( ctrlArgs.active = false, ctrlArgs )),
			toggle: this[$_makeControl](( ctrlArgs.active = null, ctrlArgs )),
			unsubscribe: this[$_makeUnsubscribe](subscriber, token)
		}
	}

	[$_subscribe]( args ) {
		const
			{ topicIds, idIndex } = args,
			tLen = topicIds.length

		if( (idIndex === 0 && tLen === 1 && topicIds[0] === '')
			|| topicIds.length <= idIndex ) {

			return this[$_makeSubscription](args)

		} else {
			let nextTopic
			const
				{ topic } = args,
				topicId = topicIds[idIndex]

			if( !topic.has(topicId) ) {
				nextTopic = this[$_addTopic](topic, topicId)

			} else {
				nextTopic = topic.get(topicId)
			}

			return this[$_subscribe]({ ...args,
				idIndex: idIndex + 1,
				topic: nextTopic
			})
		}
	}

}

export { PubSubMixin, $ }

