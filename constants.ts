
import { Question, Category } from './types';

// Helper to create questions quickly
const createQ = (id: string, category: Category, title: string, diff: '入门' | '进阶' | '专家' = '进阶', desc?: string): Question => ({
  id,
  title,
  category,
  difficulty: diff,
  description: desc,
});

// --- 首页：通用编程/基础概念题目 (保持不变) ---
export const GENERAL_QUESTIONS: Question[] = [
  // --- 第一部分：基础概念 ---
  {
    id: '1',
    title: 'var, let, const 有什么区别？',
    category: Category.JAVASCRIPT,
    difficulty: '入门',
    description: '核心概念：作用域 (scope)、提升 (hoisting) 行为以及可变性 (mutability) 的对比。',
    standardAnswer: `**1. 核心概念**
var、let 和 const 是 JavaScript 中用于声明变量的关键字。

● **var**: 函数作用域 (function scope)，存在变量提升 (hoisting)，可重复声明。
● **let/const**: 块级作用域 (block scope)，存在暂时性死区 (TDZ)，不可重复声明。

**2. 为什么需要 let 和 const？**
它们解决了 var 带来的几个痛点：
1. **变量提升导致的混乱**：var 声明的变量会被提升到作用域顶部并初始化为 undefined。
2. **循环变量泄露**：var 没有块级作用域，for 循环中的变量会泄露到外部。
3. **常量能力**：const 提供不可变引用的能力。

**3. 代码示例**
\`\`\`javascript
// var 的提升
console.log(a); // undefined
var a = 10;

// let 的死区
// console.log(b); // ReferenceError
let b = 20;

// const 的不可变性
const c = 30;
// c = 40; // TypeError
const obj = { name: 'React' };
obj.name = 'Vue'; // 合法，修改的是堆内存中的对象
\`\`\``
  },
  {
    id: '2',
    title: '数据类型和 typeof 的陷阱',
    category: Category.JAVASCRIPT,
    difficulty: '入门',
    description: '深入理解 7 种原始类型、1 种对象类型以及 typeof null 等历史遗留 bug。',
    standardAnswer: `**1. 核心概念**
JS 数据类型分为两类：
● **原始类型 (Primitive)**: string, number, boolean, null, undefined, symbol (ES6), bigint (ES2020)。
● **对象类型 (Object)**: object (包括 Array, Function, Date 等)。

**2. typeof 的主要陷阱**
● **typeof null 返回 "object"**：这是 JS 历史遗留的 Bug。底层二进制标签 000 表示对象，而 null 全是 0。
● **无法区分数组和对象**：\`typeof []\` 和 \`typeof {}\` 都返回 "object"。

**3. 正确的类型判断 (万能公式)**
使用 \`Object.prototype.toString.call()\`。

\`\`\`javascript
typeof null; // "object" (坑)
typeof [];   // "object" (坑)

// 推荐写法
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call([]);   // "[object Array]"
\`\`\``
  },
  {
    id: '3',
    title: '值类型 vs 引用类型',
    category: Category.JAVASCRIPT,
    difficulty: '入门',
    description: '理解栈内存与堆内存的区别，以及赋值操作背后的原理。',
    standardAnswer: `**1. 核心差异**
● **值类型** (String, Number 等)：变量直接存储**值本身**，存储在**栈内存**中。赋值是拷贝值，互不影响。
● **引用类型** (Object, Array)：变量存储的是**内存地址 (指针)**，实际对象存储在**堆内存**中。赋值是拷贝指针，指向同一个对象。

**2. 常见面试题：修改引用**
\`\`\`javascript
let a = { name: 'Alice' };
let b = a; // b 复制了 a 的地址
b.name = 'Bob'; // 修改堆内存中的内容
console.log(a.name); // 'Bob' - a 也受影响

function change(obj) {
  obj = { name: 'New' }; // obj 指向了新地址，切断了与外部的联系
}
change(a);
console.log(a.name); // 'Bob' - 外部变量未变
\`\`\``
  },
  {
    id: '4',
    title: '深拷贝与浅拷贝的本质',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: '如何正确地复制一个对象？从 Object.assign 到 structuredClone。',
    standardAnswer: `**1. 浅拷贝 (Shallow Copy)**
只复制对象的第一层属性。如果属性是引用类型，只复制内存地址。
● 常用方法：\`Object.assign()\`, 扩展运算符 \`{...obj}\`。

**2. 深拷贝 (Deep Copy)**
递归复制对象的所有层级，新旧对象完全独立。

**3. 深拷贝实现方式**
● **JSON.parse(JSON.stringify(obj))**
  ○ 优点：简单。
  ○ 缺点：忽略 undefined、Symbol、函数；无法处理循环引用；Date 会变字符串。

● **structuredClone(obj)** (现代推荐)
  ○ 优点：原生 API，支持 Date、Map、Set 等，支持循环引用。
  ○ 缺点：不支持函数和 DOM 节点。

● **手写递归 (面试常考)**
\`\`\`javascript
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (hash.has(obj)) return hash.get(obj); // 处理循环引用

  let clone = Array.isArray(obj) ? [] : {};
  hash.set(obj, clone);

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key], hash);
    }
  }
  return clone;
}
\`\`\``
  },
  {
    id: '5',
    title: '数组常用方法背后的面试点',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: '函数式编程基础，掌握 map, filter, reduce 的使用与区别。',
    standardAnswer: `**1. 核心方法对比**
● **map**: 映射。一对一转换，返回新数组，长度不变。
● **filter**: 过滤。根据条件筛选，返回新数组，长度可能变短。
● **reduce**: 归约。将数组汇总为单个值 (如求和、转对象)。

**2. 关键注意事项**
● **map vs forEach**: map 返回新数组，forEach 无返回值 (undefined)。如果不需要返回值，请用 forEach。
● **reduce 的 initialValue**: 强烈建议提供初始值，否则空数组调用会报错，且处理逻辑可能不同。

**3. 代码示例**
\`\`\`javascript
const nums = [1, 2, 3];

// map
const doubled = nums.map(n => n * 2); // [2, 4, 6]

// reduce 求和
const sum = nums.reduce((acc, cur) => acc + cur, 0); // 6

// reduce 数组转对象
const items = ['a', 'b', 'a'];
const count = items.reduce((acc, item) => {
  acc[item] = (acc[item] || 0) + 1;
  return acc;
}, {}); // { a: 2, b: 1 }
\`\`\``
  },
  {
    id: '6',
    title: '对象遍历方式对比 (for in, Object.keys, Reflect)',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: 'for...in, Object.keys(), Object.getOwnPropertyNames() 与 Reflect.ownKeys() 的区别。',
    standardAnswer: `**1. 遍历方式对比表**

| 方法 | 遍历自身属性? | 遍历原型链? | 遍历不可枚举? | 遍历 Symbol? |
| :--- | :---: | :---: | :---: | :---: |
| **for...in** | ✅ | ✅ | ❌ | ❌ |
| **Object.keys()** | ✅ | ❌ | ❌ | ❌ |
| **Object.getOwnPropertyNames()** | ✅ | ❌ | ✅ | ❌ |
| **Reflect.ownKeys()** | ✅ | ❌ | ✅ | ✅ |

**2. 关键总结**
● **for...in**：最“宽”但也最“乱”，包含原型链属性，通常需要配合 \`hasOwnProperty\` 使用。
● **Object.keys()**：最常用，只取自身可枚举属性。
● **Reflect.ownKeys()**：最全，包含自身所有属性（包括不可枚举和 Symbol），是 \`Object.getOwnPropertyNames\` + \`Object.getOwnPropertySymbols\` 的组合。`
  },
  {
    id: '7',
    title: '隐式类型转换有哪些坑？',
    category: Category.JAVASCRIPT,
    difficulty: '入门',
    description: '深入了解 ToPrimitive 机制，以及为什么 [] == ![] 为 true。',
    standardAnswer: `**1. 核心转换规则 (ToPrimitive)**
当对象需要转为原始类型时，会依次调用 \`[Symbol.toPrimitive]\` -> \`valueOf()\` -> \`toString()\`。

**2. 经典大坑：[] == ![]**
结果为 \`true\`。解析步骤：
1. \`![]\`：空数组是真值，取反变为 \`false\`。
2. 比较 \`[] == false\`。
3. \`[]\` 转原始值变为 \`""\` (空字符串)。
4. \`false\` 转数字为 \`0\`。
5. \`""\` 转数字为 \`0\`。
6. \`0 == 0\` -> \`true\`。

**3. + 运算符的歧义**
如果任一操作数是字符串，则执行字符串拼接，否则执行数字加法。
\`\`\`javascript
1 + '2' // "12"
1 + 2 // 3
\`\`\``
  },
  {
    id: '8',
    title: '== 和 === 的核心考点',
    category: Category.JAVASCRIPT,
    difficulty: '入门',
    description: '理解隐式类型转换规则，以及为什么建议永远使用 ===。',
    standardAnswer: `**1. 核心区别**
● **=== (严格相等)**: 类型不同直接返回 false，类型相同再比值。不进行类型转换。
● **== (宽松相等)**: 类型不同时，会先尝试**隐式转换**为相同类型，再比较。

**2. 隐式转换规则 (==)**
● \`null == undefined\` 为 true。
● 如果一个是数字，一个是字符串，字符串转数字。
● 如果一个是布尔值，先转为数字 (true->1, false->0)。
● 如果一个是对象，调用 \`ToPrimitive\` (valueOf/toString) 转为原始值。

**3. 最佳实践**
永远使用 \`===\`，除非你在判断 \`x == null\` (以此同时捕获 null 和 undefined)。`
  },
  // --- 第二部分：底层原理 ---
  {
    id: '9',
    title: '执行上下文和作用域链是什么？',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: '深入 JavaScript 引擎内部：变量是如何被查找的？闭包是如何形成的？',
    standardAnswer: `**1. 执行上下文 (Execution Context, EC)**
代码运行的环境。主要包含：
● **变量环境**: var 声明的变量。
● **词法环境**: let/const 声明的变量，以及外部环境引用 (Outer)。
● **this 绑定**。

**2. 作用域链 (Scope Chain)**
当查找变量时，如果在当前上下文找不到，会去 **outer (词法作用域的父级)** 查找，直到全局作用域。
**关键点**：作用域链是在**函数定义时**确定的 (词法作用域)，而不是调用时。

**3. 示例**
\`\`\`javascript
let name = 'Global';
function outer() {
  let name = 'Outer';
  function inner() {
    console.log(name); // 查找到 Outer，停止查找
  }
  return inner;
}
outer()(); // 输出 'Outer'
\`\`\``
  },
  {
    id: '10',
    title: 'JS 中的 this 究竟指向谁？',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: '默认绑定、隐式绑定、显式绑定与 new 绑定的优先级解析。',
    standardAnswer: `**1. this 绑定的四条规则 (优先级从低到高)**
1. **默认绑定**: 独立函数调用，指向 window/global (严格模式下为 undefined)。
2. **隐式绑定**: \`obj.method()\`，指向调用它的对象 \`obj\`。
3. **显式绑定**: \`call\`, \`apply\`, \`bind\`，强行指定 this。
4. **new 绑定**: 指向 new 创建的新对象。

**2. 箭头函数的特例**
箭头函数**没有自己的 this**。它的 this 取决于外层作用域 (定义时的上下文)，且无法被 call/apply 修改。

**3. 代码示例**
\`\`\`javascript
const obj = {
  name: 'Obj',
  say: function() { console.log(this.name) },
  wait: function() {
    setTimeout(function() {
      console.log(this); // Window (回调丢失 this)
    }, 100);
    setTimeout(() => {
      console.log(this.name); // 'Obj' (箭头函数继承外层)
    }, 100);
  }
};
\`\`\``
  },
  {
    id: '11',
    title: '闭包 (Closure) 到底是什么？如何判断？',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: '闭包不仅仅是函数套函数，它是保留了对词法作用域引用的“背包”。',
    standardAnswer: `**1. 核心定义**
闭包是一个函数以及其捆绑的周边环境状态（**词法环境**）的引用的组合。
简单来说：**内部函数记住了它定义时所在的外部作用域**，即使外部函数已经执行完毕。

**2. 主要应用场景**
● **数据封装 (私有变量)**: 模拟私有方法。
● **状态保持**: 如柯里化 (Currying)、防抖/节流函数。

**3. 内存泄漏风险**
闭包会导致外部作用域的变量无法被垃圾回收 (GC)。如果不使用，应及时断开引用。

**4. 经典面试题：循环与闭包**
\`\`\`javascript
// 错误：打印 5 个 5
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100);
}

// 修正：使用 let (块级作用域) 或 IIFE (立即执行函数)
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2, 3, 4
}
\`\`\``
  },
  {
    id: '12',
    title: '高阶函数和柯里化应用场景',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: 'Higher-Order Functions 与 Currying 的概念与实战。',
    standardAnswer: `**1. 高阶函数 (HOF)**
接受一个函数作为参数，或者返回一个函数的函数。如 \`map\`, \`filter\`, \`reduce\`。

**2. 柯里化 (Currying)**
将一个多参数函数转换为一系列单参数函数的技术。
\`f(a, b, c)\` -> \`f(a)(b)(c)\`。

**3. 柯里化的作用**
● **参数复用**：固定前几个参数，生成一个专用的新函数。
● **延迟执行**：积累参数，直到参数够了才执行。

\`\`\`javascript
function add(x) {
  return function(y) {
    return x + y;
  };
}
const add5 = add(5);
console.log(add5(3)); // 8
\`\`\``
  },
  {
    id: '13',
    title: '节流 (Throttle) vs 防抖 (Debounce)',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: '前端性能优化的两大法宝，原理、区别与面试怎么考。',
    standardAnswer: `**1. 核心区别**
● **防抖 (Debounce)**: "最后一个人说了算"。多次触发，只执行最后一次。
  ○ 适用：搜索框输入联想、窗口 Resize。
● **节流 (Throttle)**: "按规定频率执行"。不管触发多少次，每隔一段时间只执行一次。
  ○ 适用：滚动事件 (Scroll)、鼠标移动、游戏帧率控制。

**2. 记忆口诀**
防抖是**回城被打断**（重新读条），节流是**技能CD**（冷却时间到了才能放）。`
  },
  {
    id: '14',
    title: 'bind、call、apply 的底层原理',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: '它们都是用来改变 this 指向的，区别在于参数传递方式和返回值。',
    standardAnswer: `**1. 三者对比**
| 方法 | 传参方式 | 返回值 | 执行时机 |
| :--- | :--- | :--- | :--- |
| **call** | 参数列表 (arg1, arg2) | 函数执行结果 | 立即执行 |
| **apply** | 数组 ([args]) | 函数执行结果 | 立即执行 |
| **bind** | 参数列表 (arg1, arg2) | **新函数** | **稍后调用** |

**2. 核心原理**
\`call\` 和 \`apply\` 的核心是在 \`thisArg\` 上临时添加一个属性指向该函数，执行该属性，然后删除。
\`bind\` 则是返回一个闭包，闭包内部保存了 \`thisArg\` 和预设参数，内部再调用 \`apply\`。`
  },
  {
    id: '15',
    title: '立即执行函数 IIFE 是怎么工作的？',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: 'Immediately Invoked Function Expression 的历史意义与现代替代方案。',
    standardAnswer: `**1. 核心结构**
\`(function() { ... })();\`
利用括号将函数声明变成函数表达式，然后立即调用。

**2. 为什么需要 IIFE？**
在 ES6 之前（没有块级作用域），IIFE 是创建**独立作用域**的唯一方式。
● **避免全局污染**：变量限制在函数内。
● **数据私有化**：外部无法访问内部变量。

**3. 现代替代**
随着 ES6 模块 (Module) 和块级作用域 (let/const) 的普及，IIFE 的使用场景已大幅减少。`
  },
  // --- 第三部分：手写代码 ---
  {
    id: '17',
    title: '手写 bind 实现',
    category: Category.JAVASCRIPT,
    difficulty: '专家',
    description: '能够手写一个符合规范的 bind 是高级前端的试金石。',
    standardAnswer: `\`\`\`javascript
Function.prototype.myBind = function(context, ...args) {
  const fn = this; // 保存原函数
  
  // 返回一个新的函数
  return function(...innerArgs) {
    // 处理 new 调用的情况（构造函数）
    if (this instanceof fn) {
      return new fn(...args, ...innerArgs);
    }
    // 普通调用，绑定 context
    return fn.apply(context, args.concat(innerArgs));
  };
};
\`\`\`
**考察点**：
1. 返回新函数。
2. 参数合并 (柯里化特性)。
3. **new 调用的优先级最高**（这是最容易被忽略的点）。`
  },
  {
    id: '18',
    title: '手写柯里化函数',
    category: Category.JAVASCRIPT,
    difficulty: '专家',
    description: '实现一个通用的 curry 函数。',
    standardAnswer: `\`\`\`javascript
function curry(fn) {
  return function curried(...args) {
    // 如果参数够了，直接执行
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      // 参数不够，返回一个新函数继续收集参数
      return function(...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
}

// 用法
function add(a, b, c) { return a + b + c; }
const curriedAdd = curry(add);
curriedAdd(1)(2)(3); // 6
\`\`\``
  },
  {
    id: '19',
    title: '“面试常问函数题”合集 (组合、记忆化)',
    category: Category.JAVASCRIPT,
    difficulty: '专家',
    description: 'compose (组合) 和 memoize (记忆化) 的实现。',
    standardAnswer: `**1. Compose (函数组合)**
将 \`f(g(x))\` 变为 \`compose(f, g)(x)\`。
\`\`\`javascript
const compose = (...funcs) => 
  funcs.reduce((a, b) => (...args) => a(b(...args)));
\`\`\`

**2. Memoize (函数记忆化)**
缓存纯函数的计算结果。
\`\`\`javascript
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
\`\`\``
  },
  // --- 第四部分：异步编程 ---
  {
    id: '20',
    title: 'setTimeout 和 setInterval 的陷阱',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: '延迟不准、this 指向丢失、回调堆积等常见问题。',
    standardAnswer: `**1. 延迟不准**
\`setTimeout(fn, 1000)\` 并不保证恰好在 1000ms 后执行。它只是在 1000ms 后将任务**推入宏任务队列**。如果主线程阻塞，执行时间会推迟。

**2. 最小延迟**
HTML 标准规定嵌套层级超过 5 层时，最小延迟为 **4ms**。

**3. setInterval 的问题**
如果任务执行时间超过间隔时间，会导致任务堆积（连续触发）。
**推荐方案**：使用递归的 \`setTimeout\` 来模拟 \`setInterval\`，保证前一个任务执行完再开始下一个计时。`
  },
  {
    id: '21',
    title: '事件循环 (Event Loop) 完整解析',
    category: Category.JAVASCRIPT,
    difficulty: '专家',
    description: '宏任务 (MacroTask) 与微任务 (MicroTask) 的执行顺序大揭秘。',
    standardAnswer: `**1. 运行机制**
JavaScript 是单线程的。Event Loop 负责调度任务：
1. 执行同步代码 (Call Stack)。
2. 清空**微任务队列** (Microtask Queue)。
3. 执行一个**宏任务** (Macrotask)。
4. 更新 UI 渲染 (如果需要)。
5. 回到步骤 2，循环往复。

**2. 任务分类**
● **微任务**: \`Promise.then\`, \`process.nextTick\` (Node), \`MutationObserver\`。**优先级高**，插队执行。
● **宏任务**: \`setTimeout\`, \`setInterval\`, \`setImmediate\` (Node), I/O, UI 渲染, Script 整体代码。

**3. 实战题目**
\`\`\`javascript
console.log('Start');
setTimeout(() => console.log('Timeout'), 0);
Promise.resolve().then(() => console.log('Promise'));
console.log('End');

// 输出顺序：
// 1. Start (同步)
// 2. End (同步)
// 3. Promise (微任务，同步执行完立即清空)
// 4. Timeout (宏任务，下一轮 Loop)
\`\`\``
  },
  {
    id: '22',
    title: 'Promise 基本语法 + 错误捕获',
    category: Category.JAVASCRIPT,
    difficulty: '专家',
    description: '解决回调地狱的良药。理解 Pending, Fulfilled, Rejected 三种状态。',
    standardAnswer: `**1. 核心概念**
Promise 是异步编程的一种解决方案。
● **状态不可逆**: 一旦从 Pending 变为 Fulfilled 或 Rejected，状态就固定了。
● **链式调用**: \`.then()\` 返回一个新的 Promise。

**2. 关键 API**
● \`Promise.all()\`: 并行执行，全部成功才成功，有一个失败主要失败。
● \`Promise.race()\`: 赛跑，谁先改变状态就取谁的结果。
● \`Promise.allSettled()\`: 等所有任务都结束，无论成功失败。

**3. 错误捕获**
建议使用 \`.catch()\` 而不是 \`.then(null, reject)\`，因为 catch 可以捕获前面 then 中抛出的错误。`
  },
  {
    id: '23',
    title: 'async/await 的底层运行机制',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: '它是 Generator + Promise 的语法糖，让异步代码看起来像同步代码。',
    standardAnswer: `**1. 核心原理**
\`async/await\` 本质上是 **Generator 函数** 和 **自动执行器** 的语法糖。
● \`async\` 函数总是返回一个 Promise。
● \`await\` 会暂停函数的执行，直到等待的 Promise 决议 (resolve)。

**2. 错误处理**
必须使用 \`try...catch\` 块来捕获 \`await\` 中的错误，否则未捕获的 reject 会导致 Promise 报错。

**3. 串行 vs 并行**
\`\`\`javascript
// 串行（慢）：第二个请求等待第一个完成
const a = await getA();
const b = await getB();

// 并行（快）：同时发送请求
const promiseA = getA();
const promiseB = getB();
const a = await promiseA;
const b = await promiseB;

// 或者使用 Promise.all
const [a, b] = await Promise.all([getA(), getB()]);
\`\`\``
  },
  {
    id: '24',
    title: 'Promise.all、allSettled、race、any 用法对比',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: '并发控制四兄弟，根据业务场景选择最合适的方法。',
    standardAnswer: `| 方法 | 描述 | 失败处理 |
| :--- | :--- | :--- |
| **Promise.all** | 所有成功才成功 | 有一个失败立即失败 (Fail Fast) |
| **Promise.allSettled** | 等所有结束 | 永远成功，返回状态数组 |
| **Promise.race** | 赛跑 | 谁先完成就取谁 (无论成败) |
| **Promise.any** | 只要一个成功 | 所有都失败才失败 (AggregateError) |`
  },
  {
    id: '25',
    title: '手写一个简化版 Promise',
    category: Category.JAVASCRIPT,
    difficulty: '专家',
    description: '理解 Promise 的核心逻辑：状态管理、回调队列、then 的链式调用。',
    standardAnswer: `\`\`\`javascript
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.callbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.callbacks.forEach(cb => cb(value));
      }
    };
    
    executor(resolve, () => {});
  }

  then(onFulfilled) {
    return new MyPromise((resolve) => {
      if (this.state === 'fulfilled') {
        const res = onFulfilled(this.value);
        resolve(res);
      } else {
        this.callbacks.push((val) => {
          const res = onFulfilled(val);
          resolve(res);
        });
      }
    });
  }
}
\`\`\``
  },
  {
    id: '26',
    title: '实战: 用 Promise 重写 setTimeout 任务队列',
    category: Category.JAVASCRIPT,
    difficulty: '专家',
    description: '如何封装一个 delay 函数，并实现异步任务的链式执行。',
    standardAnswer: `\`\`\`javascript
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 链式调用
delay(1000)
  .then(() => {
    console.log('1秒后执行');
    return delay(2000);
  })
  .then(() => {
    console.log('再过2秒后执行');
  });

// async/await 写法 (更优雅)
async function run() {
  await delay(1000);
  console.log('1秒后');
  await delay(2000);
  console.log('再过2秒后');
}
\`\`\``
  },
  {
    id: '27',
    title: '实战: Async、await 错误处理的 3 种方式',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: 'try-catch, catch() 链式, 以及 await-to-js 模式。',
    standardAnswer: `**1. try...catch (最常用)**
\`\`\`javascript
try {
  const res = await api.getData();
} catch (err) {
  console.error(err);
}
\`\`\`

**2. 混合链式调用**
利用 Promise 的 catch 方法，避免 try-catch 嵌套过深。
\`\`\`javascript
const res = await api.getData().catch(err => null);
if (!res) return;
\`\`\`

**3. 统一错误处理 (Golang 风格)**
封装一个辅助函数，返回 \`[err, data]\`。
\`\`\`javascript
const [err, data] = await to(api.getData());
if (err) handleErr(err);
\`\`\``
  },
  // --- 第五部分：面向对象与继承 ---
  {
    id: '29',
    title: '什么是原型？什么是原型链？',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: 'JS 实现继承的基石。理解 __proto__ 和 prototype 的关系。',
    standardAnswer: `**1. 核心关系**
● **prototype**: 函数特有的属性，指向原型对象。用于实现继承。
● **__proto__** (或 \`Object.getPrototypeOf\`): 对象特有的属性，指向创建该对象的构造函数的原型。

**2. 原型链查找机制**
当访问对象 \`obj.prop\` 时：
1. 先查对象自身属性。
2. 找不到，去 \`obj.__proto__\` (即构造函数的 prototype) 找。
3. 还可以继续往上找，直到 \`Object.prototype\`。
4. 最后指向 \`null\`，停止查找，返回 undefined。

**3. instanceof 原理**
\`A instanceof B\` 检查的是：B 的 \`prototype\` 是否在 A 的原型链上。`
  },
  {
    id: '30',
    title: '构造函数与 new 的机制',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: 'new 运算符背后到底发生了什么？',
    standardAnswer: `**1. new 的执行过程**
1. 创建一个空的简单 JavaScript 对象（即 \`{}\`）。
2. 将这个对象的 \`__proto__\` 指向构造函数的 \`prototype\`。
3. 将构造函数内部的 \`this\` 绑定到这个新对象，并执行构造函数。
4. 如果构造函数返回了一个对象，则返回该对象；否则返回第一步创建的新对象。`
  },
  {
    id: '31',
    title: '手写 new 的实现逻辑',
    category: Category.JAVASCRIPT,
    difficulty: '专家',
    description: '模拟 new 关键字的行为。',
    standardAnswer: `\`\`\`javascript
function myNew(Constructor, ...args) {
  // 1. 创建新对象，并继承原型
  const obj = Object.create(Constructor.prototype);
  
  // 2. 执行构造函数，绑定 this
  const result = Constructor.apply(obj, args);
  
  // 3. 处理返回值：如果是对象则返回结果，否则返回新对象
  return (result && typeof result === 'object') ? result : obj;
}
\`\`\``
  },
  {
    id: '32',
    title: 'instanceof 背后的原理',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: '如何手动实现一个 instanceof？',
    standardAnswer: `\`instanceof\` 用于检测构造函数的 \`prototype\` 属性是否出现在某个实例对象的原型链上。

\`\`\`javascript
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left); // 获取对象的原型
  const prototype = right.prototype; // 获取构造函数的 prototype

  while (true) {
    if (proto === null) return false; // 查到了尽头
    if (proto === prototype) return true; // 找到了
    proto = Object.getPrototypeOf(proto); // 继续往上查
  }
}
\`\`\``
  },
  {
    id: '33',
    title: 'Object.create 是怎么实现继承的？',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: '它是原型式继承的规范化实现。',
    standardAnswer: `\`Object.create(proto)\` 创建一个新对象，使用现有的对象 \`proto\` 来提供新创建的对象的 \`__proto__\`。

**手写 Polyfill:**
\`\`\`javascript
Object.create = function(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
};
\`\`\``
  },
  {
    id: '34',
    title: 'class 是语法糖吗？背后发生了什么？',
    category: Category.JAVASCRIPT,
    difficulty: '入门',
    description: 'Class 背后依然是原型继承，但带来了一些新特性和限制。',
    standardAnswer: `**1. 本质**
是的，\`class\` 本质上仍然是基于原型的继承。
\`class Person { ... }\` 实际上定义了一个构造函数 \`Person\`，方法被添加到了 \`Person.prototype\` 上。

**2. 与 ES5 构造函数的区别**
1. **必须使用 new 调用**：Class 构造函数如果直接调用会报错。
2. **方法不可枚举**：Class 中定义的方法默认是不可枚举的。
3. **严格模式**：Class 内部默认启用 \`use strict\`。
4. **继承简化**：\`extends\` 和 \`super\` 关键字极大地简化了原型链继承的写法。`
  },
  {
    id: '35',
    title: 'JS 中常见继承方式对比总结',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: '原型链继承、构造函数继承、组合继承与寄生组合继承。',
    standardAnswer: `**1. 组合继承 (常用)**
结合原型链和构造函数。
\`\`\`javascript
function Child() {
  Parent.call(this); // 继承属性
}
Child.prototype = new Parent(); // 继承方法
\`\`\`
缺点：Parent 构造函数被调用了两次。

**2. 寄生组合继承 (最佳实践)**
使用 \`Object.create\` 来继承原型，避免了 Parent 的二次调用。这是 ES6 \`extends\` 的底层原理。
\`\`\`javascript
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
\`\`\``
  },
  {
    id: '36',
    title: '如何模拟类的 private 属性？',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: '从命名约定到闭包，再到 ES2020 的 #private。',
    standardAnswer: `**1. 命名约定**
使用下划线前缀 \`_prop\`，这只是“君子协定”，外部依然可访问。

**2. 闭包**
在构造函数中定义变量，不挂载到 \`this\` 上，通过特定方法访问。
\`\`\`javascript
function Person() {
  let age = 20; // 私有
  this.getAge = () => age;
}
\`\`\`

**3. ES2020 #前缀 (官方支持)**
\`\`\`javascript
class Person {
  #age = 20;
  getAge() { return this.#age; }
}
\`\`\`
尝试在外部访问 \`p.#age\` 会直接报错。`
  },
  {
    id: '37',
    title: '实现一个简化版 EventEmitter',
    category: Category.JAVASCRIPT,
    difficulty: '专家',
    description: '发布订阅模式的核心实现：on, emit, off, once。',
    standardAnswer: `\`\`\`javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(type, handler) {
    if (!this.events[type]) this.events[type] = [];
    this.events[type].push(handler);
  }

  emit(type, ...args) {
    if (this.events[type]) {
      this.events[type].forEach(fn => fn.apply(this, args));
    }
  }

  off(type, handler) {
    if (this.events[type]) {
      this.events[type] = this.events[type].filter(fn => fn !== handler);
    }
  }
  
  once(type, handler) {
    const wrapper = (...args) => {
      handler.apply(this, args);
      this.off(type, wrapper);
    };
    this.on(type, wrapper);
  }
}
\`\`\``
  },
  {
    id: '38',
    title: '实现 Array.prototype.map、reduce',
    category: Category.JAVASCRIPT,
    difficulty: '专家',
    description: '手写数组高阶函数，理解回调参数与累加器的逻辑。',
    standardAnswer: `**1. 实现 map**
\`\`\`javascript
Array.prototype.myMap = function(cb) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(cb(this[i], i, this));
  }
  return result;
};
\`\`\`

**2. 实现 reduce**
\`\`\`javascript
Array.prototype.myReduce = function(cb, initialValue) {
  let acc = initialValue;
  let startIndex = 0;
  
  if (initialValue === undefined) {
    acc = this[0];
    startIndex = 1;
  }
  
  for (let i = startIndex; i < this.length; i++) {
    acc = cb(acc, this[i], i, this);
  }
  return acc;
};
\`\`\``
  },
  {
    id: '39',
    title: '模拟实现 LRU 缓存算法',
    category: Category.JAVASCRIPT,
    difficulty: '专家',
    description: 'Least Recently Used (最近最少使用)。利用 Map 或 双向链表+哈希表实现 O(1) 复杂度。',
    standardAnswer: `**1. 核心思想**
缓存容量有限。当缓存满时，优先淘汰**最久未使用**的数据。
每次访问数据（读取或写入），都将该数据移动到队列头部（标记为最新）。

**2. 最佳数据结构**
**Map** (JavaScript)。JS 的 \`Map\` 保持插入顺序。
● \`keys().next().value\` 可以拿到最先插入（最久未用）的 key。
● 重新 \`set\` 一个已存在的 key，会将其移到 Map 的末尾。

**3. 代码实现**
\`\`\`javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    // 删了重记，移到末尾（最新）
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    this.cache.set(key, value);
    // 超出容量，删除头部（最久未用）
    if (this.cache.size > this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }
}
\`\`\``
  },
  {
    id: '40',
    title: '实现一个 JSON.stringify',
    category: Category.JAVASCRIPT,
    difficulty: '专家',
    description: '处理基本类型、对象、数组以及循环引用检测。',
    standardAnswer: `这是一个复杂的递归过程。简易版思路：
1. **基本类型**：String 加引号，Number/Boolean/Null 直接转字符串。
2. **函数/Undefined/Symbol**：在对象中被忽略，在数组中变 null。
3. **对象/数组**：递归调用。

**代码片段 (对象部分)**
\`\`\`javascript
if (typeof data === 'object') {
  const arr = [];
  for (let key in data) {
    const value = jsonStringify(data[key]);
    if (value !== undefined) {
      arr.push(\`"\${key}":\${value}\`);
    }
  }
  return \`{\${arr.join(',')}}\`;
}
\`\`\``
  },
  {
    id: '41',
    title: '实现一个深比较 isEqual 函数',
    category: Category.JAVASCRIPT,
    difficulty: '专家',
    description: '递归比较两个对象的所有属性值是否相等。',
    standardAnswer: `\`\`\`javascript
function isEqual(obj1, obj2) {
  // 1. 如果是同一引用或基本类型相等
  if (obj1 === obj2) return true;
  
  // 2. 如果不是对象 (或者是 null)，返回 false
  if (typeof obj1 !== 'object' || obj1 === null ||
      typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  // 3. 比较 Keys 长度
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  // 4. 递归比较每一个 Key
  for (let key of keys1) {
    if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  
  return true;
}
\`\`\``
  },
  {
    id: '45',
    title: '手写 debounce + throttle 的组合封装',
    category: Category.JAVASCRIPT,
    difficulty: '专家',
    description: '一个函数同时支持防抖和节流模式，Lodash 源码解析。',
    standardAnswer: `通常通过 \`options\` 参数来控制 \`leading\` (前缘触发) 和 \`trailing\` (后缘触发)。
或者实现一个 \`maxWait\` 选项，当防抖等待时间超过 \`maxWait\` 时，强制执行一次（这就变成了节流）。

这展示了对异步控制流的极致掌控。`
  },
  // --- 第六部分：浏览器与工程化 ---
  {
    id: '47',
    title: 'JS 内存泄漏场景与排查',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: '意外的全局变量、未清理的定时器、闭包引用、脱离 DOM 的引用。',
    standardAnswer: `**1. 常见场景**
● **意外的全局变量**：未声明直接赋值的变量。
● **被遗忘的定时器**：\`setInterval\` 未 \`clearInterval\`。
● **闭包**：持有不再需要的外部变量引用。
● **DOM 引用**：JS 中保存了 DOM 节点的引用，即使节点被 \`remove\`，内存依然无法释放。

**2. 排查工具**
Chrome DevTools -> **Memory** 面板。
使用 **Heap Snapshot** 对比操作前后的内存快照，查找 Detached DOM trees。`
  },
  {
    id: '48',
    title: '性能优化：懒加载、预加载、长列表优化',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: 'Lazy Loading, Preloading, Virtual Scrolling 策略解析。',
    standardAnswer: `**1. 懒加载 (Lazy Loading)**
**核心**：只加载当前用户可视区域内的资源。
**实现**：
● **图片**：\`<img loading="lazy" src="...">\` (原生支持)。
● **JS/组件**：\`IntersectionObserver\` API 监听元素进入视口。

**2. 预加载 (Preloading)**
**核心**：利用浏览器空闲时间，提前加载未来可能用到的资源。
**实现**：
● \`<link rel="preload">\`: 高优先级加载当前页面的关键资源。
● \`<link rel="prefetch">\`: 低优先级加载**下一个页面**的资源。

**3. 长列表优化**
使用**虚拟滚动 (Virtual Scrolling)**。只渲染可视区域内的 DOM 节点，滚动时复用 DOM，避免万级 DOM 导致的页面卡顿。`
  },
  {
    id: '49',
    title: 'JS 单线程模型的本质与浏览器协作机制',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: '为什么 JS 是单线程的？GUI 渲染线程与 JS 引擎线程互斥。',
    standardAnswer: `**1. 为什么是单线程？**
为了避免 DOM 渲染冲突。如果多线程同时操作 DOM，一个添加节点，一个删除节点，浏览器无法判断以谁为准。

**2. 互斥机制**
JS 引擎线程和 GUI 渲染线程是互斥的。当 JS 执行耗时任务（如死循环）时，页面渲染会被阻塞，导致页面卡顿。

**3. Web Workers**
允许 JS 创建多线程，但 Worker 线程**不能操作 DOM**，主要用于计算密集型任务。`
  },
  {
    id: '50',
    title: 'setTimeout 最小延迟是多少？',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: '4ms 的由来，以及 requestAnimationFrame 的优势。',
    standardAnswer: `**1. 最小延迟**
HTML 标准规定，当 \`setTimeout\` 嵌套层级超过 5 层时，最小延迟被强制为 **4ms**。
注意：在未激活的标签页（后台），定时器可能会被节流到 1000ms 执行一次，以节省电量。

**2. 动画推荐**
使用 \`requestAnimationFrame\`。它由浏览器决定执行时机（通常 60fps，约 16.7ms），保证动画流畅，且在页面隐藏时自动暂停。`
  },
  {
    id: '51',
    title: '事件委托的本质与优势场景',
    category: Category.JAVASCRIPT,
    difficulty: '入门',
    description: '利用事件冒泡机制，将事件监听器绑定在父元素上。',
    standardAnswer: `**1. 原理**
利用事件的**冒泡 (Bubble)** 机制。子元素的事件会向上传播到父元素。

**2. 优势**
● **节省内存**：不需要给每个子元素（如列表项）都绑定监听器，只需给父容器绑定一个。
● **动态元素支持**：新增的子元素无需重新绑定事件，天然拥有交互能力。

**3. 注意**
使用 \`event.target\` 获取触发源，\`event.currentTarget\` 获取绑定元素。`
  },
  {
    id: '52',
    title: '什么是执行栈 (Call Stack)？如何造成栈溢出？',
    category: Category.JAVASCRIPT,
    difficulty: '入门',
    description: '栈数据结构在 JS 引擎中的应用。',
    standardAnswer: `**1. 概念**
JS 引擎用来管理函数调用关系的栈结构。遵循**后进先出 (LIFO)** 原则。
调用函数时，推入栈（Push）；函数执行完，弹出栈（Pop）。

**2. 栈溢出 (Stack Overflow)**
当调用栈的层级过深，超过了浏览器限制时抛出。
**常见原因**：无限递归（死循环调用自己，没有终止条件）。`
  },
  {
    id: '53',
    title: 'eval、with 等为何不推荐使用？',
    category: Category.JAVASCRIPT,
    difficulty: '入门',
    description: '安全性、性能优化与代码可读性的考量。',
    standardAnswer: `**1. 安全问题**
\`eval\` 可以执行任意字符串代码，容易导致 **XSS 攻击**。

**2. 性能问题**
JS 引擎无法在编译阶段对 \`eval\` 和 \`with\` 内部的代码进行优化（如变量查找优化），因为无法预测代码的意图，导致运行变慢。

**3. 严格模式**
在 \`"use strict"\` 下，\`with\` 是被禁用的。`
  },
  {
    id: '54',
    title: 'script 标签位置的性能影响',
    category: Category.JAVASCRIPT,
    difficulty: '入门',
    description: '为什么建议写在 body 末尾？defer 和 async 的区别。',
    standardAnswer: `**1. 为什么放底部？**
因为 JS 脚本的下载和执行会**阻塞 HTML 解析**。放在 \`<head>\` 会导致页面白屏时间变长。放在 \`<body>\` 底部可以让页面先渲染出内容。

**2. 现代方案 (defer/async)**
放在 \`<head>\` 并加上属性：
● **defer** (推荐)：异步下载，等 HTML 解析完、DOMContentLoaded 之前按顺序执行。
● **async**：异步下载，下载完立即执行（可能阻塞 HTML，且执行顺序不确定）。`
  },
  {
    id: '55',
    title: '浏览器中的同源策略与 JS 的关系',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: 'Web 安全的基石，协议、域名、端口必须完全一致。',
    standardAnswer: `**1. 定义**
同源策略 (Same-Origin Policy) 限制了从同一个源加载的文档或脚本如何与来自另一个源的资源进行交互。
**同源**：协议、域名、端口三者必须完全相同。

**2. 限制内容**
● 无法读取非同源的 Cookie、LocalStorage。
● 无法获取非同源的 DOM。
● **AJAX 请求发送后被浏览器拦截** (跨域问题)。

**3. 跨域解决方案**
CORS (后端开启), JSONP (老旧), Nginx 反向代理。`
  },
  {
    id: '56',
    title: 'Web 安全：XSS 与 CSRF 防御',
    category: Category.JAVASCRIPT,
    difficulty: '专家',
    description: '前端安全的两大杀手：跨站脚本攻击与跨站请求伪造。',
    standardAnswer: `**1. XSS (跨站脚本攻击)**
**原理**：攻击者在网页中注入恶意脚本 (如 \`<script>\`)，获取用户 Cookie 或敏感信息。
**防御**：
● **转义输入输出**：不要相信用户的任何输入。
● **HttpOnly Cookie**：禁止 JS 读取 Cookie，防止 Session 劫持。
● **CSP (内容安全策略)**：通过 Header 限制浏览器只加载可信域名的脚本。

**2. CSRF (跨站请求伪造)**
**原理**：攻击者诱导用户访问恶意网站，利用用户在目标网站的登录状态 (Cookie)，冒充用户发送请求 (如转账)。
**防御**：
● **SameSite Cookie**：设置 \`SameSite=Strict/Lax\`，禁止跨域发送 Cookie。
● **CSRF Token**：服务器下发随机 Token，请求必须携带此 Token，攻击者无法伪造。
● **验证 Referer/Origin**：检查请求来源。`
  },
  {
    id: '57',
    title: 'CSP (内容安全策略) 介绍',
    category: Category.JAVASCRIPT,
    difficulty: '专家',
    description: '通过白名单机制减少 XSS 攻击风险。',
    standardAnswer: `**1. 核心作用**
Content Security Policy (CSP) 是一个 HTTP Header，允许站点管理者控制用户代理（浏览器）允许为该页面加载哪些资源。

**2. 主要功能**
● **限制脚本源**：只允许加载本域或特定 CDN 的 JS (\`script-src 'self' ...\`)。
● **禁止内联脚本**：禁止 \`<script>...</script>\` 和 \`onclick\`，防止注入。
● **禁止 eval**：防止字符串代码执行。

**3. 配置示例**
\`Content-Security-Policy: default-src 'self'; img-src *;\``
  },
  {
    id: '58',
    title: 'JS 调试能力提升技巧',
    category: Category.JAVASCRIPT,
    difficulty: '进阶',
    description: '断点调试、console 高级用法、performance 性能分析。',
    standardAnswer: `**1. 断点调试 (Debugger)**
不要只用 console.log。在代码中写 \`debugger;\` 或在 DevTools Sources 面板点击行号打断点。
● **条件断点**：右键断点 -> "Edit breakpoint..." -> 输入条件 (如 \`i === 100\`)。

**2. Console 高级用法**
● \`console.table(arr)\`: 表格展示数据。
● \`console.time('label')\` / \`console.timeEnd('label')\`: 计算代码执行耗时。
● \`console.dir(obj)\`: 打印对象结构。

**3. Performance 面板**
录制页面运行过程，分析 **Main 线程** 火焰图，找出耗时的 JS 函数或重排重绘 (Layout/Paint) 瓶颈。`
  },
  // --- 第七部分：新增精选题目 (来自文档) ---
  {
      id: '59',
      title: 'GET 和 POST 的本质区别',
      category: Category.JAVASCRIPT,
      difficulty: '入门',
      description: '除了参数位置不同，它们在语义、缓存和数据包发送上有什么区别？',
      standardAnswer: `**1. 语义区别 (Restful)**
● **GET**:以此获取资源，是幂等的 (Idempotent)，多次请求结果一致，不产生副作用。
● **POST**: 用于提交资源，非幂等，会对服务器产生副作用 (如创建新数据)。

**2. 缓存行为**
● **GET**: 会被浏览器主动缓存，历史记录中可查。
● **POST**: 默认不会被缓存。

**3. 数据包发送 (TCP 层面)**
● **GET**: 产生一个 TCP 数据包 (Header 和 Data 一起发)。
● **POST**: 产生两个 TCP 数据包 (先发 Header，服务器响应 100 Continue，再发 Data)。
*(注：部分浏览器如 Firefox 对 POST 也只发一个包)*`
  },
  {
      id: '60',
      title: '什么是 BFC (块级格式化上下文)？',
      category: Category.JAVASCRIPT,
      difficulty: '进阶',
      description: 'CSS 布局的神器，解决高度塌陷和外边距折叠。',
      standardAnswer: `**1. 定义**
BFC (Block Formatting Context) 是一个独立的渲染区域，内部元素的渲染不会影响边界以外的元素。

**2. 触发条件**
● float 不为 none。
● position 为 absolute 或 fixed。
● overflow 不为 visible (如 hidden, auto)。
● display 为 inline-block, flex, grid 等。

**3. 应用场景**
● **清除浮动**：父元素高度塌陷时，给父元素设 \`overflow: hidden\` 触发 BFC。
● **防止 Margin 重叠**：属于不同 BFC 的相邻元素，Margin 不会重叠。
● **自适应两栏布局**：左边 float，右边 \`overflow: hidden\`。`
  },
   {
      id: '61',
      title: '浏览器缓存机制 (强缓存 vs 协商缓存)',
      category: Category.JAVASCRIPT,
      difficulty: '进阶',
      description: 'Expires, Cache-Control, ETag, Last-Modified 详解。',
      standardAnswer: `**1. 强缓存 (本地缓存)**
浏览器直接读取本地缓存，不请求服务器。状态码 **200 (from memory/disk cache)**。
● **Expires**: 绝对时间 (HTTP/1.0)，受本地时间影响。
● **Cache-Control**: 相对时间 (HTTP/1.1)，优先级高。如 \`max-age=3600\`。

**2. 协商缓存 (对比缓存)**
强缓存失效后，请求服务器。服务器判断文件未修改，返回 **304 Not Modified**，继续用本地的。
● **Last-Modified / If-Modified-Since**: 基于文件修改时间 (秒级，可能不准)。
● **Etag / If-None-Match**: 基于文件内容哈希 (更精准，优先级更高)。

**3. 总结**
优先查强缓存 -> 没命中 -> 查协商缓存 -> 没命中 -> 返回 200 新资源。`
  },
  {
      id: '62',
      title: 'Vue 双向绑定的原理 (Vue2 vs Vue3)',
      category: Category.JAVASCRIPT,
      difficulty: '进阶',
      description: 'Object.defineProperty 与 Proxy 的区别。',
      standardAnswer: `**1. Vue 2 (Object.defineProperty)**
递归遍历 data 对象，使用 \`Object.defineProperty\` 劫持数据的 \`getter\` 和 \`setter\`。
● **缺点**：无法监听对象新增/删除属性；无法监听数组下标变化 (需要 hack 方法)。

**2. Vue 3 (Proxy)**
使用 ES6 的 \`Proxy\` 代理整个对象。
● **优点**：可以直接监听对象和数组的变化；性能更好 (懒代理)；不需要递归初始化。

**3. 发布订阅模式**
不管是 Vue2 还是 Vue3，核心都是：数据劫持 + 发布订阅模式 (Dep 收集 Watcher，数据变动通知 Watcher 更新视图)。`
  }
];

// --- 面试页：互联网大厂面试题 ---
export const INTERVIEW_QUESTIONS: Question[] = [
  // --- 阿里 ---
  createQ('ali_1', Category.ALIBABA, '使用过的 koa2 中间件', '入门'),
  createQ('ali_2', Category.ALIBABA, 'koa-body 原理', '专家'),
  createQ('ali_3', Category.ALIBABA, '介绍自己写过的中间件', '进阶'),
  createQ('ali_4', Category.ALIBABA, '有没有涉及到 Cluster', '进阶'),
  createQ('ali_5', Category.ALIBABA, '介绍 pm2', '入门'),
  createQ('ali_6', Category.ALIBABA, 'master 挂了的话 pm2 怎么处理', '专家'),
  createQ('ali_7', Category.ALIBABA, '如何和 MySQL 进行通信', '入门'),
  createQ('ali_8', Category.ALIBABA, 'React 生命周期及自己的理解', '入门'),
  createQ('ali_9', Category.ALIBABA, '如何配置 React-Router', '入门'),
  createQ('ali_10', Category.ALIBABA, '路由的动态加载模块', '进阶'),
  createQ('ali_11', Category.ALIBABA, '服务端渲染 SSR', '专家'),
  createQ('ali_12', Category.ALIBABA, '介绍路由的 history', '进阶'),
  createQ('ali_13', Category.ALIBABA, '介绍 Redux 数据流的流程', '入门'),
  createQ('ali_14', Category.ALIBABA, 'Redux 如何实现多个组件之间的通信', '进阶'),
  createQ('ali_15', Category.ALIBABA, '多个组件之间如何拆分各自的 state 与公共状态管理', '专家'),
  createQ('ali_16', Category.ALIBABA, '使用过的 Redux 中间件', '入门'),
  createQ('ali_17', Category.ALIBABA, '如何解决跨域的问题', '入门'),
  createQ('ali_18', Category.ALIBABA, '常见 Http 请求头', '入门'),
  createQ('ali_19', Category.ALIBABA, '移动端适配 1px 的问题', '进阶'),
  createQ('ali_20', Category.ALIBABA, '介绍 flex 布局', '入门'),
  createQ('ali_21', Category.ALIBABA, '其他 css 方式设置垂直居中', '入门'),
  createQ('ali_22', Category.ALIBABA, '居中为什么要使用 transform（为什么不使用 marginLeft/Top）', '进阶'),
  createQ('ali_23', Category.ALIBABA, '使用过 webpack 里面哪些 plugin 和 loader', '入门'),
  createQ('ali_24', Category.ALIBABA, 'webpack 里面的插件是怎么实现的', '专家'),
  createQ('ali_25', Category.ALIBABA, 'dev-server 是怎么跑起来', '进阶'),
  createQ('ali_26', Category.ALIBABA, '项目优化', '进阶'),
  createQ('ali_27', Category.ALIBABA, '抽取公共文件是怎么配置的', '进阶'),
  createQ('ali_28', Category.ALIBABA, '项目中如何处理安全问题', '进阶'),
  createQ('ali_29', Category.ALIBABA, '怎么实现 this 对象的深拷贝', '进阶'),

  // --- 网易 ---
  createQ('ne_1', Category.NETEASE, '介绍 redux，主要解决什么问题', '入门'),
  createQ('ne_2', Category.NETEASE, '文件上传如何做断点续传', '专家'),
  createQ('ne_3', Category.NETEASE, '表单可以跨域吗', '入门'),
  createQ('ne_4', Category.NETEASE, 'promise、async 有什么区别', '入门'),
  createQ('ne_5', Category.NETEASE, '搜索请求如何处理（防抖）', '进阶'),
  createQ('ne_6', Category.NETEASE, '搜索请求中中文如何请求', '入门'),
  createQ('ne_7', Category.NETEASE, '介绍观察者模式', '进阶'),
  createQ('ne_8', Category.NETEASE, '介绍中介者模式', '进阶'),
  createQ('ne_9', Category.NETEASE, '观察者和订阅-发布的区别，各自用在哪里', '进阶'),
  createQ('ne_10', Category.NETEASE, '介绍 react 优化', '进阶'),
  createQ('ne_11', Category.NETEASE, '介绍 http2.0', '进阶'),
  createQ('ne_12', Category.NETEASE, '通过什么做到并发请求', '进阶'),
  createQ('ne_13', Category.NETEASE, 'http1.1 时如何复用 tcp 连接', '进阶'),
  createQ('ne_14', Category.NETEASE, '介绍 service worker', '专家'),
  createQ('ne_15', Category.NETEASE, '介绍 css3 中 position:sticky', '入门'),
  createQ('ne_16', Category.NETEASE, 'redux 请求中间件如何处理并发', '专家'),
  createQ('ne_17', Category.NETEASE, '介绍 Promise，异常捕获', '入门'),
  createQ('ne_18', Category.NETEASE, '介绍 position 属性包括 CSS3 新增', '入门'),
  createQ('ne_19', Category.NETEASE, '浏览器事件流向', '入门'),
  createQ('ne_20', Category.NETEASE, '介绍事件代理以及优缺点', '入门'),
  createQ('ne_21', Category.NETEASE, 'React 组件中怎么做事件代理', '进阶'),
  createQ('ne_22', Category.NETEASE, 'React 组件事件代理的原理', '专家'),
  createQ('ne_23', Category.NETEASE, '介绍 this 各种情况', '入门'),
  createQ('ne_24', Category.NETEASE, '前端怎么控制管理路由', '进阶'),
  createQ('ne_25', Category.NETEASE, '使用路由时出现问题如何解决', '进阶'),
  createQ('ne_26', Category.NETEASE, 'React 怎么做数据的检查和变化', '进阶'),

  // --- 滴滴 ---
  createQ('didi_1', Category.DIDI, 'react-router 怎么实现路由切换', '进阶'),
  createQ('didi_2', Category.DIDI, 'react-router 里的 <Link> 标签和 <a> 标签有什么区别', '入门'),
  createQ('didi_3', Category.DIDI, '<a> 标签默认事件禁止后加了什么才实现了跳转', '进阶'),
  createQ('didi_4', Category.DIDI, 'React 层面的性能优化', '进阶'),
  createQ('didi_5', Category.DIDI, '整个前端性能优化大概分几类', '进阶'),
  createQ('didi_6', Category.DIDI, 'antd 分箱加载（Tree Shaking）是怎么做到的', '专家'),
  createQ('didi_7', Category.DIDI, '使用 import 时，webpack 对 node_modules 里的依赖会做什么', '专家'),
  createQ('didi_8', Category.DIDI, 'JS 异步解决方案的发展历程以及优缺点', '进阶'),
  createQ('didi_9', Category.DIDI, 'Http 报文的请求会有几个部分', '入门'),
  createQ('didi_10', Category.DIDI, 'cookie 存在的价值', '入门'),
  createQ('didi_11', Category.DIDI, 'cookie 和 token 都在 header，为什么只劫持前者', '进阶'),
  createQ('didi_12', Category.DIDI, 'cookie 和 session 有哪些方面的区别', '入门'),
  createQ('didi_13', Category.DIDI, 'React 中 Dom 结构发生变化后内部经历了哪些变化', '专家'),
  createQ('didi_14', Category.DIDI, 'React 挂载时的 3 个组件与更新调度机制', '专家'),
  createQ('didi_15', Category.DIDI, 'key 主要解决哪一类的问题，为什么不建议用索引 index', '入门'),
  createQ('didi_16', Category.DIDI, 'Redux 中异步的请求怎么处理', '入门'),
  createQ('didi_17', Category.DIDI, 'Redux 中间件是什么东西，接受几个参数', '进阶'),
  createQ('didi_18', Category.DIDI, '柯里化函数内部的参数具体是什么东西', '进阶'),
  createQ('didi_19', Category.DIDI, '中间件怎么拿到 store 和 action，然后怎么处理', '专家'),
  createQ('didi_20', Category.DIDI, 'state 是怎么注入到组件的', '进阶'),
  createQ('didi_21', Category.DIDI, 'koa 中 response.send/json 发生了什么', '进阶'),
  createQ('didi_22', Category.DIDI, 'koa-bodyparser 怎么来解析 request', '进阶'),
  createQ('didi_23', Category.DIDI, 'webpack 整个生命周期，loader 和 plugin 有什么区别', '进阶'),
  createQ('didi_24', Category.DIDI, '介绍 AST (Abstract Syntax Tree) 抽象语法树', '专家'),
  createQ('didi_25', Category.DIDI, '安卓 Activity 之间数据是怎么传递的', '专家'),
  createQ('didi_26', Category.DIDI, 'WebView 对 js 兼容性的变化', '专家'),
  createQ('didi_27', Category.DIDI, 'WebView 和原生是如何通信', '进阶'),
  createQ('didi_28', Category.DIDI, '跨域怎么解决，有没有使用过 Apache 等方案', '进阶'),

  // --- 今日头条 ---
  createQ('tt_1', Category.TOUTIAO, '对 async、await 的理解，内部原理', '进阶'),
  createQ('tt_2', Category.TOUTIAO, '介绍下 Promise，内部实现', '专家'),
  createQ('tt_3', Category.TOUTIAO, '清除浮动', '入门'),
  createQ('tt_4', Category.TOUTIAO, '定位问题（绝对定位、相对定位等）', '入门'),
  createQ('tt_5', Category.TOUTIAO, '从输入 URL 到页面加载全过程', '进阶'),
  createQ('tt_6', Category.TOUTIAO, 'TCP 三次握手', '进阶'),
  createQ('tt_7', Category.TOUTIAO, 'TCP 属于哪一层', '入门'),
  createQ('tt_8', Category.TOUTIAO, 'Redux 的设计思想', '进阶'),
  createQ('tt_9', Category.TOUTIAO, '接入 Redux 的过程', '入门'),
  createQ('tt_10', Category.TOUTIAO, '绑定 connect 的过程', '进阶'),
  createQ('tt_11', Category.TOUTIAO, 'connect 原理', '专家'),
  createQ('tt_12', Category.TOUTIAO, 'Webpack 介绍', '入门'),
  createQ('tt_13', Category.TOUTIAO, '== 和 === 的区别，什么情况下用相等 ==', '入门'),
  createQ('tt_14', Category.TOUTIAO, 'bind、call、apply 的区别', '入门'),
  createQ('tt_15', Category.TOUTIAO, '动画的了解', '进阶'),
  createQ('tt_16', Category.TOUTIAO, '介绍下原型链（解决的是继承问题吗）', '进阶'),
  createQ('tt_17', Category.TOUTIAO, '对跨域的了解', '入门'),

  // --- 有赞 ---
  createQ('yz_1', Category.YOUZAN, 'Linux 754 介绍', '专家'),
  createQ('yz_2', Category.YOUZAN, '介绍冒泡排序，选择排序，冒泡排序如何优化', '入门'),
  createQ('yz_3', Category.YOUZAN, 'transform 动画和直接使用 left、top 的优缺点', '进阶'),
  createQ('yz_4', Category.YOUZAN, '如何判断链表是否有环', '进阶'),
  createQ('yz_5', Category.YOUZAN, '介绍二叉搜索树的特点', '进阶'),
  createQ('yz_6', Category.YOUZAN, '介绍暂时性死区 (TDZ)', '入门'),
  createQ('yz_7', Category.YOUZAN, 'ES6 中的 map 和原生的对象有什么区别', '入门'),
  createQ('yz_8', Category.YOUZAN, '观察者和发布-订阅的区别', '进阶'),
  createQ('yz_9', Category.YOUZAN, 'React 异步渲染的概念 (Time Slicing 和 Suspense)', '专家'),
  createQ('yz_10', Category.YOUZAN, 'React 16.X 生命周期的改变', '进阶'),
  createQ('yz_11', Category.YOUZAN, '16.X 中 props 改变后在哪个生命周期中处理', '进阶'),
  createQ('yz_12', Category.YOUZAN, '介绍劫持函数', '专家'),
  createQ('yz_13', Category.YOUZAN, '前端性能优化', '进阶'),
  createQ('yz_14', Category.YOUZAN, 'pureComponent 和 FunctionComponent 区别', '入门'),
  createQ('yz_15', Category.YOUZAN, '介绍 JSX', '入门'),
  createQ('yz_16', Category.YOUZAN, '如何做 RN 在安卓和 iOS 端的适配', '进阶'),
  createQ('yz_17', Category.YOUZAN, 'RN 为什么能在原生中绘制成原生组件', '专家'),
  createQ('yz_18', Category.YOUZAN, '介绍虚拟 DOM', '入门'),
  createQ('yz_19', Category.YOUZAN, '如何设计一个 localStorage，保证数据的时效性', '进阶'),
  createQ('yz_20', Category.YOUZAN, '如何设计 Promise.all()', '专家'),
  createQ('yz_21', Category.YOUZAN, '介绍高阶组件', '进阶'),
  createQ('yz_22', Category.YOUZAN, 'sum(2, 3) 实现 sum(2)(3) 的效果', '进阶'),
  createQ('yz_23', Category.YOUZAN, 'React 性能优化', '进阶'),
  createQ('yz_24', Category.YOUZAN, '两个对象如何比较', '进阶'),

  // --- 挖财 ---
  createQ('wc_1', Category.WACAI, 'JS 的原型', '入门'),
  createQ('wc_2', Category.WACAI, '变量作用域链', '入门'),
  createQ('wc_3', Category.WACAI, 'call、apply、bind 的区别', '入门'),
  createQ('wc_4', Category.WACAI, '防抖和节流的区别', '入门'),
  createQ('wc_5', Category.WACAI, '介绍各种异步方案', '进阶'),
  createQ('wc_6', Category.WACAI, 'React 生命周期', '入门'),
  createQ('wc_7', Category.WACAI, '介绍 Fiber', '专家'),
  createQ('wc_8', Category.WACAI, '前端性能优化', '进阶'),
  createQ('wc_9', Category.WACAI, '介绍 DOM 树对比 (Diffing)', '进阶'),
  createQ('wc_10', Category.WACAI, 'React 中的 key 的作用', '入门'),
  createQ('wc_11', Category.WACAI, '如何设计状态树', '专家'),
  createQ('wc_12', Category.WACAI, '介绍 CSRF, XSRF', '进阶'),
  createQ('wc_13', Category.WACAI, 'Http 缓存控制', '进阶'),
  createQ('wc_14', Category.WACAI, '项目中如何应用数据结构', '进阶'),
  createQ('wc_15', Category.WACAI, 'Native 提供了什么能力给 RN', '专家'),
  createQ('wc_16', Category.WACAI, '如何做工程上的优化', '进阶'),
  createQ('wc_17', Category.WACAI, 'shouldComponentUpdate 是为了解决什么问题', '入门'),
  createQ('wc_18', Category.WACAI, '如何解决 props 层级过深的问题', '入门'),
  createQ('wc_19', Category.WACAI, '前端怎么做单元测试', '进阶'),
  createQ('wc_20', Category.WACAI, 'Webpack 生命周期', '专家'),
  createQ('wc_21', Category.WACAI, 'Webpack 打包的整个过程', '专家'),
  createQ('wc_22', Category.WACAI, '常用的 plugins', '入门'),
  createQ('wc_23', Category.WACAI, 'pm2 怎么做进程管理，进程挂掉怎么处理', '进阶'),
  createQ('wc_24', Category.WACAI, '不用 pm2 怎么做进程管理', '专家'),

  // --- 沪江 ---
  createQ('hj_1', Category.HUJIANG, '介绍下浏览器跨域', '入门'),
  createQ('hj_2', Category.HUJIANG, '怎么解决跨域问题', '入门'),
  createQ('hj_3', Category.HUJIANG, 'JSONP 方案需要服务端怎么配合', '进阶'),
  createQ('hj_4', Category.HUJIANG, 'Ajax 发生跨域要设置什么 (前端)', '入门'),
  createQ('hj_5', Category.HUJIANG, 'CORS 请求正式成功的过程', '进阶'),
  createQ('hj_6', Category.HUJIANG, 'XSRF 跨域攻击的安全性问题怎么防范', '进阶'),
  createQ('hj_7', Category.HUJIANG, '使用 Async 会注意哪些东西', '入门'),
  createQ('hj_8', Category.HUJIANG, 'Async 里面有多个 await 请求，可以怎么优化', '进阶'),
  createQ('hj_9', Category.HUJIANG, 'Promise 和 Async 处理失败的时候有什么区别', '入门'),
  createQ('hj_10', Category.HUJIANG, 'Redux 解决了 React 本身不能解决的什么问题', '入门'),
  createQ('hj_11', Category.HUJIANG, 'Redux 有没有做过封装', '进阶'),
  createQ('hj_12', Category.HUJIANG, 'React 常用的生命周期', '入门'),
  createQ('hj_13', Category.HUJIANG, '对应组件的生命周期做什么事', '入门'),
  createQ('hj_14', Category.HUJIANG, '遇到性能问题一般在哪个生命周期里解决', '进阶'),
  createQ('hj_15', Category.HUJIANG, '怎么做性能优化', '进阶'),
  createQ('hj_16', Category.HUJIANG, '写 React 有哪些细节可以优化', '进阶'),
  createQ('hj_17', Category.HUJIANG, 'React 的事件机制', '专家'),
  createQ('hj_18', Category.HUJIANG, '介绍事件代理，主要解决什么问题', '入门'),
  createQ('hj_19', Category.HUJIANG, '前端开发中用到哪些设计模式', '进阶'),
  createQ('hj_20', Category.HUJIANG, 'React/Redux 中哪些功能用到了这些设计模式', '进阶'),
  createQ('hj_21', Category.HUJIANG, 'JS 变量类型分为几种，区别是什么', '入门'),
  createQ('hj_22', Category.HUJIANG, 'JS 里垃圾回收机制是什么', '进阶'),
  createQ('hj_23', Category.HUJIANG, '一般怎么组织 CSS (Webpack)', '进阶'),

  // --- 饿了么 ---
  createQ('elm_1', Category.ELEME, '小程序里面页面最多多少', '入门'),
  createQ('elm_2', Category.ELEME, 'React 子父组件之间如何传值', '入门'),
  createQ('elm_3', Category.ELEME, 'Emit 事件怎么发', '入门'),
  createQ('elm_4', Category.ELEME, '介绍下 React 高阶组件', '进阶'),
  createQ('elm_5', Category.ELEME, 'React 如何渲染出全部的 name', '入门'),
  createQ('elm_6', Category.ELEME, '在哪个生命周期里写', '入门'),
  createQ('elm_7', Category.ELEME, '其中有几个 name 不存在，通过异步接口获取，如何做', '进阶'),
  createQ('elm_8', Category.ELEME, '渲染的时候 key 给什么值，可以使用 index 吗', '入门'),
  createQ('elm_9', Category.ELEME, 'Webpack 如何配置 sass/css，需要哪些 loader', '进阶'),
  createQ('elm_10', Category.ELEME, '如何配置把 js、css、html 单独打包成一个文件', '进阶'),
  createQ('elm_11', Category.ELEME, 'div 垂直水平居中 (flex、绝对定位)', '入门'),
  createQ('elm_12', Category.ELEME, '两个元素块，一左一右，中间相距 10 像素', '入门'),
  createQ('elm_13', Category.ELEME, '上下固定，中间滚动布局如何实现', '入门'),
  createQ('elm_14', Category.ELEME, '[1,2,3,4,5] 变成 [1,2,3,a,b,5]', '入门'),
  createQ('elm_15', Category.ELEME, '取数组的最大值 (ES5、ES6)', '入门'),
  createQ('elm_16', Category.ELEME, 'apply 和 call 的区别', '入门'),
  createQ('elm_17', Category.ELEME, 'ES5 和 ES6 有什么区别', '入门'),
  createQ('elm_18', Category.ELEME, 'some、every、find、filter、map、forEach 有什么区别', '入门'),
  createQ('elm_19', Category.ELEME, '上述数组随机取数，每次返回的值都不一样', '进阶'),
  createQ('elm_20', Category.ELEME, '如何找 0-5 的随机整数，95-99 呢', '入门'),
  createQ('elm_21', Category.ELEME, '页面上有 1 万个 button 如何绑定事件', '进阶'),
  createQ('elm_22', Category.ELEME, '页面上生成 1 万个 button 如何做 (JS 原生)', '进阶'),
  createQ('elm_23', Category.ELEME, '循环绑定时的 index 是多少，怎么解决', '入门'),
  createQ('elm_24', Category.ELEME, 'input 改变后 p 标签跟着变化 (MVVM)', '入门'),
  createQ('elm_25', Category.ELEME, '监听 input 的哪个事件', '入门'),

  // --- 携程 ---
  createQ('ct_1', Category.CTRIP, '对 React 看法，有没有遇到一些坑', '进阶'),
  createQ('ct_2', Category.CTRIP, '对闭包的看法，为什么要用闭包', '入门'),
  createQ('ct_3', Category.CTRIP, '手写数组去重函数', '进阶'),
  createQ('ct_4', Category.CTRIP, '手写数组扁平化函数', '进阶'),
  createQ('ct_5', Category.CTRIP, '介绍下 Promise 的用途和性质', '入门'),
  createQ('ct_6', Category.CTRIP, 'Promise 和 Callback 有什么区别', '入门'),
  createQ('ct_7', Category.CTRIP, 'React 生命周期', '入门'),
  createQ('ct_8', Category.CTRIP, '手写两道算法题', '专家'),

  // --- 喜马拉雅 ---
  createQ('xm_1', Category.XIMALAYA, 'ES6 新特性', '入门'),
  createQ('xm_2', Category.XIMALAYA, '介绍 Promise', '入门'),
  createQ('xm_3', Category.XIMALAYA, 'Promise 有几个状态', '入门'),
  createQ('xm_4', Category.XIMALAYA, '说一下闭包', '入门'),
  createQ('xm_5', Category.XIMALAYA, 'React 的生命周期', '入门'),
  createQ('xm_6', Category.XIMALAYA, 'componentWillReceiveProps 的触发条件是什么', '进阶'),
  createQ('xm_7', Category.XIMALAYA, 'React 16.3 对生命周期的改变', '进阶'),
  createQ('xm_8', Category.XIMALAYA, '介绍下 React 的 Fiber 架构', '专家'),
  createQ('xm_9', Category.XIMALAYA, '画 Fiber 渲染树', '专家'),
  createQ('xm_10', Category.XIMALAYA, '介绍 React 高阶组件', '进阶'),
  createQ('xm_11', Category.XIMALAYA, '父子组件之间如何通信', '入门'),
  createQ('xm_12', Category.XIMALAYA, 'Redux 怎么实现属性传递，介绍下原理', '进阶'),
  createQ('xm_13', Category.XIMALAYA, 'React-Router 版本号', '入门'),
  createQ('xm_14', Category.XIMALAYA, '网站 SEO 怎么处理', '进阶'),
  createQ('xm_15', Category.XIMALAYA, '介绍下 HTTP 状态码', '入门'),
  createQ('xm_16', Category.XIMALAYA, '403、301、302 是什么', '入门'),
  createQ('xm_17', Category.XIMALAYA, '缓存相关的 HTTP 请求头', '进阶'),
  createQ('xm_18', Category.XIMALAYA, '介绍 HTTPS', '进阶'),
  createQ('xm_19', Category.XIMALAYA, 'HTTPS 怎么建立安全通道', '专家'),
  createQ('xm_20', Category.XIMALAYA, '前端性能优化 (JS 原生和 React)', '进阶'),
  createQ('xm_21', Category.XIMALAYA, '用户体验做过什么优化', '进阶'),
  createQ('xm_22', Category.XIMALAYA, '对 PWA 有什么了解', '专家'),
  createQ('xm_23', Category.XIMALAYA, '对安全有什么了解', '进阶'),
  createQ('xm_24', Category.XIMALAYA, '介绍下数字签名的原理', '专家'),
  createQ('xm_25', Category.XIMALAYA, '前后端通信使用什么方案', '入门'),
  createQ('xm_26', Category.XIMALAYA, 'RESTful 常用的 Method', '入门'),
  createQ('xm_27', Category.XIMALAYA, '介绍下跨域', '入门'),
  createQ('xm_28', Category.XIMALAYA, 'Access-Control-Allow-Origin 在服务端哪里配置', '进阶'),
  createQ('xm_29', Category.XIMALAYA, 'csrf 跨站攻击怎么解决', '进阶'),
  createQ('xm_30', Category.XIMALAYA, '前端和后端怎么联调', '入门'),

  // --- 兑吧 ---
  createQ('db_1', Category.DUIBA, 'localStorage 和 cookie 有什么区别', '入门'),
  createQ('db_2', Category.DUIBA, 'CSS 选择器优先级', '入门'),
  createQ('db_3', Category.DUIBA, '盒子模型，以及标准情况和 IE 下的区别', '入门'),
  createQ('db_4', Category.DUIBA, '如何实现高度自适应', '入门'),
  createQ('db_5', Category.DUIBA, 'prototype 和 __proto__ 区别', '进阶'),
  createQ('db_6', Category.DUIBA, '_construct 是什么', '进阶'),
  createQ('db_7', Category.DUIBA, 'new 是怎么实现的', '进阶'),
  createQ('db_8', Category.DUIBA, 'Promise 的精髓，以及优缺点', '进阶'),
  createQ('db_9', Category.DUIBA, '如何实现 H5 手机端的适配', '进阶'),
  createQ('db_10', Category.DUIBA, 'rem、flex 的区别 (root em)', '入门'),
  createQ('db_11', Category.DUIBA, 'em 和 px 的区别', '入门'),
  createQ('db_12', Category.DUIBA, 'React 声明周期', '入门'),
  createQ('db_13', Category.DUIBA, '如何去除 url 中的井号', '入门'),
  createQ('db_14', Category.DUIBA, 'Redux 状态管理器和变量挂载到 window 中有什么区别', '进阶'),
  createQ('db_15', Category.DUIBA, 'webpack 和 gulp 的优缺点', '进阶'),
  createQ('db_16', Category.DUIBA, '如何实现异步加载', '进阶'),
  createQ('db_17', Category.DUIBA, '如何实现分模块打包（多入口）', '专家'),
  createQ('db_18', Category.DUIBA, '前端性能优化（6点）', '进阶'),
  createQ('db_19', Category.DUIBA, '并发请求资源数上限（6个）', '入门'),
  createQ('db_20', Category.DUIBA, 'base64 为什么能提升性能，缺点', '入门'),
  createQ('db_21', Category.DUIBA, '介绍 webp 这个图片文件格式', '入门'),
  createQ('db_22', Category.DUIBA, '介绍 koa2', '入门'),
  createQ('db_23', Category.DUIBA, 'Promise 如何实现的', '专家'),
  createQ('db_24', Category.DUIBA, '异步请求，低版本 fetch 如何做版本适配', '进阶'),
  createQ('db_25', Category.DUIBA, 'ajax 如何处理跨域', '入门'),
  createQ('db_26', Category.DUIBA, 'CORS 如何设置', '进阶'),
  createQ('db_27', Category.DUIBA, 'jsonp 为什么不支持 post 方法', '入门'),
  createQ('db_28', Category.DUIBA, '介绍观察者模式', '进阶'),
  createQ('db_29', Category.DUIBA, 'React 使用过的一些组件', '入门'),
  createQ('db_30', Category.DUIBA, '介绍 immutable', '进阶'),
  createQ('db_31', Category.DUIBA, '介绍下 redux 整个流程整理', '进阶'),
  createQ('db_32', Category.DUIBA, '介绍原型链', '进阶'),
  createQ('db_33', Category.DUIBA, '如何继承', '进阶'),

  // --- 微医 ---
  createQ('wy_1', Category.WEIYI, '介绍 JS 数据类型，基本与引用类型的区别', '入门'),
  createQ('wy_2', Category.WEIYI, 'Array 是 Object 类型吗', '入门'),
  createQ('wy_3', Category.WEIYI, '数据类型分别存在哪里', '入门'),
  createQ('wy_4', Category.WEIYI, '栈和堆的区别', '进阶'),
  createQ('wy_5', Category.WEIYI, '垃圾回收中栈和堆的区别', '专家'),
  createQ('wy_6', Category.WEIYI, '数组取第一个元素和第 10 万个元素的时间差', '专家'),
  createQ('wy_7', Category.WEIYI, '栈和堆具体怎么存储', '专家'),
  createQ('wy_8', Category.WEIYI, '介绍闭包以及闭包为什么不清除', '进阶'),
  createQ('wy_9', Category.WEIYI, '闭包的使用场景', '进阶'),
  createQ('wy_10', Category.WEIYI, 'JS 怎么实现异步', '入门'),
  createQ('wy_11', Category.WEIYI, '异步整个执行周期', '进阶'),
  createQ('wy_12', Category.WEIYI, 'Promise 的三种状态', '入门'),
  createQ('wy_13', Category.WEIYI, 'Async/Await 怎么实现', '进阶'),
  createQ('wy_14', Category.WEIYI, 'Promise 和 setTimeout 执行先后的区别', '进阶'),
  createQ('wy_15', Category.WEIYI, 'JS 为什么要区分微任务和宏任务', '专家'),
  createQ('wy_16', Category.WEIYI, 'Promise 构造函数和 then 的同步异步问题', '进阶'),
  createQ('wy_17', Category.WEIYI, '发布-订阅和观察者模式的区别', '进阶'),
  createQ('wy_18', Category.WEIYI, 'JS 执行过程中分为哪些阶段', '专家'),
  createQ('wy_19', Category.WEIYI, '词法作用域和 this 的区别', '进阶'),
  createQ('wy_20', Category.WEIYI, '平常是怎么做错误监控', '进阶'),
  createQ('wy_21', Category.WEIYI, '探测员和报警员', '专家'),
  createQ('wy_22', Category.WEIYI, 'lodash 深拷贝实现原理', '专家'),
  createQ('wy_23', Category.WEIYI, 'ES6 中 let 作用域是怎么实现的', '专家'),
  createQ('wy_24', Category.WEIYI, 'React 中 setState 后发生了什么 (同步/异步)', '专家'),
  createQ('wy_25', Category.WEIYI, '为什么出现很多 native (RN) 框架', '进阶'),
  createQ('wy_26', Category.WEIYI, '虚拟 DOM 主要做了什么', '进阶'),
  createQ('wy_27', Category.WEIYI, '虚拟 DOM 本身是什么', '入门'),
  createQ('wy_28', Category.WEIYI, '304 是什么', '入门'),
  createQ('wy_29', Category.WEIYI, '打包时 Hash 码是怎么生成的', '专家'),
  createQ('wy_30', Category.WEIYI, '随机值存在一样的情况，如何避免', '进阶'),
  createQ('wy_31', Category.WEIYI, 'webpack 构建时的自定义操作', '专家'),
  createQ('wy_32', Category.WEIYI, 'webpack 做了什么', '进阶'),
  createQ('wy_33', Category.WEIYI, '如何保证 Promise 顺序执行 (a,b -> aba)', '进阶'),
  createQ('wy_34', Category.WEIYI, 'RN 有没有做热加载', '进阶'),
  createQ('wy_35', Category.WEIYI, 'RN 遇到的兼容性问题', '进阶'),
  createQ('wy_36', Category.WEIYI, 'RN 如何实现一个原生的组件', '专家'),
  createQ('wy_37', Category.WEIYI, 'RN 混原生和原生混 RN 有什么不同', '专家'),
  createQ('wy_38', Category.WEIYI, '什么是单页项目', '入门'),
  createQ('wy_39', Category.WEIYI, '遇到的复杂业务场景', '进阶'),
  createQ('wy_40', Category.WEIYI, 'Promise.all 实现原理', '专家'),

  // --- 寺库 ---
  createQ('sk_1', Category.SECOO, '介绍 Promise 的特性，优缺点', '入门'),
  createQ('sk_2', Category.SECOO, '介绍 Redux', '入门'),
  createQ('sk_3', Category.SECOO, 'RN 的原理，为什么可以跨端运行', '专家'),
  createQ('sk_4', Category.SECOO, 'RN 如何调用原生的一些功能', '专家'),
  createQ('sk_5', Category.SECOO, '介绍 RN 的缺点', '进阶'),
  createQ('sk_6', Category.SECOO, '介绍排序算法和快排原理', '进阶'),
  createQ('sk_7', Category.SECOO, '堆和栈的区别', '进阶'),
  createQ('sk_8', Category.SECOO, '介绍闭包', '入门'),
  createQ('sk_9', Category.SECOO, '闭包的核心是什么', '进阶'),
  createQ('sk_10', Category.SECOO, '网络五层模型', '进阶'),
  createQ('sk_11', Category.SECOO, 'HTTP 和 HTTPS 的区别', '入门'),
  createQ('sk_12', Category.SECOO, 'HTTPS 的加密过程', '专家'),
  createQ('sk_13', Category.SECOO, '介绍 SSL 和 TLS', '专家'),
  createQ('sk_14', Category.SECOO, '介绍 DNS 解析', '进阶'),
  createQ('sk_15', Category.SECOO, 'JS 的继承方法', '进阶'),
  createQ('sk_16', Category.SECOO, '介绍垃圾回收', '进阶'),
  createQ('sk_17', Category.SECOO, 'cookie 的引用为了解决什么问题', '入门'),
  createQ('sk_18', Category.SECOO, 'cookie 和 localStorage 的区别', '入门'),
  createQ('sk_19', Category.SECOO, '如何解决跨域问题', '入门'),
  createQ('sk_20', Category.SECOO, '前端性能优化', '进阶'),

  // --- 宝宝树 ---
  createQ('bb_1', Category.BABYTREE, '使用 canvas 绘图时如何组织成通用组件', '专家'),
  createQ('bb_2', Category.BABYTREE, 'formData 和原生的 ajax 有什么区别', '进阶'),
  createQ('bb_3', Category.BABYTREE, '介绍下表单提交，和 formData 有什么关系', '入门'),
  createQ('bb_4', Category.BABYTREE, '介绍 redux 接入流程', '入门'),
  createQ('bb_5', Category.BABYTREE, 'redux 和全局管理有什么区别', '进阶'),
  createQ('bb_6', Category.BABYTREE, 'RN 和原生通信', '专家'),
  createQ('bb_7', Category.BABYTREE, '介绍 MVP 怎么组织', '专家'),
  createQ('bb_8', Category.BABYTREE, '介绍异步方案', '入门'),
  createQ('bb_9', Category.BABYTREE, 'promise 如何实现 then 处理', '专家'),
  createQ('bb_10', Category.BABYTREE, 'koa2 中间件原理', '专家'),
  createQ('bb_11', Category.BABYTREE, '常用的中间件', '入门'),
  createQ('bb_12', Category.BABYTREE, '服务端怎么做统一的状态处理', '进阶'),
  createQ('bb_13', Category.BABYTREE, '如何对相对路径引用进行优化', '进阶'),
  createQ('bb_14', Category.BABYTREE, 'node 文件查找优先级', '进阶'),
  createQ('bb_15', Category.BABYTREE, 'npm2 和 npm3+ 有什么区别', '专家'),

  // --- 海康威视 ---
  createQ('hk_1', Category.HIKVISION, 'knex 连接数据库响应回调', '专家'),
  createQ('hk_2', Category.HIKVISION, '介绍异步方案', '入门'),
  createQ('hk_3', Category.HIKVISION, '如何处理异常捕获', '入门'),
  createQ('hk_4', Category.HIKVISION, '项目如何管理模块', '进阶'),
  createQ('hk_5', Category.HIKVISION, '前端性能优化', '进阶'),
  createQ('hk_6', Category.HIKVISION, 'JS 继承方案', '进阶'),
  createQ('hk_7', Category.HIKVISION, '如何判断一个变量是不是数组', '入门'),
  createQ('hk_8', Category.HIKVISION, '变量 a 和 b，如何交换', '入门'),
  createQ('hk_9', Category.HIKVISION, '事件委托', '入门'),
  createQ('hk_10', Category.HIKVISION, '标签生成的 Dom 结构是一个类数组', '进阶'),
  createQ('hk_11', Category.HIKVISION, '类数组和数组的区别', '入门'),
  createQ('hk_12', Category.HIKVISION, 'dom 的类数组如何转成数组', '入门'),
  createQ('hk_13', Category.HIKVISION, '介绍单页面应用和多页面应用', '入门'),
  createQ('hk_14', Category.HIKVISION, 'redux 状态树的管理', '进阶'),

  // --- 蘑菇街 ---
  createQ('mg_1', Category.MOGUJIE, 'html 语义化的理解', '入门'),
  createQ('mg_2', Category.MOGUJIE, '<b> 和 <strong> 的区别', '入门'),
  createQ('mg_3', Category.MOGUJIE, '对闭包的理解', '入门'),
  createQ('mg_4', Category.MOGUJIE, '工程中闭包使用场景', '进阶'),
  createQ('mg_5', Category.MOGUJIE, '介绍 this 和原型', '入门'),
  createQ('mg_6', Category.MOGUJIE, '使用原型最大的好处', '入门'),
  createQ('mg_7', Category.MOGUJIE, 'react 设计思路', '进阶'),
  createQ('mg_8', Category.MOGUJIE, '为什么虚拟 DOM 比真实 DOM 性能好', '进阶'),
  createQ('mg_9', Category.MOGUJIE, 'react 常见的通信方式', '入门'),
  createQ('mg_10', Category.MOGUJIE, 'redux 整体的工作流程', '入门'),
  createQ('mg_11', Category.MOGUJIE, 'redux 和全局对象之间的区别', '进阶'),
  createQ('mg_12', Category.MOGUJIE, 'Redux 数据回溯设计思路', '专家'),
  createQ('mg_13', Category.MOGUJIE, '单例、工厂、观察者项目中实际场景', '专家'),
  createQ('mg_14', Category.MOGUJIE, '项目中树的使用场景以及了解', '进阶'),
  createQ('mg_15', Category.MOGUJIE, '工作收获', '入门'),

  // --- 酷家乐 ---
  createQ('kj_1', Category.KUJIALE, 'react 生命周期', '入门'),
  createQ('kj_2', Category.KUJIALE, 'react 性能优化', '进阶'),
  createQ('kj_3', Category.KUJIALE, '添加原生事件不移除为什么会内存泄露', '进阶'),
  createQ('kj_4', Category.KUJIALE, '还有哪些地方会内存泄露', '进阶'),
  createQ('kj_5', Category.KUJIALE, 'setInterval 需要注意的点', '入门'),
  createQ('kj_6', Category.KUJIALE, '定时器为什么是不精确的', '进阶'),
  createQ('kj_7', Category.KUJIALE, 'setTimeout(1) 和 setTimeout(2) 之间的区别', '专家'),
  createQ('kj_8', Category.KUJIALE, '介绍宏任务和微任务', '进阶'),
  createQ('kj_9', Category.KUJIALE, 'promise 里面和 then 里面执行有什么区别', '进阶'),
  createQ('kj_10', Category.KUJIALE, '介绍 pureComponent', '入门'),
  createQ('kj_11', Category.KUJIALE, '介绍 Function Component', '入门'),
  createQ('kj_12', Category.KUJIALE, 'React 数据流', '入门'),
  createQ('kj_13', Category.KUJIALE, 'props 和 state 的区别', '入门'),
  createQ('kj_14', Category.KUJIALE, '介绍 react context', '进阶'),
  createQ('kj_15', Category.KUJIALE, '介绍 class 和 ES5 的类以及区别', '进阶'),
  createQ('kj_16', Category.KUJIALE, '介绍箭头函数和普通函数的区别', '入门'),
  createQ('kj_17', Category.KUJIALE, '介绍 defineProperty 方法', '进阶'),
  createQ('kj_18', Category.KUJIALE, 'for..in 和 Object.keys 的区别', '入门'),
  createQ('kj_19', Category.KUJIALE, '介绍闭包，使用场景', '入门'),
  createQ('kj_20', Category.KUJIALE, '使用闭包特权函数的使用场景', '专家'),
  createQ('kj_21', Category.KUJIALE, 'get 和 post 有什么区别', '入门'),

  // --- 百分点 ---
  createQ('bf_1', Category.BAIFENDIAN, 'React 15/16.x 的区别', '进阶'),
  createQ('bf_2', Category.BAIFENDIAN, '重新渲染 render 会做什么', '进阶'),
  createQ('bf_3', Category.BAIFENDIAN, '哪些方法会触发 react 重新渲染', '入门'),
  createQ('bf_4', Category.BAIFENDIAN, 'state 和 props 触发更新的生命周期区别', '进阶'),
  createQ('bf_5', Category.BAIFENDIAN, 'setState 是同步还是异步', '进阶'),
  createQ('bf_6', Category.BAIFENDIAN, '对无状态组件的理解', '入门'),
  createQ('bf_7', Category.BAIFENDIAN, '介绍 Redux 工作流程', '入门'),
  createQ('bf_8', Category.BAIFENDIAN, '介绍 ES6 的功能', '入门'),
  createQ('bf_9', Category.BAIFENDIAN, 'let、const 以及 var 的区别', '入门'),
  createQ('bf_10', Category.BAIFENDIAN, '浅拷贝和深拷贝的区别', '入门'),
  createQ('bf_11', Category.BAIFENDIAN, '介绍箭头函数的 this', '入门'),
  createQ('bf_12', Category.BAIFENDIAN, '介绍 Promise 和 then', '入门'),
  createQ('bf_13', Category.BAIFENDIAN, '介绍快速排序', '进阶'),
  createQ('bf_14', Category.BAIFENDIAN, '算法：前 K 个最大的元素', '专家'),
];

// Combine all for lookup
export const QUESTIONS = [...GENERAL_QUESTIONS, ...INTERVIEW_QUESTIONS];