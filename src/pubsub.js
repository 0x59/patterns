
import _ from './utility.js'
import Symbols from './symbols.js'

const
	TOPIC_DEL = '/',
	$ = Symbols(), {
		$_initTopics: $._initTopics,
		$_addTopic: $._addTopic,
		$_makeTopic: $._makeTopic,
		$_makeSubscriber: $._makeSubscriber,
		$_makeSubscription: $._makeSubscription,
		$_topics: $._topics,
		$_subscribers: $._subscribers,
		$_data: $._data
	} = $

export default ( superclass ) => class extends superclass {

	[$_initTopics]() {
		if( !this[$_topics] ) {
			this[$_topics] = new Map()
		}
	}
	
	[$_makeTopic]( data ) {
		return new Map([
			[ [$_data], data ],
			[ [$_subscribers], new Map() ]
		])
	}

	[$_addTopic]( topic, initialData ) {
		if( !this[$_topics].has(topic) ) {
			this[$_topics].set(topic, this[$_makeTopic](initialData))
		}

		return this[$_topics].get(topic)
	}

/*	[$_publish]( params ) {
		const { topicIds, data, topic, async, idIndex } = params

		if( topicIds.length > idIndex ) {
			const topicId = topicIds[idIndex]
			let nextTopic

			if( !topic.has(topicId) {
				nextTopic = this[$_addTopic](topicId)
			
			} else {
				nextTopic = topic.get(topicId)
			}

			this[$_publish]({ topicIds, data, async,
				idIndex: index + 1,
				topic: nextTopic
			})
		}

		topic[$_data] = data

		if( async ) {
			for( const fn of topic[$_subscribers] ) {
				setTimeout(fn.bind(null, topicIds, data))
			}

		} else {
			for( const fn of topic[$_subscribers] ) {
				fn(topicIds, data))
			}
		}
	}
*/
	[$_publish]( params ) {
		const { topicIds, data, topic, idIndex } = params

		if( topicIds.length > idIndex ) {
			const topicId = topicIds[idIndex]
			let nextTopic

			if( !topic.has(topicId) {
				nextTopic = this[$_addTopic](topicId)
			
			} else {
				nextTopic = topic.get(topicId)
			}

			this[$_publish]({ topicIds, data,
				idIndex: index + 1,
				topic: nextTopic
			})
		}

		topic[$_data] = data

		for( const fn of topic[$_subscribers] ) {
			fn(topicIds, data))
		}
	}

	publish( topicId, data, async = true ) {
		if( _.nStr(topicId) ) {
			throw new Error('Topic identifier required to publish')
		}

		const
			topicIds = topicId.split(TOPIC_DEL),
			pubArgs = { topicIds, data, idIndex: 0, topic: this[$_topics] }

		if( async ) {
			setTimeout(this[$_publish].bind(this, pubArgs))
		
		} else {
			this[$_publish](pubArgs)
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

	[$_asyncSubscribe]( fn ) {
		return ( data ) => setTimeout(fn.bind(null, data))
	}

	[$_makeSubscriber]( subFn, async, active ) {
		const fn = async ? this[$_asyncSubscribe](subFn) : subFn

		return { active, fn }
	}

	[$_makeSubscription]( topic, fn, async, active = true ) {
		const
			token = Symbol(),
			subscriber = [$_makeSubscriber](fn, async))
		
		topic[$_subscribers].set(token, subscriber)

		return {
			on: [$_makeOn](subscriber, token),
			off: [$_makeOff](subscriber, token),
			toggle: [$_makeToggle](subscriber, token),
			unsubscribe: [$_makeUnsubscribe](subscriber, token)
		}
	}

	[$_subscribe]( params ) {
		const { topicIds, fn, async, topic, idIndex } = params

		if( topicIds.length <= idIndex ) {
			return [$_makeSubscription](topic, fn, async)

		} else {
			const topicId = topicIds[idIndex]
			let nextTopic

			if( !topic.has(topicId) {
				nextTopic = this[$_addTopic](topicId)

			} else {
				nextTopic = topic.get(topicId)
			}

			return this[$_subscribe]({ topicIds, fn,
					idIndex: index + 1,
					topic: nextTopic
				})
		}
	}

	subscribe( topicId, fn, async = true, sendLastMessage = false ) {
		if( _.nStr(topicId) ) {
			throw new Error('Topic identifier required to subscribe')
		}

		if( _.nFn(fn) ) {
			throw new Error('Function required to subscribe')
		}

		const
			topicIds = topicId.split(TOPIC_DEL),
			subArgs = { topicIds, fn, async, idIndex: 0, topic: this[$_topics] }

		return this[$_subscribe](subArgs)
/*
		if( this[$_topics].has(name) ) {
			topic = this[$_topics].get(name)
		
			if( topic.data !== void 0 && sendLastMessage ) {
				fn(name, topic.data)
			}
		
		} else {
			topic = this[$_addTopic](name)
		}

		topic.subscribers.push(fn)
*/
	}

	unsubscribe( name, fn ) {
		let topic

		if( _.nStr(name) ) {
			throw new Error('Topic name required to unsubscribe')
		}

		if( _.nFn(fn) ) {
			throw new Error('Function required to unsubscribe')
		}

		if( this[$_topics].has(name) ) {
			let index,
				topic = this[$_topics].get(name)
				
			while( (index = topic.subscribers.indexOf(fn)) > -1 ) {
				topic.subscribers.splice(index, 1)
			}
		}
	}

}

