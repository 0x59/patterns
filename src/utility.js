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
	INVALID_ARGUMENT = 'Invalid argument.',
	doc = document,
	body = doc.body

class InvalidType extends Error {}

function __throwIs( type, msg = '' ) {
	throw new InvalidType(`Invalid type. Expected: [${type}];${msg ? ' '+msg : ''}`)
}

function __throwNot( type, msg = '' ) {
	throw new InvalidType(`Invalid type. Not expected: [${type}];${msg ? ' '+msg : ''}`)
}

const { STR, FN, OBJ, NUM, BOOL, SYM, UNDEF } = TYPES

const util = {

	isFn( fn, msg ) {
		const t = typeof fn === FN
		return t ? t : msg ? __throwIs(FN, msg) : t
	},
	
	nFn( fn, msg ) {
		const t = typeof fn !== FN
		return t ? msg ? __throwIs(FN, msg) : t : t
	},
	
	isObj( obj, msg ) {
		const t = typeof obj === OBJ
		return t ? t : msg ? __throwIs(OBJ, msg) : t
	},

	nObj( obj, msg ) {
		const t = typeof obj !== OBJ
		return t ? msg ? __throwIs(OBJ, msg) : t : t
	},

	isDef( val, msg ) {
		const t = typeof val !== UNDEF
		return t ? t : msg ? __throwNot(UNDEF, msg) : t
	},

	nDef( val, msg ) {
		const t = typeof val === UNDEF
		return t ? msg ? __throwNot(UNDEF, msg) : t : t
	},

	isStr( arg, msg ) {
		const t = typeof arg === STR
		return t ? t : msg ? __throwIs(STR, msg) : t
	},
	
	nStr( arg, msg ) {
		const t = typeof arg !== STR
		return t ? msg ? __throwIs(STR, msg) : t : t
	},

	isEl( el ) {
		const t = el instanceof HTMLElement
		return t ? t : msg ? __throwIs('HTMLElement', msg) : t
	},

	nEl( el ) {
		const t = !(el instanceof HTMLElement)
		return t ? msg ? __throwIs('HTMLElement', msg) : t : t
	},

	isArr( arr, msg ) {
		const t = Array.isArray(arr)
		return t ? t : msg ? __throwIs('Array', msg) : t
	},

	nArr( arr, msg ) {
		const t = !Array.isArray(arr)
		return t ? msg ? __throwIs('Array', msg) : t : t
	},

	isArrayOf( arr, type, msg ) {
		util.nArr(arr, INVALID_ARGUMENT)
		util.nStr(type, INVALID_ARGUMENT)

		let t = true
		for( const v of arr ) {
			if( typeof v !== type ) {
				t = false
				break
			}
		}
		return t ? t : msg ? __throwIs(type, msg) : t
	},

	nArrayOf( arr, type, msg ) {
		util.nArr(arr, INVALID_ARGUMENT)
		util.nStr(type, INVALID_ARGUMENT)

		let t = true
		for( const v of arr ) {
			if( typeof v === type ) {
				t = false
				break
			}
		}
		return t ? msg ? __throwIs(type, msg) : t : t
	},

	hasOwnBooleans( o, ...props ) {
		const result = {}

		util.nObj(o, INVALID_ARGUMENT)

		if( props ) {
			util.isArrayOf(props, STR, INVALID_ARGUMENT)

			for( const k of props ) {
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
	util,
	InvalidType
}

