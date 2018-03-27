
import _ from './utility.js'
import Symbols from './symbols.js'

const
	$ = Symbols(), {
		$_initTopics: $._initTopics,
		$_makeTopic: $._makeTopic,
		$_addTopic: $._addTopic,
		$_topics: $._topics
	} = $

export default ( superclass ) => class extends superclass {

	[$_initTopics]() {
		if( !this[$_topics] ) {
			this[$_topics] = new Map()
		}
	}
	
	[$_makeTopic]( data ) {
		return {
			data,
			subscribers: []
		}
	}

	[$_addTopic]( name, initialData ) {
		if( !this[$_topics].has(name) ) {
			this[$_topics].set(name, this[$_makeTopic](initialData))
		}

		return this[$_topics].get(name)
	}
/*
	[$_asyncPublish]( topic, fn, data ) {
		setTimeout(fn.bind(this, topic, data))
	}
*/
	publish( name, data, async = true ) {
		let topic
		
		if( _.nStr(name) ) {
			throw new Error('Topic required to publish')
		}

		if( this[$_topics].has(name) ) {
			topic = this[$_topics].get(name)
		
			if( async ) {
				for( const fn of topic.subscribers ) {
					setTimeout(fn.bind(null, topic, data))
				}
				
			} else {
				for( const fn of topic.subscribers ) {
					fn(topic, data)
				}
			}

		} else {
			topic = this[$_addTopic](name)
		}

		topic.data = data
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

