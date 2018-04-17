'use strict';

const
	TYPES = {
		STR: 'string',
		FN: 'function',
		OBJ: 'object',
		NUM: 'number',
		BOOL: 'boolean',
		SYM: 'symbol',
		UNDEF: 'undefined'
	},
	UCHAR = {
		copyright: '\u00a9',
		asterisk: '\u002a'
	},
	doc = document,
	body = doc.body

const { STR, FN, OBJ, NUM, BOOL, SYM, UNDEF } = TYPES

const util = {

	isFn( fn ) {
		return typeof fn === FN
	},
	
	nFn( fn ) {
		return typeof fn !== FN
	},

	nObj( obj ) {
		return typeof obj !== OBJ
	},

	isDef( val ) {
		return typeof val !== UNDEF
	},

	nDef( val ) {
		return typeof val === UNDEF
	},

	isStr( arg ) {
		return typeof arg === STR
	},
	
	nStr( arg ) {
		return typeof arg !== STR
	},

	isEl( el ) {
		return el instanceof HTMLElement
	},

	nEl( el ) {
		return !(el instanceof HTMLElement)
	},

	nArr( arr ) {
		return !Array.isArray(arr)
	},

	isArrayOf( arr, type ) {
		if( util.nArr(arr) ) throw new Error('Not an array')
		if( util.nStr(type) ) throw new Error('Not a string')

		for( const v of arr ) {
			if( typeof v !== type ) return false
		}
		return true
	},

	hasOwnBooleans( o, filter ) {
		let result = {}

		if( util.nObj(o) ) throw new Error('Not an object')

		if( filter ) {
			if( !util.isArrayOf(filter, STR) ) {
				throw new Error('Filter not array of strings')
			}

			for( const k of filter ) {
				if( Object.prototype.hasOwnProperty.call(o, k) ) result[k] = !!o[k]
			}

		} else {
			for( const k of Object.keys(o) ) {
				result[k] = !!o[k]
			}
		}

		return result
	}
	
}

Object.freeze(TYPES)
Object.freeze(UCHAR)
Object.freeze(util)

export { 
	TYPES,
	UCHAR,
	util
}

