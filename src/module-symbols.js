
const Symbols = () => {
	return new Proxy({}, {
		get( registry, name ) {
			return registry[name] || ( registry[name] = Symbol(name) )
		}
	})
}

export { Symbols }

