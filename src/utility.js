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

