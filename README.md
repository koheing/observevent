# Observent
Event Observer inspired by [svelte/store](https://github.com/sveltejs/svelte) and [rxjs](https://github.com/ReactiveX/rxjs)

## Installation
```
npm i observevent
```

## Usage

### `subjectify`
```ts
import { subjectify } from 'observevent'

const food = subjectify('')
const unsubscribe = food.subscribe(console.log)

food.notify('apple')
food.notify((it) => it + ' pie')

unsubscribe()

// Output
// ----------
// ''
// 'apple'
// 'apple pie'
```

### `observify`
```ts
import { observify, select } from 'observevent'
import { EventEmitter } from 'events'

const emitter = new EventEmitter()

const logger = {
  info: (...args: unknown[]) => console.log('[food]', ...args)
}

function isPie(food: string): boolean {
  return food.indexOf('pie') > -1
}

const food = observify('', (trigger) => {
  emitter.on('food', trigger)
  return () => emitter.removeAllListener('food')
}, /** Option **/  { logging: true, logger, diff: true })

const unsubscribe = select(food, isPie).subscribe((it) => it)

emitter.emit('food', 'apple')

unsubscribe()

// Output
// ----------
// '[food] ["", undefined]'
// '[food] ["apple", ""]'
```

## Options
`observify` and `subjectify` and `combine` and `combineMap` have the following options:

### `diff`
Setting `diff` to `true` will notify you of the values ​​before and after the change.  
Default value is `false`.  
```ts
import { subjectify } from 'observevent'

const food = subjectify('', { diff: true })
const unsubscribe = food.subscribe((it) => console.log(it))

food.notify('apple')
food.notify((it) => it + ' pie')

unsubscribe()

// Output
// ----------
// ['', undefined]
// ['apple', '']
// ['apple pie', 'apple']
```

### `logging`
Setting `logging` to `true` will output changelog.  
Default value is `false`.  
```ts
import { subjectify } from 'observevent'

const food = subjectify('', { logging: true })
const unsubscribe = food.subscribe((it) => it)

food.notify('apple')
food.notify((it) => it + ' pie')

unsubscribe()

// Output
// ----------
// { before: undefined, after: '' }
// { before: '', after: 'apple' }
// { before: 'apple', after: 'apple pie' }
```

### `logger`
You can set a custom logger.
```ts
import { subjectify } from 'observevent'

const logger = {
  info: (value: unknown) => console.log('[food]', value)
}

const food = subjectify('', { logging: true, logger })
const unsubscribe = food.subscribe((it) => it)

food.notify('apple')
food.notify((it) => it + ' pie')

unsubscribe()

// Output
// ----------
// [food] { before: undefined, after: '' }
// [food] { before: '', after: 'apple' }
// [food] { before: 'apple', after: 'apple pie' }
```

### `immediate`
If `immediate` is set to `false`, the current value will not be notified and will be notified from changes after subscription.  
Default value is `true`.  
```ts
import { subjectify } from 'observevent'

const food = subjectify('', { immediate: false })
const unsubscribe = food.subscribe(console.log)

food.notify('apple')
food.notify((it) => it + ' pie')

unsubscribe()

// Output
// ----------
// 'apple'
// 'apple pie'
```

## Derives
- [map](https://github.com/koheing/observevent/blob/main/src/derives/map.ts)
- [select](https://github.com/koheing/observevent/blob/main/src/derives/select.ts)
- [exclude](https://github.com/koheing/observevent/blob/main/src/derives/exclude.ts)
- [combine](https://github.com/koheing/observevent/blob/main/src/derives/combine.ts)
- [combineMap](https://github.com/koheing/observevent/blob/main/src/derives/combinemap.ts)
- [diff](https://github.com/koheing/observevent/blob/main/src/derives/diff.ts)