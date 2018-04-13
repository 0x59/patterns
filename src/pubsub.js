
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
		$_makeMessage,
		$_makeSubscriber,
		$_makeSubscription,
		$_makeTopic,
		$_makeUnsubscribe,
		$_publish,
		$_publishSync,
		$_subscribe,
		$_subscribers,
		$_topics,
		$_topicIdByIndex
	} = $

const PubSubMixin = ( superclass ) => class extends superclass {

	constructor( ...args ) {
		super(...args)
		this[$_initTopics]()
		this[$_publishSync] = {}
	}

	publish( topicId, data, ...sync ) {
		if( _.nStr(topicId) ) {
			throw new Error('Topic identifier required to publish')
		}

		const
			topicIds = topicId.split(TOPIC_DEL),
			args = { topicIds, data, idIndex: 0, topic: this[$_topics] }

		let executeNow

		if( sync.length ) {
			executeNow = this[$_publishSync][topicId] = !!sync[0]
	
		} else {
			executeNow = this[$_publishSync][topicId]
		}

		if( executeNow ) {
			this[$_publish](args)

		} else {
			let timeoutId,
				pubFn = this[$_makeAsyncPublisher](args)

			const promise = new Promise(( resolve, reject ) => {
				timeoutId = setTimeout(pubFn, 0, resolve, reject)
			})

			return { promise, timeoutId }
		}
	}

	subscribe( topicId, fn, sync = false, sendAvailableMessage = false, active = true ) {
		if( _.nStr(topicId) ) {
			throw new Error('Topic identifier required to subscribe')
		}

		if( _.nFn(fn) ) {
			throw new Error('Function required to subscribe')
		}

		const
			topicIds = topicId.split(TOPIC_DEL),
			args = { topicIds, fn, sync, sendAvailableMessage, active,
				idIndex: 0,
				topic: this[$_topics]
			}

		return this[$_subscribe](args)
	}

	[$_makeAsyncPublisher]( args ) {
		return ( resolve, reject ) => {
				this[$_publish](args)
				resolve()
			}
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
			tLen = topicIds.length

		if( !(idIndex === 0 && tLen === 1 && topicIds[0] === '')
			&& tLen > idIndex ) {
		
			const topicId = topicIds[idIndex]
			let nextTopic

			if( !topic.has(topicId) ) {
				nextTopic = this[$_addTopic](topic, topicId)
			
			} else {
				nextTopic = topic.get(topicId)
			}

			this[$_publish]({ ...args, 
				idIndex: idIndex + 1,
				topic: nextTopic
			})
		}

		const
			topicId = this[$_topicIdByIndex](topicIds, idIndex),
			{ data } = args

		topic.set($_message, this[$_makeMessage](data))

		for( const [ sym, sub ] of topic.get($_subscribers) ) {
			if( sub.active ) {
				sub.fn(topicId, data)
			}
		}
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
		return ( topicId, data ) => setTimeout(fn.bind(null, topicId, data))
	}

	[$_makeSubscriber]( subFn, sync, active, sendAvailableMessage ) {
		const fn = sync ? subFn : this[$_makeAsyncSubscriber](subFn)

		return { active, sendAvailableMessage, fn }
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
			{ topicIds, fn, sync, sendAvailableMessage, active, topic, idIndex } = args,
			token = Symbol(),
			subscriber = this[$_makeSubscriber](fn, sync, active, sendAvailableMessage)
		
		topic.get($_subscribers).set(token, subscriber)

		this[$_checkAndExecuteSubscriber](subscriber, topicIds, idIndex, topic)
		
		return {
			on: this[$_makeControl]({ subscriber, topicIds, idIndex, topic, active: true }),
			off: this[$_makeControl]({ subscriber, topicIds, idIndex, topic, active: false }),
			toggle: this[$_makeControl]({ subscriber, topicIds, idIndex, topic, active: null }),
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

