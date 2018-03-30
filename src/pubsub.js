
import _ from './utility.js'
import Symbols from './module-symbols.js'

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
		$_data
	} = $

export default ( superclass ) => class extends superclass {

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
			this[$_topics] = new Map()
		}
	}

	[$_addTopic]( topic, initialData ) {
		if( !this[$_topics].has(topic) ) {
			this[$_topics].set(topic, this[$_makeTopic](initialData))
		}

		return this[$_topics].get(topic)
	}

	[$_makeTopic]( data ) {
		return new Map([
			[ [$_data], data ],
			[ [$_subscribers], new Map() ]
		])
	}

	[$_publish]( args ) {
		const { topicIds, topic, idIndex } = args

		if( topicIds.length > idIndex ) {
			const topicId = topicIds[idIndex]
			let nextTopic

			if( !topic.has(topicId) {
				nextTopic = this[$_addTopic](topicId)
			
			} else {
				nextTopic = topic.get(topicId)
			}

			this[$_publish]({ ...args, 
				idIndex: index + 1,
				topic: nextTopic
			})
		}

		const
			topicId = topicIds.slice(0, idIndex).join(TOPIC_DEL),
			{ data } = args

		topic[$_data] = data

		for( const sub of topic[$_subscribers] ) {
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
		return () => topic[$_subscribers].delete(token)
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
			subscriber = [$_makeSubscriber](fn, sync, active))
		
		topic[$_subscribers].set(token, subscriber)

		if( sendLastMessage ) {
			const topicId = topicIds.slice(0, idIndex).join(TOPIC_DEL)
			subscriber.fn(topicId, topic[$_data])
		}

		return {
			on: [$_makeOn](subscriber, token),
			off: [$_makeOff](subscriber, token),
			toggle: [$_makeToggle](subscriber, token),
			unsubscribe: [$_makeUnsubscribe](subscriber, token)
		}
	}

	[$_subscribe]( args ) {
		const { topicIds, idIndex } = args

		if( topicIds.length <= idIndex ) {
			return [$_makeSubscription](args)

		} else {
			let nextTopic
			const
				{ topic } = args,
				topicId = topicIds[idIndex]

			if( !topic.has(topicId) {
				nextTopic = this[$_addTopic](topicId)

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

