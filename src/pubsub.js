
import { util as _ } from './utility.js'
import { Symbols } from './module-symbols.js'

const
	TOPIC_DEL = '/',
	$ = Symbols(), {
		$_initTopics,
		$_addTopic,
		$_makeTopic,
		$_makeOn,
		$_makeOff,
		$_makeToggle,
		$_makeUnsubscribe,
		$_makeAsyncSubscriber,
		$_makeSubscriber,
		$_makeSubscription,
		$_topics,
		$_subscribers,
		$_data,
		$_publish,
		$_subscribe
	} = $

const PubSubMixin = ( superclass ) => class extends superclass {

	constructor( ...args ) {
		super(...args)
		this[$_initTopics]()
	}

	publish( topicId, data, sync = false ) {
		if( _.nStr(topicId) ) {
			throw new Error('Topic identifier required to publish')
		}

		const
			topicIds = topicId.split(TOPIC_DEL),
			args = { topicIds, data, idIndex: 0, topic: this[$_topics] }

		if( sync ) {
			this[$_publish](args)

		} else {
			setTimeout(this[$_publish].bind(this, args))
		}
	}

	subscribe( topicId, fn, sync = false, sendLastMessage = false, active = true ) {
		if( _.nStr(topicId) ) {
			throw new Error('Topic identifier required to subscribe')
		}

		if( _.nFn(fn) ) {
			throw new Error('Function required to subscribe')
		}

		const
			topicIds = topicId.split(TOPIC_DEL),
			args = { topicIds, fn, sync, sendLastMessage, active,
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

	[$_addTopic]( topic, topicId, initialData ) {
		if( !topic.has(topicId) ) {
			topic.set(topicId, this[$_makeTopic](initialData))
		}

		return topic.get(topicId)
	}

	[$_makeTopic]( data ) {
		return new Map([
			[ $_data, data ],
			[ $_subscribers, new Map() ]
		])
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
			topicId = topicIds.slice(0, idIndex).join(TOPIC_DEL),
			{ data } = args

		topic.set($_data, data)

		for( const sub of topic.get($_subscribers) ) {
			if( sub.active ) {
				sub.fn(topicId, data)
			}
		}
	}

	[$_makeOn]( subscriber, token ) {
		return () => subscriber.active = true
	}

	[$_makeOff]( subscriber, token ) {
		return () => subscriber.active = false 
	}

	[$_makeToggle]( subscriber, token ) {
		return () => subscriber.active = !subscriber.active
	}

	[$_makeUnsubscribe]( topic, token ) {
		return () => topic.get($_subscribers).delete(token)
	}

	[$_makeAsyncSubscriber]( fn ) {
		return ( topicId, data ) => setTimeout(fn.bind(null, topicId, data))
	}

	[$_makeSubscriber]( subFn, sync, active ) {
		const fn = sync ? subFn : this[$_makeAsyncSubscriber](subFn)

		return { active, fn }
	}

	[$_makeSubscription]( args ) {
		const
			{ fn, sync, sendLastMessage, active, topic } = args,
			token = Symbol(),
			subscriber = this[$_makeSubscriber](fn, sync, active)
		
		topic.get($_subscribers).set(token, subscriber)

		if( sendLastMessage ) {
			const topicId = topicIds.slice(0, idIndex).join(TOPIC_DEL)
			subscriber.fn(topicId, topic.get($_data))
		}

		return {
			on: this[$_makeOn](subscriber, token),
			off: this[$_makeOff](subscriber, token),
			toggle: this[$_makeToggle](subscriber, token),
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

