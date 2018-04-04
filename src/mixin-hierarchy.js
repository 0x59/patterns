
import Symbols from './module-symbols.js'

const
	$ = Symbols(), {
		$_apply,
		$_cache,
		$_superclass
	},
	cache = new Map()

class MixinHierarchy {

	constructor( superclass ) {
		this[$_superclass] = superclass
		this[$_cache] = cache
	}

	[$_apply]( hierarchy, mixin ) {
		if( !this[$_cache].has(hierarchy) ) {
			this[$_cache].set(hierarchy, new Map())
		}

		this[$_cache] = this[$_cache].get(hierarchy)

		if( !this[$_cache].has(mixin) ) {
			this[$_cache].set(mixin, mixin(hierarchy))
		}

		return this[$_cache].get(mixin)
	}

	withMixins( ...mixins ) {
		return mixins.reduce(this[$_apply].bind(this), this[$_superclass])
	}
	// where mixin returns a class extending the parameter
	// e.g., mixin = superclass => class extends superclass { }
}

const superclass = superclass => new MixinHierarchy(superclass)

export { superclass }

