import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Library.css";
import { useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */
const COURSES = [
  {
    id: 1, title: "JavaScript Mastery", subtitle: "From Zero to Expert",
    desc: "Master modern JavaScript — closures, promises, async/await, ES2024, and real-world design patterns used in production codebases.",
    category: "Programming", level: "Beginner → Advanced", duration: "12h", lessons: 48, rating: 4.9, students: "24.3k",
    accent: "#F59E0B", rgb: "245,158,11",
    img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80", tag: "Popular",
    notes: [
      { id:"js1", title:"Chapter 1 — Foundations", pages:18, size:"2.1 MB", hue:"#F59E0B",
        intro:"JavaScript is the language of the web. This chapter lays the groundwork you need before tackling any framework. You'll learn how the engine parses your code, why `var` behaves differently from `let` and `const`, and how scope, hoisting, and the execution context work.",
        sections:[
          { h:"Variables & Scoping", b:"JavaScript has three ways to declare variables: `var` (function-scoped, hoisted), `let` (block-scoped, temporal dead zone), and `const` (block-scoped, immutable binding). Always prefer `const` by default; use `let` when reassignment is needed. `var` leaks into the enclosing function or global scope and should be avoided in modern codebases entirely." },
          { h:"Data Types & Coercion", b:"Seven primitives: string, number, bigint, boolean, undefined, null, symbol — plus the object type. Type coercion is automatic: `'5' + 3 = '53'` (string concatenation), `'5' - 3 = 2` (numeric subtraction). Always use strict equality `===` to avoid coercion surprises. Use `typeof` to inspect types and `instanceof` for prototype-chain checks." },
          { h:"Functions & Arrow Functions", b:"Functions are first-class values in JavaScript — they can be stored in variables, passed as arguments, and returned from other functions. Arrow functions (`=>`) are concise and do not bind their own `this`; they capture it lexically. Use regular functions for methods and constructors where `this` binding matters, and arrows for callbacks and array methods." },
          { h:"Destructuring & Spread", b:"Destructuring unpacks arrays/objects into variables: `const { name, age } = user`. The spread operator expands iterables: `const merged = { ...a, ...b }`. Rest parameters collect remaining args: `function fn(...args)`. Together with optional chaining `?.` and nullish coalescing `??`, these features make modern JavaScript dramatically more expressive and readable." },
        ]},
      { id:"js2", title:"Chapter 2 — Async JavaScript", pages:22, size:"2.8 MB", hue:"#EF4444",
        intro:"Asynchronous programming lets JavaScript handle I/O without blocking the main thread. This chapter takes you from callback hell through Promises to clean async/await, covering the event loop, microtask queue, and robust error-handling strategies.",
        sections:[
          { h:"The Event Loop", b:"JavaScript is single-threaded but handles async via the event loop. The call stack runs sync code. Async callbacks (setTimeout, I/O) go to the callback queue. Promise callbacks go to the microtask queue — which drains before the callback queue. Understanding this priority order is critical for predicting execution order in complex async code." },
          { h:"Promises", b:"A Promise is a proxy for a future value: pending → fulfilled | rejected. Create with `new Promise((resolve, reject) => {...})`. Consume with `.then()`, `.catch()`, `.finally()`. Chain promises for sequential async operations. Use `Promise.all()` for parallel execution, `Promise.allSettled()` when you need all results regardless of failure, and `Promise.race()` for timeout patterns." },
          { h:"async / await", b:"Syntactic sugar over Promises. `async` functions always return a Promise. `await` pauses the async function until the awaited Promise settles — without blocking the event loop thread. Wrap in `try/catch/finally` for robust error handling. Use `await Promise.all([a(), b()])` to run concurrent operations without sequential bottlenecks and performance degradation." },
          { h:"Error Handling Patterns", b:"Unhandled Promise rejections crash Node.js and produce console warnings in browsers. With async/await, always use try/catch. Create domain-specific errors by extending `Error`: `class NetworkError extends Error { constructor(msg, status) { super(msg); this.status = status; } }`. Use `finally` for cleanup — close connections, cancel requests, clear timers regardless of success or failure." },
        ]},
      { id:"js3", title:"Chapter 3 — Advanced Patterns", pages:30, size:"3.5 MB", hue:"#8B5CF6",
        intro:"Design patterns that separate junior from senior engineers. Closures, the prototype chain, generators, and meta-programming with Proxy and Reflect — the building blocks of every major JavaScript framework.",
        sections:[
          { h:"Closures & Module Pattern", b:"A closure is a function that retains its outer scope even after that scope returns. The Module pattern uses an IIFE to create private state: `const counter = (() => { let n=0; return { inc: ()=>++n, get: ()=>n }; })()`. ES Modules (`import`/`export`) are the modern standard — they're static, tree-shakeable, and fully support circular references in large codebases." },
          { h:"Prototype Chain", b:"Every JavaScript object has an internal `[[Prototype]]`. Property lookup walks the chain all the way to `null`. Classes are syntactic sugar over this prototype system. `Object.create(proto)` creates an object with a specific prototype. Know the difference between `prototype` (a constructor's property) and `__proto__` (an instance's prototype link)." },
          { h:"Generators & Iterators", b:"Generator functions (`function*`) can pause with `yield` and resume via `.next()`. Use for lazy infinite sequences, cooperative multitasking, and custom iteration protocols. `for...of` works with any iterable — arrays, strings, Maps, Sets, and custom generators. Combining `async function*` with `for await...of` enables elegant, memory-efficient async data streaming." },
          { h:"Proxy & Reflect", b:"Proxy wraps an object and intercepts fundamental operations via handler 'traps': get, set, has, deleteProperty, apply, and construct. This enables powerful meta-programming: input validation, transparent logging, and reactive data binding (Vue 3's reactivity system is built entirely on Proxy). Reflect provides the same operations in functional form, used alongside Proxy to forward operations." },
        ]},
      { id:"js4", title:"Practice Exercises Pack", pages:40, size:"4.2 MB", hue:"#10B981",
        intro:"Theory without practice is worthless. This pack contains 50 carefully designed challenges that progressively build skills from basic array manipulation to complex algorithm design, each with constraints, hints, and fully explained solutions.",
        sections:[
          { h:"Section A — Arrays & Strings", b:"15 exercises: flat/nested array operations, string parsing, palindrome detection, anagram grouping, and sliding window problems. The Two Sum problem (O(n) with a hash map), the Longest Substring Without Repeating Characters, and Group Anagrams — each problem includes three solution approaches, from brute force to optimal, so you understand the progression." },
          { h:"Section B — Functional Programming", b:"12 exercises on deep cloning, object transformation, pure `map`/`filter`/`reduce` chains, function currying, memoization, and function composition. Key challenge: implement `memoize(fn)` that caches results using a Map. Apply it to recursive Fibonacci to reduce complexity from exponential O(2^n) down to linear O(n) with a simple wrapper." },
          { h:"Section C — Async Challenges", b:"10 exercises covering Promise chains, async/await control flow, parallel vs sequential execution, retry logic with exponential backoff, and debouncing vs throttling. Implement `fetchWithRetry(url, n)` that retries failing fetches up to n times, `debounce(fn, ms)` for search inputs, and a rate limiter that queues requests to stay under a per-second API limit." },
          { h:"Section D — Interview Prep", b:"13 real interview questions from top tech companies with detailed walkthroughs. Topics: event delegation, `==` vs `===`, `this` binding in 5 contexts, explaining the event loop to a non-technical interviewer, implementing `Promise.all` from scratch, and the 'Design a frontend for infinite scroll' system design question with full implementation." },
        ]},
    ],
  },
  {
    id: 2, title: "React Development", subtitle: "Modern UI Engineering",
    desc: "Build production-ready React apps with hooks, context, React Query, performance optimization, and full-stack integration patterns.",
    category: "Web Dev", level: "Intermediate", duration: "10h", lessons: 40, rating: 4.8, students: "18.7k",
    accent: "#06B6D4", rgb: "6,182,212",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80", tag: "Trending",
    notes: [
      { id:"r1", title:"Chapter 1 — React Fundamentals", pages:20, size:"2.3 MB", hue:"#06B6D4",
        intro:"React is a declarative library for building UIs. You describe what the UI should look like for a given state, and React handles all DOM updates via its Virtual DOM reconciliation algorithm — giving you predictable, efficient rendering.",
        sections:[
          { h:"JSX & Virtual DOM", b:"JSX compiles to `React.createElement()` calls. The Virtual DOM is an in-memory JavaScript tree. On state change, React creates a new Virtual DOM tree, diffs it against the previous one (reconciliation via the Fiber algorithm), and applies only the minimal set of real DOM mutations. The `key` prop helps identify list items — always use stable IDs, never array indices." },
          { h:"Components & Props", b:"Function components accept a props object and return JSX. Props are read-only — a component never modifies its own props. For dynamic values, use state. Component composition — passing JSX as `children` or render props — is strongly preferred over class inheritance. Default props provide fallback values; TypeScript or PropTypes provide type safety." },
          { h:"State & useState", b:"`useState(init)` returns `[value, setter]`. Always use the functional updater `setState(prev => newValue)` when new state depends on old state — this is safe under React 18's concurrent rendering. State updates are batched automatically in event handlers and React 18+ async transitions. Never mutate state directly — always produce new values." },
          { h:"useEffect & Side Effects", b:"`useEffect(fn, deps)` runs after paint. Empty `[]` = run once on mount. Specific deps = run when they change. No deps = after every render. Return a cleanup function to cancel subscriptions, clear timers, or abort fetch requests — the cleanup runs before the next effect execution and on component unmount to prevent memory leaks." },
        ]},
      { id:"r2", title:"Chapter 2 — Hooks Deep Dive", pages:26, size:"3.1 MB", hue:"#EC4899",
        intro:"Hooks allow function components to use state, side effects, context, refs, and more. This chapter goes deep into every built-in hook and teaches you to build your own custom hooks for maximum reusability.",
        sections:[
          { h:"useContext & useReducer", b:"`useContext(MyContext)` subscribes to context value changes — any context update re-renders all consumers. `useReducer(reducer, init)` manages complex state: dispatch actions, pure reducer returns next state. Combine them: context holds `state` and `dispatch`, useReducer manages updates. This pattern builds a lightweight Redux without external dependencies." },
          { h:"useMemo & useCallback", b:"`useMemo(() => expensiveCompute(), deps)` memoizes computed values — the computation only re-runs when deps change. `useCallback(fn, deps)` memoizes function identity — critical when passing callbacks to memoized children to prevent unnecessary re-renders. Profile with React DevTools first — premature memoization adds complexity without measurable benefit." },
          { h:"useRef & Imperative Handles", b:"`useRef(init)` returns a stable mutable `{ current }` box that persists across renders without triggering re-renders. Primary uses: holding DOM element references (`ref={inputRef}`), storing previous values, and caching mutable values that don't belong in state. `useImperativeHandle` with `forwardRef` exposes imperative API from child to parent." },
          { h:"Custom Hooks", b:"Extract reusable stateful logic into `useSomething` functions. Examples: `useFetch(url)` encapsulates loading/error/data states; `useLocalStorage(key, init)` syncs state to localStorage with JSON serialization; `useDebounce(value, ms)` delays value updates for search inputs; `useOnClickOutside(ref, fn)` handles dismissing dropdowns. Prefer custom hooks over HOCs." },
        ]},
      { id:"r3", title:"Chapter 3 — Ecosystem & Architecture", pages:24, size:"2.9 MB", hue:"#10B981",
        intro:"React handles only the view layer. The ecosystem provides everything else. This chapter covers production-grade routing, server-state management, forms, and the architectural patterns that scale from startup to enterprise.",
        sections:[
          { h:"React Router v6", b:"Define routes: `<Route path='/users/:id' element={<UserPage />} />` inside `<Routes>`. Access params with `useParams()`, navigate programmatically with `useNavigate()`, read location with `useLocation()`. Nested routes share parent layouts. Protected routes wrap children in an auth check component. Lazy routes with `React.lazy()` split code at route boundaries." },
          { h:"React Query", b:"React Query manages server state: fetching, caching, synchronization, and background refetching. `useQuery({ queryKey: ['users'], queryFn: fetchUsers })` auto-handles loading/error/success states, caches data by key, and refetches on window focus. `useMutation` handles writes with optimistic updates. Eliminates 95% of `useEffect`-based data fetching and its associated loading state boilerplate." },
          { h:"Zustand for State", b:"Zustand is a minimal, unopinionated state manager. Create a store: `const useStore = create(set => ({ count: 0, inc: () => set(s => ({ count: s.count + 1 })) }))`. Components subscribe to exact slices: `const count = useStore(s => s.count)` — only re-renders when that specific slice changes. Dramatically simpler than Redux for most applications." },
          { h:"Performance Patterns", b:"Code splitting: `const Page = React.lazy(() => import('./Page'))` with `<Suspense fallback={<Spinner/>}>`. Memoization: `React.memo(Component)` skips re-renders when props haven't changed by shallow comparison. List virtualization: `react-window` renders only visible rows for 10,000-item lists. React DevTools Profiler identifies bottleneck components. Always measure before optimizing." },
        ]},
    ],
  },
  {
    id: 3, title: "Python Programming", subtitle: "Practical & Powerful",
    desc: "From scripting to systems — Python OOP, file handling, APIs, automation, and real-world project development with professional tooling.",
    category: "Programming", level: "Beginner", duration: "14h", lessons: 56, rating: 4.9, students: "31.2k",
    accent: "#3B82F6", rgb: "59,130,246",
    img: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=800&q=80", tag: "Bestseller",
    notes: [
      { id:"py1", title:"Chapter 1 — Python Basics", pages:24, size:"2.6 MB", hue:"#3B82F6",
        intro:"Python emphasizes readability and simplicity. This chapter covers core language constructs from syntax to file I/O — the foundation every Python program is built on.",
        sections:[
          { h:"Syntax & Data Types", b:"Python uses 4-space indentation for blocks — no braces, no semicolons. Seven built-in scalar types: int, float, str, bool, bytes, NoneType, complex. Dynamic typing: variables hold object references, not values. The REPL is your primary learning and debugging tool. F-strings (`f'{value:.2f}'`) are the modern, fast way to format strings — prefer them over `%` formatting or `.format()`." },
          { h:"Collections", b:"Four main container types: List `[1,2,3]` (ordered, mutable), Tuple `(1,2)` (ordered, immutable — hashable and usable as dict keys), Dict `{'k':v}` (key-value, insertion-ordered since Python 3.7), Set `{1,2,3}` (unique, unordered, O(1) lookup). List comprehensions `[x*2 for x in range(10) if x%2==0]` are idiomatic Python. Use `collections.defaultdict` and `Counter` for common patterns." },
          { h:"Functions & Scope", b:"LEGB scope rule: Local → Enclosing → Global → Built-in. Functions support default arguments, `*args` for variable positional args, and `**kwargs` for keyword args. Lambda creates one-line anonymous functions. `yield` turns a function into a generator for lazy sequences. `functools.lru_cache` memoizes pure functions automatically. Closures capture variables by reference — use `nonlocal` to mutate them." },
          { h:"File I/O & pathlib", b:"Always use context managers: `with open('file.txt', encoding='utf-8') as f`. `pathlib.Path` is the modern cross-platform API: `p = Path('data'); p.mkdir(exist_ok=True); files = list(p.glob('*.csv'))`. Use `json.loads/dumps` for JSON, `csv.DictReader/Writer` for CSV tabular data, `pickle` for Python object serialization. The `tempfile` module creates safe temporary files and directories." },
        ]},
      { id:"py2", title:"Chapter 2 — OOP & Automation", pages:36, size:"4.1 MB", hue:"#10B981",
        intro:"Python's OOP is expressive and flexible. This chapter covers class design, magic methods, decorators, and four real automation projects you can deploy immediately.",
        sections:[
          { h:"Classes & Dunder Methods", b:"Define classes with `class Dog:`. `__init__` is the constructor; `self` is always the first parameter. Dunder methods customize built-in behavior: `__str__` (readable string), `__repr__` (debug string), `__len__`, `__getitem__`, `__iter__`, `__eq__`, `__lt__`, `__enter__`/`__exit__` (context manager protocol). `@dataclass` from Python 3.7+ auto-generates `__init__`, `__repr__`, and `__eq__`." },
          { h:"Inheritance & Decorators", b:"Single and multiple inheritance: `class GoldenRetriever(Dog):`. `super()` delegates to parent. C3 linearization determines MRO. `@property` creates computed attributes with optional setter/deleter. `@staticmethod` needs no instance or class ref. `@classmethod` receives `cls` — perfect for factory methods. Write custom decorators with `@functools.wraps(fn)` to preserve function metadata for documentation." },
          { h:"Web Scraper Project", b:"Stack: `requests` for HTTP, `BeautifulSoup4` for HTML parsing, `pandas` for storage. Pattern: `r = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=10)` → `soup = BeautifulSoup(r.text, 'html.parser')` → `items = soup.select('div.product-card')`. Handle pagination with `while next_page`, rate-limit with `time.sleep(1)`, retry on `requests.exceptions.RequestException` with exponential backoff." },
          { h:"PDF Report Generator", b:"Stack: `reportlab` or `weasyprint` for PDF generation, `matplotlib` for charts, `Jinja2` for HTML templating. Pattern: render DataFrame to chart → save to BytesIO → embed in PDF. Add company header, page numbers, and conditional formatting. Use `python-dotenv` for credentials — never hardcode. Schedule monthly generation with `schedule.every().month.do(generate_report)` or a cron expression `0 8 1 * *`." },
        ]},
    ],
  },
  {
    id: 4, title: "Artificial Intelligence", subtitle: "Foundations to Deployment",
    desc: "Neural networks, NLP, computer vision, model training, and production MLOps workflows — from first principles to production scale.",
    category: "AI", level: "Advanced", duration: "16h", lessons: 62, rating: 4.7, students: "12.8k",
    accent: "#A855F7", rgb: "168,85,247",
    img: "https://images.unsplash.com/photo-1677442135136-760c813028c0?w=800&q=80", tag: "New",
    notes: [
      { id:"ai1", title:"Chapter 1 — AI & Math Foundations", pages:28, size:"3.3 MB", hue:"#A855F7",
        intro:"AI encompasses techniques enabling machines to mimic intelligence. This chapter surveys AI paradigms, search algorithms, and the probability and linear algebra that underpin every model you'll build.",
        sections:[
          { h:"Types of AI & ML Paradigms", b:"Narrow AI (ANI) excels at one task: spam filters, chess engines, recommenders. General AI (AGI) matches human reasoning across all domains — not yet achieved. ML subtypes: supervised learning (labeled data), unsupervised learning (find structure), reinforcement learning (reward signal), self-supervised learning (predict part of input from rest — foundation of modern LLMs like GPT). Choose the right paradigm before choosing an algorithm." },
          { h:"Probability & Bayes' Theorem", b:"Bayes' Theorem: `P(A|B) = P(B|A)·P(A) / P(B)`. Foundation of Naive Bayes classifiers, Bayesian neural networks, and MCMC sampling. Key distributions: Gaussian (continuous — activations, weights), Bernoulli (binary classification output), Categorical (multi-class), Poisson (count data). Maximum Likelihood Estimation (MLE) finds parameters maximizing log-likelihood of the training set — the core of supervised learning." },
          { h:"Linear Algebra for ML", b:"Vectors are data points — a 28×28 image is a 784-dimensional vector. Matrices represent transformations and datasets. The fundamental NN operation: `Y = XW + b` is a matrix multiplication plus bias. Eigendecomposition of the covariance matrix drives PCA for dimensionality reduction. SVD underlies collaborative filtering in recommender systems. NumPy broadcasting eliminates explicit for-loops for performance." },
          { h:"Gradient Descent & Optimization", b:"Gradient descent: `θ = θ - α·∇L(θ)`. SGD adds noise that helps escape local minima. Adam optimizer adapts learning rates per-parameter using first and second moment estimates: `m = β₁m + (1-β₁)g`, `v = β₂v + (1-β₂)g²`, `θ = θ - α·m̂/√v̂`. AdamW decouples weight decay from the gradient update — current best practice. Cosine annealing with warm restarts prevents premature convergence." },
        ]},
      { id:"ai2", title:"Chapter 2 — Deep Learning & MLOps", pages:40, size:"4.8 MB", hue:"#06B6D4",
        intro:"From neural network fundamentals to production deployment at scale. Build, train, evaluate, and serve models using PyTorch, FastAPI, Docker, and MLflow.",
        sections:[
          { h:"Neural Networks & Backprop", b:"Architecture: input → hidden layers → output. Each connection has weight `w`, each neuron has bias `b`. Activation functions add non-linearity: ReLU (`max(0,x)`) in hidden layers, sigmoid for binary output, softmax for multi-class. Forward pass computes predictions and loss. Backprop computes gradients via chain rule. PyTorch autograd tracks the computational graph and calls `loss.backward()` to compute all gradients automatically." },
          { h:"CNNs & Transformers", b:"CNNs exploit spatial structure: convolutional layers detect local patterns (edges → textures → objects) via learned filters. MaxPooling reduces spatial dimensions. ResNet's skip connections solve vanishing gradients enabling 100+ layer networks. Transformers use self-attention: `Attention(Q,K,V) = softmax(QKᵀ/√dk)·V`. BERT fine-tunes for understanding tasks. GPT generates autoregressively. ViT applies the exact same Transformer architecture to image patches." },
          { h:"Training Best Practices", b:"Data split: 70/15/15 train/val/test. Normalize inputs to zero-mean unit-variance. Batch normalization (applied before activation) stabilizes and speeds training 2-10×. Dropout (p=0.2–0.5) is an implicit ensemble of 2^n subnetworks. Early stopping monitors val loss with patience=10 epochs. Learning rate finder: sweep 1e-7 to 10, plot loss vs LR, pick the point of steepest descent minus one order of magnitude." },
          { h:"MLOps & Production Deployment", b:"Save state_dict not full model for portability. FastAPI wraps models in typed REST endpoints with Pydantic input validation — load model once at startup, not per-request. Dockerfile: FROM python:3.11-slim → COPY requirements.txt → RUN pip install → COPY . → EXPOSE 8000 → CMD uvicorn. MLflow tracks parameters, metrics, and artifacts. Monitor data drift with Evidently AI. Triton Inference Server handles dynamic batching at GPU scale." },
        ]},
    ],
  },
  {
    id: 5, title: "Data Science", subtitle: "Insights from Raw Data",
    desc: "End-to-end data science pipeline — wrangling, EDA, visualization, statistical testing, and production-ready predictive modeling.",
    category: "Data Science", level: "Intermediate", duration: "11h", lessons: 44, rating: 4.8, students: "15.5k",
    accent: "#10B981", rgb: "16,185,129",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", tag: null,
    notes: [
      { id:"ds1", title:"Chapter 1 — Data Wrangling & EDA", pages:26, size:"3.0 MB", hue:"#10B981",
        intro:"Real-world data is messy — missing values, wrong types, duplicates, outliers. This chapter makes you proficient with pandas for cleaning, reshaping, and engineering features from raw datasets.",
        sections:[
          { h:"Pandas DataFrames", b:"DataFrame = 2D labeled table with typed columns. Load: `pd.read_csv('file.csv', parse_dates=['date'], dtype={'id': str})`. Inspect: `df.head(10)`, `df.info()`, `df.describe(percentiles=[.25,.5,.75,.95])`. Filter: `df.query('age > 30 and city == \"London\"')`. Method chaining: `(df.pipe(clean_nulls).pipe(engineer_features).pipe(encode_categoricals))` — readable and debuggable." },
          { h:"Handling Missing Data", b:"Detect: `df.isnull().sum().sort_values(ascending=False)`. Visualize with `msno.matrix(df)`. Drop if <5% missing at random: `df.dropna(subset=['target'])`. Impute numerics with median (robust to outliers): `df['price'] = df['price'].fillna(df['price'].median())`. Forward-fill time series: `df = df.ffill()`. Use sklearn's `IterativeImputer` for MCAR/MAR data with complex patterns." },
          { h:"Feature Engineering", b:"Datetime: `df['month'] = df['date'].dt.month`. Interaction: `df['price_per_sqft'] = df['price'] / df['area']`. Log-transform right-skewed features: `df['log_price'] = np.log1p(df['price'])`. Bin continuous vars: `pd.cut(df['age'], bins=[0,18,35,65,100], labels=['teen','adult','midage','senior'])`. Cyclical encoding: `df['hour_sin'] = np.sin(2*np.pi*df['hour']/24)`. Target encoding for high-cardinality categoricals." },
          { h:"Visualization & Storytelling", b:"EDA: `sns.pairplot(df, hue='churn', diag_kind='hist')` reveals all pairwise relationships at once. Correlation heatmap: `sns.heatmap(df.corr(), annot=True, fmt='.2f', cmap='coolwarm', center=0)`. Plotly for interactive dashboards: `px.scatter(df, x='feature', y='target', color='segment', size='revenue', hover_data=['customer_id'])`. Always write chart titles as conclusions: 'Churn rate 3× higher in first 30 days' beats 'Churn by Tenure'." },
        ]},
      { id:"ds2", title:"Chapter 2 — Statistical Testing & Modeling", pages:30, size:"3.6 MB", hue:"#EC4899",
        intro:"From hypothesis testing to machine learning — making decisions from data with statistical rigor and building production-grade predictive models with scikit-learn.",
        sections:[
          { h:"Hypothesis Testing", b:"Define H₀ (null) and H₁ (alternative) before seeing data. Choose test: t-test (means, continuous, normal), Mann-Whitney U (means, non-normal), chi-square (categorical independence), ANOVA (multiple group means). Set α=0.05 before the test. p-value < α → reject H₀. Always report effect size (Cohen's d, Cramér's V) alongside p-value — statistical significance ≠ practical significance. Use Bonferroni correction for multiple comparisons." },
          { h:"A/B Testing Framework", b:"Minimum detectable effect: choose the smallest business-meaningful difference. Power analysis: `n = (z_α + z_β)² · 2σ² / δ²`. Calculate required sample size before running. Run test until n reached — never stop early on a peek. Use sequential testing (alpha-spending) for early stopping with type-I error control. Segment results by user cohort — global metrics often mask significant segment-level effects." },
          { h:"scikit-learn Pipelines", b:"Pipelines prevent data leakage: `Pipeline([('scaler', StandardScaler()), ('pca', PCA(n_components=0.95)), ('clf', LogisticRegression())])`. Fit on training fold only — `pipeline.fit(X_train, y_train)`. `ColumnTransformer` handles mixed feature types: StandardScaler for numerics, OneHotEncoder for categoricals. `GridSearchCV` and `RandomizedSearchCV` tune hyperparameters with cross-validation, respecting the pipeline." },
          { h:"Model Evaluation & Interpretation", b:"Classification: accuracy (balanced classes), precision/recall/F1 (imbalanced), ROC-AUC (ranking quality), PR-AUC (better for imbalanced). Regression: MAE (interpretable), RMSE (penalizes large errors), MAPE (percentage error). SHAP values explain individual predictions: `shap.TreeExplainer(model).shap_values(X_test)` — waterfall plots show feature contributions. Partial dependence plots show marginal feature effects across the full range." },
        ]},
    ],
  },
  {
    id: 6, title: "Machine Learning", subtitle: "Algorithms & Applications",
    desc: "Algorithm internals, regularization, ensemble methods, and industry case studies — the rigorous ML engineering course.",
    category: "AI", level: "Advanced", duration: "18h", lessons: 72, rating: 4.9, students: "9.4k",
    accent: "#EF4444", rgb: "239,68,68",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80", tag: "Premium",
    notes: [
      { id:"ml1", title:"Chapter 1 — ML Foundations", pages:32, size:"3.8 MB", hue:"#EF4444",
        intro:"The mathematical and statistical framework underlying every ML algorithm — bias-variance tradeoff, loss functions, regularization, and proper validation methodology.",
        sections:[
          { h:"Bias-Variance Tradeoff", b:"Test error = Bias² + Variance + Irreducible Noise. High bias (underfitting): model too simple — linear model for non-linear data. High variance (overfitting): model memorizes noise — 1-NN on small datasets. The tradeoff: simpler models have lower variance but higher bias. Diagnose with learning curves: training error well below validation error → high variance (get more data or regularize). Both high → high bias (use a more powerful model)." },
          { h:"Loss Functions & Optimizers", b:"Regression losses: MSE penalizes large errors quadratically; MAE is robust to outliers (absolute loss); Huber blends both with a threshold δ. Classification: binary cross-entropy `−[y·log(ŷ) + (1−y)·log(1−ŷ)]`; categorical cross-entropy for multi-class; focal loss `−(1−ŷ)^γ·log(ŷ)` down-weights easy examples for class imbalance. Optimizers: AdamW (Adam + decoupled L2 regularization) is the current default for most deep learning tasks." },
          { h:"Regularization Techniques", b:"L1 (Lasso, `λΣ|wᵢ|`) drives irrelevant feature weights to exactly zero — built-in feature selection. L2 (Ridge, `λΣwᵢ²`) shrinks all weights proportionally toward zero — better for correlated features. ElasticNet: `α·L1 + (1-α)·L2`. Dropout randomly zeros p% of neurons per training step — effectively training 2^n different subnetwork architectures. Label smoothing replaces hard `{0,1}` targets with `{ε/K, 1−ε+ε/K}` preventing overconfident predictions." },
          { h:"Cross-Validation Strategies", b:"K-Fold (k=5 or 10): rotate held-out fold, average k validation scores — honest estimate of generalization. Stratified K-Fold preserves class proportions in each fold. TimeSeriesSplit: always train on past, validate on future — never let future information contaminate past training. GroupKFold: keep same user/patient/entity in same fold to prevent leakage across correlated samples. Nested CV: outer loop estimates test error, inner loop tunes hyperparameters — avoids optimistic bias." },
        ]},
      { id:"ml2", title:"Chapter 2 — Ensemble Methods", pages:38, size:"4.5 MB", hue:"#F59E0B",
        intro:"Ensembles consistently outperform single models and win competitions. Deep dives into Random Forests, XGBoost, LightGBM, CatBoost, and multi-level stacking.",
        sections:[
          { h:"Random Forests & Bagging", b:"Bagging: train B trees on bootstrap samples (sample with replacement). Random feature subsets per split de-correlates trees — `max_features='sqrt'` for classification, `max_features=n/3` for regression. More trees → lower variance (diminishing returns after ~300). OOB score: each sample is test data for ~37% of trees → free validation estimate. Feature importance = mean impurity decrease across all trees and splits." },
          { h:"Gradient Boosting & XGBoost", b:"Boosting trains trees sequentially: each tree fits the negative gradient of the loss (residuals for MSE). Shrinkage η∈[0.01,0.1] controls contribution — lower = more trees needed = better generalization. XGBoost adds exact regularization terms `Ω(f) = γT + λΣwᵢ²` to the tree objective, handles missing values via learned default directions, and uses histogram binning for O(nk) complexity. Key hyperparams: `max_depth=4-8`, `subsample=0.8`, `n_estimators=200-2000` with early stopping." },
          { h:"LightGBM & CatBoost", b:"LightGBM grows leaf-wise (best-first) instead of level-wise: lower loss, fewer leaves needed, faster training. GOSS samples high-gradient instances more heavily (95%+ retained). EFB bundles mutually exclusive sparse features. CatBoost uses ordered boosting: each sample's target is estimated without including that sample in the estimator — prevents target leakage in categorical encoding. Both handle high-cardinality categoricals natively via target statistics." },
          { h:"Stacking & Blending", b:"Level-0 (base) models: maximize diversity — XGBoost, LightGBM, RandomForest, Extra Trees, Ridge, Neural Net, 1NN. Generate out-of-fold predictions using StratifiedKFold(n_splits=5) to avoid leakage. Level-1 (meta) model: logistic regression or shallow neural net trained on OOF predictions. Blending: simpler — hold out 20% as blend set, train base models on 80%, meta model on blend predictions. Stacking gain: 0.5-2% over best single model, with higher variance due to increased complexity." },
        ]},
    ],
  },
];

const CATS = ["All", "Programming", "Web Dev", "AI", "Data Science"];
const CAT_META = {
  "Programming": { emoji: "⌨️", color: "#F59E0B" },
  "Web Dev":      { emoji: "🌐", color: "#06B6D4" },
  "AI":           { emoji: "🤖", color: "#A855F7" },
  "Data Science": { emoji: "📊", color: "#10B981" },
};
const lvColor = l => l.includes("→") ? "#F59E0B" : l === "Intermediate" ? "#F59E0B" : l === "Beginner" ? "#10B981" : "#EF4444";

/* ═══════════════════════════════════════════════════════
   DARK / LIGHT MODE TOGGLE BUTTON
═══════════════════════════════════════════════════════ */
const ThemeToggle = ({ dark, onToggle }) => (
  <button className={`theme-toggle ${dark ? "theme-toggle--dark" : "theme-toggle--light"}`} onClick={onToggle} title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"} aria-label="Toggle theme">
    <div className="theme-toggle-track">
      <div className="theme-toggle-thumb">
        {dark ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </div>
    </div>
    <span className="theme-toggle-label">{dark ? "Dark" : "Light"}</span>
  </button>
);

/* ═══════════════════════════════════════════════════════
   NOTE MODAL
═══════════════════════════════════════════════════════ */
const NoteModal = ({ note, course, onClose }) => {
  const download = () => {
    const line = "─".repeat(60);
    const txt = [
      "LEARNIFY — OFFICIAL STUDY MATERIAL",
      "═".repeat(60),
      `Course : ${course.title}`,
      `Chapter: ${note.title}`,
      `Pages  : ${note.pages}  |  Size: ${note.size}`,
      "© 2025 Learnify · Personal use only · Redistribution prohibited",
      "═".repeat(60),
      "",
      "INTRODUCTION",
      line,
      note.intro,
      "",
      ...note.sections.flatMap(s => [`\n${s.h}`, line, s.b]),
      "",
      line,
      "© 2025 Learnify — All rights reserved",
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain" }));
    a.download = `Learnify_${course.title.replace(/\s+/g, "_")}_${note.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    a.click();
  };

  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="nm-wrap" onClick={onClose} role="dialog" aria-modal="true">
      <div className="nm-box" onClick={e => e.stopPropagation()}>
        <div className="nm-topbar" style={{ background: note.hue }} />

        <div className="nm-head">
          <div className="nm-head-left">
            <div className="nm-head-icon" style={{ borderColor: `${note.hue}50`, background: `${note.hue}14` }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={note.hue} strokeWidth="2" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div>
              <p className="nm-course-label" style={{ color: note.hue }}>{course.title}</p>
              <h3 className="nm-note-title">{note.title}</h3>
            </div>
          </div>
          <div className="nm-head-right">
            <span className="nm-chip">{note.pages}pp</span>
            <span className="nm-chip">{note.size}</span>
            <button className="nm-x" onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>

        <div className="nm-doc-area">
          {/* Layered watermarks */}
          <div className="nm-wm-center" aria-hidden="true">
            <span className="nm-wm-lv">LV</span>
            <span className="nm-wm-brand">LEARNIFY</span>
            <span className="nm-wm-sub">Official Study Material</span>
          </div>
          <div className="nm-wm-tiles" aria-hidden="true">
            {Array.from({ length: 32 }).map((_, i) => (
              <span key={i} className="nm-wm-tile">Learnify</span>
            ))}
          </div>

          <div className="nm-doc">
            <div className="nm-doc-brand-row">
              <span className="nm-doc-lv" style={{ background: note.hue }}>LV</span>
              <span className="nm-doc-brandname">Learnify</span>
              <span className="nm-doc-divider">·</span>
              <span className="nm-doc-coursetag">{course.title}</span>
            </div>

            <h2 className="nm-doc-h2" style={{ borderLeftColor: note.hue }}>{note.title}</h2>

            <div className="nm-doc-chips">
              <span className="nm-doc-chip" style={{ background: `${note.hue}18`, color: note.hue }}>{note.pages} Pages</span>
              <span className="nm-doc-chip" style={{ background: `${note.hue}18`, color: note.hue }}>{note.size}</span>
              <span className="nm-doc-chip" style={{ background: `${note.hue}18`, color: note.hue }}>PDF Document</span>
            </div>

            <div className="nm-intro-card">
              <div className="nm-intro-label">
                <div className="nm-intro-dot" style={{ background: note.hue }} />
                Introduction
              </div>
              <p className="nm-intro-text">{note.intro}</p>
            </div>

            <div className="nm-section-divider" style={{ background: `linear-gradient(90deg, ${note.hue}80, transparent)` }} />

            {note.sections.map((sec, i) => (
              <div key={i} className="nm-section" style={{ "--sh": note.hue, animationDelay: `${i * 0.07}s` }}>
                <div className="nm-section-hdr">
                  <span className="nm-section-num" style={{ background: note.hue }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="nm-section-heading">{sec.h}</h4>
                </div>
                <p className="nm-section-body">{sec.b}</p>
              </div>
            ))}

            <div className="nm-doc-footer">
              <div className="nm-doc-footer-icon" style={{ background: note.hue }}>LV</div>
              <div>
                <p className="nm-doc-footer-name">Learnify E-Learning Platform</p>
                <p className="nm-doc-footer-copy">© 2025 Learnify · All rights reserved · Personal use only · Redistribution prohibited</p>
              </div>
            </div>
          </div>
        </div>

        <div className="nm-actions">
          <div className="nm-file-info">
            <span className="nm-file-ico">📄</span>
            <span className="nm-file-name">{note.title}.pdf</span>
            <span className="nm-file-size">{note.size}</span>
          </div>
          <div className="nm-action-btns">
            <button className="nm-btn-close" onClick={onClose}>Close</button>
            <button className="nm-btn-dl" style={{ background: note.hue, color: "#000" }} onClick={download}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   COURSE SIDE PANEL
═══════════════════════════════════════════════════════ */
const CoursePanel = ({ course, onClose }) => {
  const [activeNote, setActiveNote] = useState(null);

  useEffect(() => {
    const onKey = e => { if (e.key === "Escape" && !activeNote) onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, activeNote]);

  return (
    <>
      <div className="cp-backdrop" onClick={onClose} />
      <div className="cp-panel" role="complementary">
        <div className="cp-accent-bar" style={{ background: `linear-gradient(90deg, ${course.accent}, transparent)` }} />
        <button className="cp-close" onClick={onClose} aria-label="Close panel">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="cp-hero">
          <img src={course.img} alt={course.title} className="cp-hero-img" loading="lazy" />
          <div className="cp-hero-overlay" />
          <div className="cp-hero-content">
            <span className="cp-cat-badge" style={{ color: CAT_META[course.category]?.color, background: `${CAT_META[course.category]?.color}20` }}>
              {CAT_META[course.category]?.emoji} {course.category}
            </span>
            <h2 className="cp-course-title">{course.title}</h2>
            <p className="cp-course-sub">{course.subtitle}</p>
          </div>
        </div>

        <div className="cp-stats-row">
          {[["⭐", course.rating, "Rating"], ["👥", course.students, "Students"], ["🕐", course.duration, "Duration"], ["📚", course.lessons, "Lessons"]].map(([ic, v, l], i) => (
            <div key={i} className="cp-stat-cell">
              <span className="cp-stat-emoji">{ic}</span>
              <span className="cp-stat-value" style={{ color: course.accent }}>{v}</span>
              <span className="cp-stat-label">{l}</span>
            </div>
          ))}
        </div>

        <p className="cp-course-desc">{course.desc}</p>

        <div className="cp-notes-section">
          <div className="cp-notes-header">
            <span className="cp-notes-emoji">📖</span>
            <h3 className="cp-notes-title">Study Notes Library</h3>
            <span className="cp-notes-badge" style={{ color: course.accent, background: `${course.accent}18` }}>
              {course.notes.length} files
            </span>
          </div>

          <div className="cp-notes-grid">
            {course.notes.map((note, i) => (
              <div key={note.id} className="cp-note-card" style={{ "--nc": note.hue, animationDelay: `${i * 0.06}s` }}>
                <div className="cp-note-color-bar" style={{ background: note.hue }} />
                <div className="cp-note-main">
                  <div className="cp-note-icon-wrap" style={{ background: `${note.hue}12`, borderColor: `${note.hue}30` }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={note.hue} strokeWidth="2" strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  </div>
                  <div className="cp-note-text">
                    <span className="cp-note-name">{note.title}</span>
                    <span className="cp-note-meta">{note.pages} pages · {note.size} · PDF</span>
                  </div>
                </div>
                <div className="cp-note-actions">
                  <button className="cp-note-view-btn" style={{ color: note.hue, borderColor: `${note.hue}45` }} onClick={() => setActiveNote(note)}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    View
                  </button>
                  <button className="cp-note-dl-btn" style={{ background: note.hue, color: "#000" }} onClick={() => setActiveNote(note)}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    DL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {activeNote && <NoteModal note={activeNote} course={course} onClose={() => setActiveNote(null)} />}
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   COURSE CARD
═══════════════════════════════════════════════════════ */
const CourseCard = ({ course, idx, onOpen }) => (
  <div className="card" style={{ "--ca": course.accent, "--cr": course.rgb, animationDelay: `${idx * 0.05}s` }}>
    <div className="card-img-wrap">
      <img src={course.img} alt={course.title} className="card-img" loading="lazy" />
      <div className="card-img-overlay" />
      {course.tag && (
        <span className="card-tag" style={{ background: course.accent, color: "#000" }}>{course.tag}</span>
      )}
      <span className="card-notes-pill">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        {course.notes.length} notes
      </span>
    </div>
    <div className="card-body">
      <div className="card-pills">
        <span className="card-cat" style={{ color: CAT_META[course.category]?.color, background: `${CAT_META[course.category]?.color}16` }}>
          {CAT_META[course.category]?.emoji} {course.category}
        </span>
        <span className="card-lv" style={{ color: lvColor(course.level), background: `${lvColor(course.level)}16` }}>
          {course.level}
        </span>
      </div>
      <h3 className="card-title">{course.title}</h3>
      <p className="card-subtitle" style={{ color: course.accent }}>{course.subtitle}</p>
      <p className="card-desc">{course.desc}</p>
      <div className="card-meta">
        <span className="card-meta-item">⭐ {course.rating}</span>
        <span className="card-meta-dot">·</span>
        <span className="card-meta-item">👥 {course.students}</span>
        <span className="card-meta-dot">·</span>
        <span className="card-meta-item">🕐 {course.duration}</span>
        <span className="card-meta-dot">·</span>
        <span className="card-meta-item">📚 {course.lessons} lessons</span>
      </div>
      <div className="card-accent-line" style={{ background: `linear-gradient(90deg, ${course.accent}, transparent)` }} />
      <div className="card-actions">
        <button
          className="card-btn-primary"
          style={{ background: course.accent, color: "#000", boxShadow: `0 6px 24px rgba(${course.rgb},.32)` }}
          onClick={() => onOpen(course)}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          Open Library
        </button>
        <button
          className="card-btn-secondary"
          style={{ borderColor: `${course.accent}55`, color: course.accent }}
          onClick={() => onOpen(course)}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Downloads
        </button>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   HORIZONTAL SCROLL STRIP
═══════════════════════════════════════════════════════ */
const HStrip = ({ items, onOpen }) => {
  const ref = useRef(null);

  const handleWheel = useCallback(e => {
    if (!ref.current) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    e.preventDefault();
    ref.current.scrollLeft += e.deltaY * 1.15;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  return (
    <div className="hstrip" ref={ref} role="list">
      {items.map((c, i) => (
        <div key={c.id} className="hstrip-cell" role="listitem">
          <CourseCard course={c} idx={i} onOpen={onOpen} />
        </div>
      ))}
      <div className="hstrip-fade-end" aria-hidden="true" />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   SECTION HEADER
═══════════════════════════════════════════════════════ */
const SectionHeader = ({ cat }) => (
  <div className="sec-hdr">
    <div className="sec-hdr-left">
      <span className="sec-emoji">{CAT_META[cat]?.emoji}</span>
      <h2 className="sec-title" style={{ color: CAT_META[cat]?.color }}>{cat}</h2>
      <div className="sec-title-line" style={{ background: `linear-gradient(90deg, ${CAT_META[cat]?.color}60, transparent)` }} />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
export default function Library() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [openCourse, setOpenCourse] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  // Lock body scroll ONLY when panel/modal is open, preserving page scroll
  useEffect(() => {
    document.body.style.overflow = openCourse ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openCourse]);

  // Apply theme to html element for full-page coverage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const filtered = COURSES.filter(c => {
    const q = search.toLowerCase();
    return (c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)) &&
      (activeCat === "All" || c.category === activeCat);
  });

  const grouped = filtered.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {});

  const totalNotes = COURSES.reduce((a, c) => a + c.notes.length, 0);

  return (
    <div className="page">
      {/* Ambient background — fixed, no pointer events, won't trap scroll */}
      <div className="page-bg" aria-hidden="true">
        <div className="bg-glow bg-glow--amber" />
        <div className="bg-glow bg-glow--purple" />
        <div className="bg-glow bg-glow--cyan" />
        <div className="bg-dots" />
      </div>

      {/* ── NAVBAR ── */}
      <header className="nav">
        <div className="nav-brand">
          <span className="nav-lv-mark">LV</span>
          <span className="nav-wordmark">Learnify</span>
          <div className="nav-divider" />
          <span className="nav-section">Library</span>
        </div>

        <div className="nav-search-container">
          <svg className="nav-search-ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="nav-search"
            placeholder="Search courses, topics, skills…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search courses"
          />
          {search && (
            <button className="nav-search-clear" onClick={() => setSearch("")} aria-label="Clear search">✕</button>
          )}
        </div>

        <div className="nav-actions">
          <span className="nav-stats-pill">{COURSES.length} Courses · {totalNotes} PDFs</span>
          <ThemeToggle dark={darkMode} onToggle={() => setDarkMode(d => !d)} />
          <button className="nav-home-btn" onClick={() => navigate("/")} aria-label="Go home">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Home
          </button>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="hero" aria-label="Library hero">
        <div className="hero-eyebrow">
          <span className="hero-pulse-dot" />
          E-Learning Knowledge Base
        </div>
        <h1 className="hero-heading">
          Your Complete<br />
          <em className="hero-gradient-text">Course Library</em>
        </h1>
        <p className="hero-tagline">
          {COURSES.length} expert-crafted courses · {totalNotes} downloadable PDFs · lifetime access
        </p>

        <div className="hero-stats-grid">
          {[["6", "Courses"], ["18", "Study PDFs"], ["4.8★", "Avg Rating"], ["110k+", "Learners"]].map(([n, l], i) => (
            <div key={i} className="hero-stat">
              <span className="hero-stat-num">{n}</span>
              <span className="hero-stat-label">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORY FILTER BAR ── */}
      <nav className="cat-bar" aria-label="Category filter">
        {CATS.map(c => {
          const cnt = c === "All" ? filtered.length : filtered.filter(x => x.category === c).length;
          return (
            <button
              key={c}
              className={`cat-pill ${activeCat === c ? "cat-pill--active" : ""}`}
              onClick={() => setActiveCat(c)}
              aria-pressed={activeCat === c}
            >
              {c !== "All" && <span className="cat-pill-emoji">{CAT_META[c]?.emoji}</span>}
              {c}
              <span className="cat-pill-count">{cnt}</span>
            </button>
          );
        })}
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content" aria-label="Course sections">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3 className="empty-heading">No results for "{search}"</h3>
            <p className="empty-sub">Try a different keyword or browse all categories.</p>
            <button className="empty-reset-btn" onClick={() => { setSearch(""); setActiveCat("All"); }}>
              Clear Filters
            </button>
          </div>
        ) : activeCat !== "All" ? (
          <section className="course-section">
            <SectionHeader cat={activeCat} />
            <div className="sec-course-count">
              <span className="sec-count-pill" style={{ color: CAT_META[activeCat]?.color, background: `${CAT_META[activeCat]?.color}14` }}>
                {filtered.length} course{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
            <HStrip items={filtered} onOpen={setOpenCourse} />
          </section>
        ) : (
          Object.entries(grouped).map(([cat, items]) => (
            <section key={cat} className="course-section">
              <div className="sec-hdr-row">
                <SectionHeader cat={cat} />
                <span className="sec-count-pill" style={{ color: CAT_META[cat]?.color, background: `${CAT_META[cat]?.color}14` }}>
                  {items.length} course{items.length !== 1 ? "s" : ""}
                </span>
              </div>
              <HStrip items={items} onOpen={setOpenCourse} />
            </section>
          ))
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-brand">
          <span className="footer-lv">LV</span>
          <span className="footer-name">Learnify</span>
        </div>
        <p className="footer-copy">© 2025 Learnify · All course materials are copyright protected · Personal use only</p>
        <button className="footer-home-btn" onClick={() => navigate("/")}>
          Back to Home →
        </button>
      </footer>

      {/* ── OVERLAYS ── */}
      {openCourse && (
        <CoursePanel course={openCourse} onClose={() => setOpenCourse(null)} />
      )}
    </div>
  );
}