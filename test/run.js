
import './chai/chai.js'

import './module-symbols.test.js'
import './mixin-hierarchy.test.js'
import './pubsub.test.js'

mocha.checkLeaks()
mocha.run()

