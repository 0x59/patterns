
import _ from './utility.js'
import Symbols from './symbols.js'

const
	TOPIC_DEL = '/',
	$ = Symbols(), {
		$_initTopics: $._initTopics,
		$_makeTopic: $._makeTopic,
		$_addTopic: $._addTopic,
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
			[ [$_subscribers], [] ]
		])
	}

	[$_addTopic]( topic, initialData ) {
		if( !this[$_topics].has(topic) ) {
			this[$_topics].set(topic, this[$_makeTopic](initialData))
		}

		return this[$_topics].get(topic)
	}
/*
	[$_asyncPublish]( topic, fn, data ) {
		setTimeout(fn.bind(this, topic, data))
	}
*/
	[$_publish]( params ) {
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
				setTimeout(fn.bind(null, topic, data))
			}

		} else {
			for( const fn of topic[$_subscribers] ) {
				fn(topic, data))
			}
		}
	}

	/*[$_publish]( params ) {
		const { topicIds, data, topic, async, idIndex } = params

		if( topicIds.length === idIndex ) {
			topic[$_data] = data

			if( async ) {
				for( const fn of topic[$_subscribers] ) {
					setTimeout(fn.bind(null, topic, data))
				}

			} else {
				for( const fn of topic[$_subscribers] ) {
					fn(topic, data))
				}
			}
		
		} else {
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
	}*/

	publish( topicId, data, async = true ) {
		if( _.nStr(topicId) ) {
			throw new Error('Topic required to publish')
		}

		const topicIds = topicId.split(TOPIC_DEL)

		this[$_publish]({ topicIds, data, async, idIndex: 0, topic: this[$_topics] })
	}

	subscribe( name, fn, callImmediately = false ) {
		let topic

		if( _.nStr(name) ) {
			throw new Error('Topic required to subscribe')
		}

		if( _.nFn(fn) ) {
			throw new Error('Function required to subscribe')
		}
		
		if( this[$_topics].has(name) ) {
			topic = this[$_topics].get(name)
		
			if( topic.data !== void 0 && callImmediately ) {
				fn(name, topic.data)
			}
		
		} else {
			topic = this[$_addTopic](name)
		}

		topic.subscribers.push(fn)
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

