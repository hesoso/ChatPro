```markdown
# API

- [类 `Database`](#class-database)
- [类 `Statement`](#class-statement)
- [类 `SqliteError`](#class-sqliteerror)
- [绑定参数](#binding-parameters)

# 类 *Database*

- [new Database()](#new-databasepath-options)
- [Database#prepare()](#preparestring---statement) (参见 [`Statement`](#class-statement))
- [Database#transaction()](#transactionfunction---function)
- [Database#pragma()](#pragmastring-options---results)
- [Database#backup()](#backupdestination-options---promise)
- [Database#serialize()](#serializeoptions---buffer)
- [Database#function()](#functionname-options-function---this)
- [Database#aggregate()](#aggregatename-options---this)
- [Database#table()](#tablename-definition---this)
- [Database#loadExtension()](#loadextensionpath-entrypoint---this)
- [Database#exec()](#execstring---this)
- [Database#close()](#close---this)
- [属性](#properties)

### new Database(*path*, [*options*])

创建新的数据库连接。如果数据库文件不存在，会自动创建。该操作是同步的，意味着你可以立即开始执行查询。可以通过传入`":memory:"`作为第一个参数来创建[内存数据库](https://www.sqlite.org/inmemorydb.html)。通过传入空字符串（或省略所有参数）可以创建临时数据库。

> 也可以通过传入[`.serialize()`](#serializeoptions---buffer)返回的Buffer来创建内存数据库，而不是传入字符串作为第一个参数。

接受以下选项：

- `options.readonly`: 以只读模式打开数据库连接（默认：`false`）。

- `options.fileMustExist`: 如果数据库不存在，会抛出`Error`而不是创建新文件。对于内存数据库、临时数据库或只读数据库连接会忽略此选项（默认：`false`）。

- `options.timeout`: 在抛出`SQLITE_BUSY`错误前，等待锁定数据库执行查询的毫秒数（默认：`5000`）。

- `options.verbose`: 提供一个函数，每次数据库连接执行SQL语句时会调用该函数（默认：`null`）。

- `options.nativeBinding`: 如果使用复杂的构建系统移动、转换或合并JS文件，`better-sqlite3`可能无法定位其原生C++插件（`better_sqlite3.node`）。如果遇到类似[此错误](https://github.com/JoshuaWise/better-sqlite3/issues/534#issuecomment-757907190)，可以通过此选项提供`better_sqlite3.node`的文件路径（相对于当前工作目录）来解决。

```js
const Database = require('better-sqlite3');
const db = new Database('foobar.db', { verbose: console.log });
```

### .prepare(*string*) -> *Statement*

从给定的SQL字符串创建新的预处理[`Statement`](#class-statement)。

```js
const stmt = db.prepare('SELECT name, age FROM cats');
```

### .transaction(*function*) -> *function*

创建一个始终在[事务](https://sqlite.org/lang_transaction.html)中运行的函数。当函数被调用时，会开始新事务。当函数返回时，事务会被提交。如果抛出异常，事务会回滚（异常会正常传播）。

```js
const insert = db.prepare('INSERT INTO cats (name, age) VALUES (@name, @age)');

const insertMany = db.transaction((cats) => {
  for (const cat of cats) insert.run(cat);
});

insertMany([
  { name: 'Joey', age: 2 },
  { name: 'Sally', age: 4 },
  { name: 'Junior', age: 1 },
]);
```

事务函数可以从其他事务函数内部调用。此时内部事务会成为[保存点](https://www.sqlite.org/lang_savepoint.html)。

如果在嵌套事务函数中抛出错误，嵌套事务函数会回滚到保存点之前的状态并重新抛出错误。如果外部事务函数没有捕获错误，外部事务函数也会回滚。

```js
const newExpense = db.prepare('INSERT INTO expenses (note, dollars) VALUES (?, ?)');

const adopt = db.transaction((cats) => {
  newExpense.run('adoption fees', 20);
  insertMany(cats); // 嵌套事务
});
```

事务还提供`deferred`、`immediate`和`exclusive`版本。

```js
insertMany(cats); // 使用"BEGIN"
insertMany.deferred(cats); // 使用"BEGIN DEFERRED"
insertMany.immediate(cats); // 使用"BEGIN IMMEDIATE"
insertMany.exclusive(cats); // 使用"BEGIN EXCLUSIVE"
```

传递给事务函数的任何参数都会转发给包装函数，包装函数返回的任何值也会通过事务函数返回。包装函数还可以访问与事务函数相同的[`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)绑定。

#### 注意事项

如果想手动管理事务，可以使用常规的[预处理语句](#preparestring---statement)（使用`BEGIN`、`COMMIT`等）。但是，不应将手动管理的事务与此`.transaction()`方法管理的事务混合使用。换句话说，不支持在事务函数内部使用原始`COMMIT`或`ROLLBACK`语句。

事务函数不适用于async函数。从技术上讲，async函数在第一个`await`后就会返回，这意味着事务在异步代码执行前已经提交。此外，由于SQLite会序列化所有事务，在事件循环的不同阶段保持事务开放通常是非常糟糕的做法。

需要知道的是，SQLite有时会在我们没有要求的情况下回滚事务。这可能由于[`ON CONFLICT`](https://sqlite.org/lang_conflict.html)子句、[`RAISE()`](https://www.sqlite.org/lang_createtrigger.html)触发器函数或某些错误（如`SQLITE_FULL`或`SQLITE_BUSY`）导致。换句话说，如果在事务中捕获SQLite错误，必须意识到之后执行的SQL可能不在同一事务中。通常，这种情况下最佳做法是重新抛出错误，退出事务函数。

```js
try {
  ...
} catch (err) {
  if (!db.inTransaction) throw err; // (事务被强制回滚)
  ...
}
```

### .pragma(*string*, [*options*]) -> *results*

执行给定的PRAGMA并返回结果。默认情况下，返回值是结果行的数组。每行由对象表示，键对应列名。

由于大多数PRAGMA语句返回单个值，提供`simple`选项来简化操作。当`simple`为`true`时，只返回第一行第一列的值。

```js
db.pragma('cache_size = 32000');
console.log(db.pragma('cache_size', { simple: true })); // => 32000
```

如果执行PRAGMA失败，会抛出`Error`。

执行PRAGMA时最好使用此方法而不是常规的[预处理语句](#preparestring---statement)，因为此方法规范化了一些可能遇到的异常行为。SQLite PRAGMA文档可在[此处](https://www.sqlite.org/pragma.html)找到。

### .backup(*destination*, [*options*]) -> *promise*

启动数据库的[备份](https://www.sqlite.org/backup.html)，返回备份完成时的[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)。如果备份失败，promise会被拒绝并返回`Error`。可以通过设置`attached`选项为指定附加数据库的名称来备份附加数据库。备份文件是常规的SQLite数据库文件，可以通过[`new Database()`](#new-databasepath-options)打开。

```js
db.backup(`backup-${Date.now()}.db`)
  .then(() => {
    console.log('备份完成!');
  })
  .catch((err) => {
    console.log('备份失败:', err);
  });
```

备份过程中可以正常使用数据库。如果同一数据库连接在备份期间修改数据库，这些修改会自动反映到备份中。但是，如果在备份期间*不同*连接修改数据库，备份会被强制重启。因此，建议在进行在线备份时，只有单一连接负责修改数据库。

可以通过设置`progress`选项为回调函数来监控备份进度。每次备份有进展时，该函数会被调用，提供一个包含两个属性的对象：

- `.totalPages`: 源数据库的总页数（即备份完成时的页数）。
- `.remainingPages`: 备份完成前仍需传输的页数。

默认情况下，每次事件循环周期后传输`100`[页](https://www.sqlite.org/fileformat.html#pages)。可以通过从`progress`回调返回数字来调整此设置。甚至可以返回`0`来暂停备份。一般来说，目标是在减少暂停时间的同时最大化吞吐量。如果传输大小很低，暂停时间会短，但备份可能需要更长时间。反之，如果设置过高，暂停时间会变长，但备份可能更快完成。大多数情况下，`100`被证明是很好的折衷，但最佳设置取决于计算机规格和程序特性。更改此设置前应测量效果。

如果备份成功，返回的promise会包含一个与`progress`回调提供的对象属性相同的对象，但`.remainingPages`为`0`。如果`progress`回调抛出异常，备份会被中止。通常这是由于意外错误，但也可以利用此行为自愿取消备份。如果父数据库连接关闭，所有待处理备份会自动中止。

```js
let paused = false;
db.backup(`backup-${Date.now()}.db`, {
  progress({ totalPages: t, remainingPages: r }) {
    console.log(`进度: ${((t - r) / t * 100).toFixed(1)}%`);
    return paused ? 0 : 200;
  }
});
```

### .serialize([*options*]) -> *Buffer*

返回包含数据库序列化内容的[Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer)。可以通过设置`attached`选项为指定附加数据库的名称来序列化附加数据库。

返回的Buffer可以写入磁盘创建常规SQLite数据库文件，也可以通过传递给[`new Database()`](#new-databasepath-options)直接作为内存数据库打开。

```js
const buffer = db.serialize();
db.close();
db = new Database(buffer);
```

### .function(*name*, [*options*], *function*) -> *this*

注册用户定义的`function`以便SQL语句使用。

```js
db.function('add2', (a, b) => a + b);

db.prepare('SELECT add2(?, ?)').pluck().get(12, 4); // => 16
db.prepare('SELECT add2(?, ?)').pluck().get('foo', 'bar'); // => "foobar"
db.prepare('SELECT add2(?, ?, ?)').pluck().get(12, 4, 18); // => 错误：参数数量错误
```

默认情况下，用户定义函数有严格的参数数量（由`function.length`决定）。可以注册同名但参数数量不同的多个函数，使SQLite根据传入参数数量执行不同函数。如果注册两个同名且参数数量相同的函数，第二个注册会覆盖第一个。

如果`options.varargs`为`true`，注册的函数可以接受任意数量参数。

如果`options.directOnly`为`true`，注册的函数只能从顶层SQL调用，不能在[视图](https://sqlite.org/lang_createview.html)、[触发器](https://sqlite.org/lang_createtrigger.html)或模式结构（如[CHECK约束](https://www.sqlite.org/lang_createtable.html#ckconst)、[DEFAULT子句](https://www.sqlite.org/lang_createtable.html#dfltval)等）中使用。

如果函数是[确定性](https://en.wikipedia.org/wiki/Deterministic_algorithm)的，可以设置`options.deterministic`为`true`，可能在某些情况下提高性能。

```js
db.function('void', { deterministic: true, varargs: true }, () => {});

db.prepare("SELECT void()").pluck().get(); // => null
db.prepare("SELECT void(?, ?)").pluck().get(55, 19); // => null
```

### .aggregate(*name*, *options*) -> *this*

注册用户定义的[聚合函数](https://sqlite.org/lang_aggfunc.html)。

```js
db.aggregate('addAll', {
  start: 0,
  step: (total, nextValue) => total + nextValue,
});

db.prepare('SELECT addAll(dollars) FROM expenses').pluck().get(); // => 92
```

`step()`函数对传递给聚合的每行调用一次，用其返回值作为新的聚合值。类似[Array#reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)。

如果`options.start`是函数，会在每次聚合开始时调用，用其返回值作为初始聚合值。如果`options.start`不是函数，则直接作为初始聚合值（如上例）。如果未提供，初始聚合值为`null`。

还可以提供`result()`函数转换最终聚合值：

```js
db.aggregate('getAverage', {
  start: () => [],
  step: (array, nextValue) => {
    array.push(nextValue);
  },
  result: array => array.reduce(sum) / array.length,
});

db.prepare('SELECT getAverage(dollars) FROM expenses').pluck().get(); // => 20.2
```

如上所示，可以使用任意JavaScript对象作为聚合上下文，只要`result()`最终返回有效的SQLite值。如果`step()`不返回任何值（`undefined`），聚合值不会被替换（注意当需要`null`时返回`undefined`的情况）。

与常规[用户定义函数](#functionname-options-function---this)类似，用户定义聚合可以接受多个参数。此外，也接受`options.varargs`、`options.directOnly`和`options.deterministic`。

如果提供`inverse()`函数，聚合可以用作[窗口函数](https://www.sqlite.org/windowfunctions.html)。`step()`用于向当前窗口添加行，`inverse()`用于从当前窗口移除行。使用窗口函数时，`result()`可能被多次调用。

```js
db.aggregate('addAll', {
  start: 0,
  step: (total, nextValue) => total + nextValue,
  inverse: (total, droppedValue) => total - droppedValue,
  result: total => Math.round(total),
});

db.prepare(`
  SELECT timestamp, dollars, addAll(dollars) OVER day as dayTotal
  FROM expenses
  WINDOW day AS (PARTITION BY date(timestamp))
  ORDER BY timestamp
`).all();
```

### .table(*name*, *definition*) -> *this*

注册[虚拟表](https://www.sqlite.org/vtab.html)。虚拟表可以像真实表一样查询，但其结果不存在于数据库文件中，而是通过JavaScript的[生成器函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)实时计算。

```js
const fs = require('fs');

db.table('filesystem_directory', {
  columns: ['filename', 'data'],
  rows: function* () {
    for (const filename of fs.readdirSync(process.cwd())) {
      const data = fs.readFileSync(filename);
      yield { filename, data };
    }
  },
});

const files = db.prepare('SELECT * FROM filesystem_directory').all();
// => [{ filename, data }, { filename, data }]
```

生成虚拟表行时，可以yield键对应列名的对象，或按声明顺序yield表示列的数组。每个虚拟表**必须**通过`columns`选项声明列。

虚拟表可以像[表值函数](https://www.sqlite.org/vtab.html#tabfunc2)一样使用；可以传递参数，这与常规表不同。

```js
db.table('regex_matches', {
  columns: ['match', 'capture'],
  rows: function* (pattern, text) {
    const regex = new RegExp(pattern, 'g');
    let match;

    while (match = regex.exec(text)) {
      yield [match[0], match[1]];
    }
  },
});

const stmt = db.prepare("SELECT * FROM regex('\\$(\\d+)', ?)");

stmt.all('Desks cost $500 and chairs cost $27');
// => [{ match: '$500', capture: '500' }, { match: '$27', capture: '27' }]
```

默认情况下，虚拟表接受的参数数量由`function.length`推断，参数自动命名为`$1`、`$2`等。但也可以通过`parameters`选项显式提供参数列表。

```js
db.table('regex_matches', {
  columns: ['match', 'capture'],
  parameters: ['pattern', 'text'],
  rows: function* (pattern, text) {
    ...
  },
});
```

> 在虚拟表中，参数实际上是[*隐藏列*](https://www.sqlite.org/vtab.html#hidden_columns_in_virtual_tables)，可以像其他列一样在查询结果集中选择。这就是有时需要显式命名的原因。

当查询虚拟表时，任何省略的参数会是`undefined`。可以利用此行为实现必需参数和默认参数值。

```js
db.table('sequence', {
  columns: ['value'],
  parameters: ['length', 'start'],
  rows: function* (length, start = 0) {
    if (length === undefined) {
      throw new TypeError('缺少必需参数"length"');
    }

    const end = start + length;
    for (let n = start; n < end; ++n) {
      yield { value: n };
    }
  },
});

db.prepare('SELECT * FROM sequence(10)').pluck().all();
// => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

> 注意，当使用`start = 0`这样的默认参数值时，函数的`.length`属性不包括可选参数，因此需要显式声明`parameters`。

通常注册虚拟表时，虚拟表自动存在，无需运行`CREATE VIRTUAL TABLE`语句。但是如果将工厂函数作为第二个参数（返回虚拟表定义的函数），则不会自动创建虚拟表。而是通过运行[`CREATE VIRTUAL TABLE`](https://sqlite.org/lang_createvtab.html)语句创建多个相似虚拟表，每个都有其模块参数。可以将其视为定义虚拟表"类"，通过`CREATE VIRTUAL TABLE`语句实例化。

```js
const fs = require('fs');

db.table('csv', (filename) => {
  const firstLine = getFirstLineOfFile(filename);
  return {
    columns: firstLine.split(','),
    rows: function* () {
      // 仅为示例。真实CSV解析更复杂。
      const contents = fs.readFileSync(filename, 'utf8');
      for (const line of contents.split('\n')) {
        yield line.split(',');
      }
    },
  };
});

db.exec('CREATE VIRTUAL TABLE my_data USING csv(my_data.csv)');
const allData = db.prepare('SELECT * FROM my_data').all();
```

每次运行对应的`CREATE VIRTUAL TABLE`语句时，工厂函数会被调用。工厂函数的参数对应`CREATE VIRTUAL TABLE`语句中的模块参数；总是逗号分隔的任意字符串列表。需要自行解析和解释这些模块参数。注意SQLite不允许在模块参数中使用[绑定参数](#binding-parameters)。

与[用户定义函数](#functionname-options-function---this)和[用户定义聚合](#aggregatename-options---this)类似，虚拟表支持`options.directOnly`，防止表在[视图](https://sqlite.org/lang_createview.html)、[触发器](https://sqlite.org/lang_createtrigger.html)或模式结构（如[CHECK约束](https://www.sqlite.org/lang_createtable.html#ckconst)、[DEFAULT子句](https://www.sqlite.org/lang_createtable.html#dfltval)等）中使用。

> 一些[扩展](#loadextensionpath-entrypoint---this)可以提供具有写入能力的虚拟表，但`db.table()`只能创建只读虚拟表，主要用于支持表值函数。

### .loadExtension(*path*, [*entryPoint*]) -> *this*

加载编译的[SQLite扩展](https://sqlite.org/loadext.html)并应用到当前数据库连接。

需确保加载的扩展与`better-sqlite3`使用的[SQLite](https://www.sqlite.org/)版本兼容。注意新版本的`better-sqlite3`会定期使用新版本的[SQLite](https://www.sqlite.org/)。可以在此处查看当前使用的版本[此处](./compilation.md#bundled-configuration)。

```js
db.loadExtension('./my-extensions/compress.so');
```

### .exec(*string*) -> *this*

执行给定的SQL字符串。与[预处理语句](#preparestring---statement)不同，可以执行包含多个SQL语句的字符串。此方法性能较差且不够安全，应仅在需要执行外部源（通常是文件）的SQL时使用。如果发生错误，执行停止且后续语句不执行。需手动回滚更改。

```js
const migration = fs.readFileSync('migrate-schema.sql', 'utf8');
db.exec(migration);
```

### .close() -> *this*

关闭数据库连接。调用此方法后，无法创建或执行任何语句。

```js
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));
```

## 属性

**.open -> _boolean_** - 数据库连接是否当前处于打开状态。

**.inTransaction -> _boolean_** - 数据库连接是否当前处于打开的事务中。

**.name -> _string_** - 用于打开数据库连接的字符串。

**.memory -> _boolean_** - 数据库是否为内存数据库或临时数据库。

**.readonly -> _boolean_** - 数据库连接是否以只读模式创建。

# 类 *Statement*

表示单个SQL语句的对象。

- [Statement#run()](#runbindparameters---object)
- [Statement#get()](#getbindparameters---row)
- [Statement#all()](#allbindparameters---array-of-rows)
- [Statement#iterate()](#iteratebindparameters---iterator)
- [Statement#pluck()](#plucktogglestate---this)
- [Statement#expand()](#expandtogglestate---this)
- [Statement#raw()](#rawtogglestate---this)
- [Statement#columns()](#columns---array-of-objects)
- [Statement#bind()](#bindbindparameters---this)
- [属性](#properties-1)

> 注意：如果使用过[SQLite C API](https://www.sqlite.org/c3ref)，可能期望有["finalize"](https://www.sqlite.org/c3ref/finalize.html)方法，但`better-sqlite3`在垃圾回收时（或关联数据库关闭时）自动处理。

### .run([*...bindParameters*]) -> *object*

执行预处理语句。执行完成后返回描述更改的`info`对象。`info`对象有两个属性：

- `info.changes`: 此操作插入、更新或删除的总行数。[外键操作](https://sqlite.org/foreignkeys.html#fk_actions)或[触发器程序](https://sqlite.org/lang_createtrigger.html)导致的更改不计入。
- `info.lastInsertRowid`: 最后插入数据库的[行ID](https://sqlite.org/lang_createtable.html#rowid)（忽略[触发器程序](https://sqlite.org/lang_createtrigger.html)导致的插入）。如果当前语句未插入任何行，应完全忽略此数字。

如果执行语句失败，抛出`Error`。

可以指定[绑定参数](#binding-parameters)，这些参数仅对当前执行有效。

```js
const stmt = db.prepare('INSERT INTO cats (name, age) VALUES (?, ?)');
const info = stmt.run('Joey', 2);

console.log(info.changes); // => 1
```

### .get([*...bindParameters*]) -> *row*

**（仅适用于返回数据的语句）**

执行预处理语句。执行完成后返回表示查询检索的第一行的对象。对象的键对应列名。

如果语句成功但未找到数据，返回`undefined`。如果执行失败，抛出`Error`。

可以指定[绑定参数](#binding-parameters)，这些参数仅对当前执行有效。

```js
const stmt = db.prepare('SELECT age FROM cats WHERE name = ?');
const cat = stmt.get('Joey');

console.log(cat.age); // => 2
```

### .all([*...bindParameters*]) -> *array of rows*

**（仅适用于返回数据的语句）**

类似[`.get()`](#getbindparameters---row)，但检索所有匹配行。返回值是行对象的数组。

如果未找到行，数组为空。如果执行失败，抛出`Error`。

可以指定[绑定参数](#binding-parameters)，这些参数仅对当前执行有效。

```js
const stmt = db.prepare('SELECT * FROM cats WHERE name = ?');
const cats = stmt.all('Joey');

console.log(cats.length); // => 1
```

### .iterate([*...bindParameters*]) -> *iterator*

**（仅适用于返回数据的语句）**

类似[`.all()`](#allbindparameters---array-of-rows)，但返回[迭代器](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)逐行检索。如果计划检索所有行，[`.all()`](#allbindparameters---array-of-rows)性能稍好。

如果执行失败，抛出`Error`并关闭迭代器。

可以指定[绑定参数](#binding-parameters)，这些参数仅对当前执行有效。

```js
const stmt = db.prepare('SELECT * FROM cats');

for (const cat of stmt.iterate()) {
  if (cat.name === 'Joey') {
    console.log('找到他！');
    break;
  }
}
```

### .pluck([toggleState]) -> *this*

**（仅适用于返回数据的语句）**

使预处理语句仅返回检索行第一列的值，而不是整个行对象。

可以切换此选项：

```js
stmt.pluck(); // 开启pluck
stmt.pluck(true); // 开启pluck
stmt.pluck(false); // 关闭pluck
```

> 开启pluck时，[展开](#expandtogglestate---this)和[原始模式](#rawtogglestate---this)会被关闭（它们是互斥选项）。

### .expand([toggleState]) -> *this*

**（仅适用于返回数据的语句）**

使预处理语句按表命名空间返回数据。行对象的每个键是表名，对应值是包含关联列数据的嵌套对象。这在执行具有重叠列名的`JOIN`时非常有用。如果结果列是表达式或子查询，将在特殊的`$`命名空间中可用。

可以切换此选项：

```js
stmt.expand(); // 开启展开
stmt.expand(true); // 开启展开
stmt.expand(false); // 关闭展开
```

> 开启展开时，[pluck](#plucktogglestate---this)和[原始模式](#rawtogglestate---this)会被关闭（它们是互斥选项）。

### .raw([toggleState]) -> *this*

**（仅适用于返回数据的语句）**

使预处理语句返回数组形式而非对象形式的行。主要用于检索大量行时的性能优化。列名可以通过[`.columns()`](#columns---array-of-objects)方法恢复。

可以切换此选项：

```js
stmt.raw(); // 开启原始模式
stmt.raw(true); // 开启原始模式
stmt.raw(false); // 关闭原始模式
```

> 开启原始模式时，[pluck](#plucktogglestate---this)和[展开](#expandtogglestate---this)会被关闭（它们是互斥选项）。

### .columns() -> *array of objects*

**（仅适用于返回数据的语句）**

此方法主要用于[原始模式](#rawtogglestate---this)。返回对象数组，每个对象描述预处理语句的结果列。每个对象有以下属性：

- `.name`: 结果列的名称（或别名）。
- `.column`: 原始表列的名称，如果是表达式或子查询则为`null`。
- `.table`: 原始表的名称，如果是表达式或子查询则为`null`。
- `.database`: 原始数据库的名称，如果是表达式或子查询则为`null`。
- `.type`: [声明类型](https://www.sqlite.org/datatype3.html#determination_of_column_affinity)的名称，如果是表达式或子查询则为`null`。

```js
const fs = require('fs');

function* toRows(stmt) {
  yield stmt.columns().map(column => column.name);
  yield* stmt.raw().iterate();
}

function writeToCSV(filename, stmt) {
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filename);
    for (const row of toRows(stmt)) {
      stream.write(row.join(',') + '\n');
    }
    stream.on('error', reject);
    stream.end(resolve);
  });
}
```

> 当表模式被修改时，现有预处理语句可能开始返回不同的结果列。但此变化在此方法中不会反映，直到预处理语句重新执行。因此，最好在`.get()`、`.all()`或`.iterate()`之后调用`.columns()`。

### .bind([*...bindParameters*]) -> *this*

将给定参数[永久绑定](#binding-parameters)到语句。与执行时绑定参数不同，这些参数会一直绑定到预处理语句的整个生命周期。

语句参数以此方式绑定后，不能再提供执行时的临时绑定参数。

此方法主要用于性能优化，当需要多次执行同一预处理语句并使用相同绑定参数时。

```js
const stmt = db.prepare('SELECT * FROM cats WHERE name = ?').bind('Joey');
const cat = stmt.get();

console.log(cat.name); // => "Joey"
```

## 属性

**.database -> _object_** - 父数据库对象。

**.source -> _string_** - 创建预处理语句的源字符串。

**.reader -> _boolean_** - 预处理语句是否返回数据。

**.readonly -> _boolean_** - 预处理语句是否只读，即不修改数据库（注意[SQL函数可能间接修改数据库](https://www.sqlite.org/c3ref/stmt_readonly.html)作为副作用，即使`.readonly`属性为`true`）。

**.busy -> _boolean_** - 预处理语句是否正在通过[`.iterate()`](#iteratebindparameters---iterator)方法执行查询。

# 类 *SqliteError*

当SQLite中发生错误时，会抛出`SqliteError`对象。`SqliteError`是`Error`的子类。每个`SqliteError`对象都有`code`属性，是字符串，匹配[此处](https://sqlite.org/rescode.html)定义的"扩展结果码"之一（例如`"SQLITE_CONSTRAINT_UNIQUE"`）。

如果收到`SqliteError`，可能意味着使用SQLite的方式不正确。错误并非源于`better-sqlite3`，因此可能不是`better-sqlite3`的问题。建议在此处了解错误含义[此处](https://sqlite.org/rescode.html)，并通过阅读[SQLite文档](https://sqlite.org/docs.html)学习正确使用方法。

> 在极少数情况下，SQLite抛出未被`better-sqlite3`识别的错误（这视为`better-sqlite3`的bug），`code`属性会是`"UNKNOWN_SQLITE_ERROR_NNNN"`，其中`NNNN`是数字错误码。如果遇到此情况，请提交[issue](https://github.com/JoshuaWise/better-sqlite3/issues)。

# 绑定参数

本节涉及文档中任何指定可选参数[*`...bindParameters`*]的地方。

有多种方式绑定参数到预处理语句。最简单的方式是使用匿名参数：

```js
const stmt = db.prepare('INSERT INTO people VALUES (?, ?, ?)');

// 以下等效。
stmt.run('John', 'Smith', 45);
stmt.run(['John', 'Smith', 45]);
stmt.run(['John'], ['Smith', 45]);
```

也可以使用命名参数。SQLite为命名参数提供[3种不同语法](https://www.sqlite.org/lang_expr.html)（`@foo`、`:foo`、`$foo`），`better-sqlite3`均支持。

```js
// 以下等效。
const stmt = db.prepare('INSERT INTO people VALUES (@firstName, @lastName, @age)');
const stmt = db.prepare('INSERT INTO people VALUES (:firstName, :lastName, :age)');
const stmt = db.prepare('INSERT INTO people VALUES ($firstName, $lastName, $age)');
const stmt = db.prepare('INSERT INTO people VALUES (@firstName, :lastName, $age)');

stmt.run({
  firstName: 'John',
  lastName: 'Smith',
  age: 45
});
```

以下是混合匿名参数和命名参数的示例。

```js
const stmt = db.prepare('INSERT INTO people VALUES (@name, @name, ?)');
stmt.run(45, { name: 'Henry' });
```

以下是`better-sqlite3`在SQLite和JavaScript之间转换值的方式：

|SQLite|JavaScript|
|---|---|
|`NULL`|`null`|
|`REAL`|`number`|
|`INTEGER`|`number` [或 `BigInt`](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/integer.md#the-bigint-primitive-type)|
|`TEXT`|`string`|
|`BLOB`|[`Buffer`](https://nodejs.org/api/buffer.html#buffer_class_buffer)|
