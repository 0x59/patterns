# patterns
## PubSub Mixin
- Hierarchical topics
- Async/sync publish
- Async/sync subscribe
- Symbol-based, pseudo-private mixin methods and properties to avoid class collisions
- Returns subscription interface with on, off, toggle, and unsubscribe functions
## Module Symbols Registry
- Uses Proxy to create a symbol registry for use in modules
- Symbols are created on first reference and later returned
