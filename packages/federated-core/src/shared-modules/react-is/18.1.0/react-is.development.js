System.register([], function (exports) {

  return {
    execute() {

      function createCommonjsModule(fn, module) {
        return module = { exports: {} }, fn(module, module.exports), module.exports
      }

      /**
       * @license React
       * react-is.production.min.js
       *
       * Copyright (c) Facebook, Inc. and its affiliates.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */
      const b = Symbol.for('react.element'); const c = Symbol.for('react.portal'); const d = Symbol.for('react.fragment'); const e = Symbol.for('react.strict_mode'); const f = Symbol.for('react.profiler'); const g = Symbol.for('react.provider'); const h = Symbol.for('react.context'); const k = Symbol.for('react.server_context'); const l = Symbol.for('react.forward_ref'); const m = Symbol.for('react.suspense'); const n = Symbol.for('react.suspense_list'); const p = Symbol.for('react.memo'); const q = Symbol.for('react.lazy'); const t = Symbol.for('react.offscreen'); let u;u = Symbol.for('react.module.reference')
      function v(a){if(typeof a === 'object' && a !== null){const r = a.$$typeof;switch(r){case b:switch(a = a.type,a){case d:case f:case e:case m:case n:return a;default:switch(a = a && a.$$typeof,a){case k:case h:case l:case q:case p:case g:return a;default:return r}}case c:return r}}}const ContextConsumer = exports('ContextConsumer', h);const ContextProvider = exports('ContextProvider', g);const Element = exports('Element', b);const ForwardRef = exports('ForwardRef', l);const Fragment = exports('Fragment', d);const Lazy = exports('Lazy', q);const Memo = exports('Memo', p);const Portal = exports('Portal', c);const Profiler = exports('Profiler', f);const StrictMode = exports('StrictMode', e);const Suspense = exports('Suspense', m)
      const SuspenseList = exports('SuspenseList', n);const isAsyncMode = exports('isAsyncMode', function (){return !1});const isConcurrentMode = exports('isConcurrentMode', function (){return !1});const isContextConsumer = exports('isContextConsumer', function (a){return v(a) === h});const isContextProvider = exports('isContextProvider', function (a){return v(a) === g});const isElement = exports('isElement', function (a){return typeof a === 'object' && a !== null && a.$$typeof === b});const isForwardRef = exports('isForwardRef', function (a){return v(a) === l});const isFragment = exports('isFragment', function (a){return v(a) === d});const isLazy = exports('isLazy', function (a){return v(a) === q});const isMemo = exports('isMemo', function (a){return v(a) === p})
      const isPortal = exports('isPortal', function (a){return v(a) === c});const isProfiler = exports('isProfiler', function (a){return v(a) === f});const isStrictMode = exports('isStrictMode', function (a){return v(a) === e});const isSuspense = exports('isSuspense', function (a){return v(a) === m});const isSuspenseList = exports('isSuspenseList', function (a){return v(a) === n})
      const isValidElementType = exports('isValidElementType', function (a){return typeof a === 'string' || typeof a === 'function' || a === d || a === f || a === e || a === m || a === n || a === t || typeof a === 'object' && a !== null && (a.$$typeof === q || a.$$typeof === p || a.$$typeof === g || a.$$typeof === h || a.$$typeof === l || a.$$typeof === u || void 0 !== a.getModuleId) ? !0 : !1});const typeOf = exports('typeOf', v)

      const reactIs_production_min = exports('__moduleExports', {
        ContextConsumer,
        ContextProvider,
        Element,
        ForwardRef,
        Fragment,
        Lazy,
        Memo,
        Portal,
        Profiler,
        StrictMode,
        Suspense,
        SuspenseList,
        isAsyncMode,
        isConcurrentMode,
        isContextConsumer,
        isContextProvider,
        isElement,
        isForwardRef,
        isFragment,
        isLazy,
        isMemo,
        isPortal,
        isProfiler,
        isStrictMode,
        isSuspense,
        isSuspenseList,
        isValidElementType,
        typeOf,
      })

      const reactIs_development = createCommonjsModule(function (module, exports) {

        {
          (function () {

            // -----------------------------------------------------------------------------

            const enableScopeAPI = false // Experimental Create Event Handle API.
            const enableCacheElement = false
            const enableTransitionTracing = false // No known bugs, but needs performance testing

            const enableLegacyHidden = false // Enables unstable_avoidThisFallback feature in Fiber
            // stuff. Intended to enable React core members to more easily debug scheduling
            // issues in DEV builds.

            const enableDebugTracing = false // Track which Fiber(s) schedule render work.

            // ATTENTION

            const REACT_ELEMENT_TYPE = Symbol.for('react.element')
            const REACT_PORTAL_TYPE = Symbol.for('react.portal')
            const REACT_FRAGMENT_TYPE = Symbol.for('react.fragment')
            const REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode')
            const REACT_PROFILER_TYPE = Symbol.for('react.profiler')
            const REACT_PROVIDER_TYPE = Symbol.for('react.provider')
            const REACT_CONTEXT_TYPE = Symbol.for('react.context')
            const REACT_SERVER_CONTEXT_TYPE = Symbol.for('react.server_context')
            const REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref')
            const REACT_SUSPENSE_TYPE = Symbol.for('react.suspense')
            const REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list')
            const REACT_MEMO_TYPE = Symbol.for('react.memo')
            const REACT_LAZY_TYPE = Symbol.for('react.lazy')
            const REACT_OFFSCREEN_TYPE = Symbol.for('react.offscreen')

            let REACT_MODULE_REFERENCE

            {
              REACT_MODULE_REFERENCE = Symbol.for('react.module.reference')
            }

            function isValidElementType(type) {
              if (typeof type === 'string' || typeof type === 'function') {
                return true
              } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).

              if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing ) {
                return true
              }

              if (typeof type === 'object' && type !== null) {
                if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE // This needs to include all possible module reference object
                  // types supported by any Flight configuration anywhere since
                  // we don't know which Flight build this will end up being used
                  // with.
                  || type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== undefined) {
                  return true
                }
              }

              return false
            }

            function typeOf(object) {
              if (typeof object === 'object' && object !== null) {
                const $$typeof = object.$$typeof

                switch ($$typeof) {
                  case REACT_ELEMENT_TYPE:
                    var type = object.type

                    switch (type) {
                      case REACT_FRAGMENT_TYPE:
                      case REACT_PROFILER_TYPE:
                      case REACT_STRICT_MODE_TYPE:
                      case REACT_SUSPENSE_TYPE:
                      case REACT_SUSPENSE_LIST_TYPE:
                        return type

                      default:
                        var $$typeofType = type && type.$$typeof

                        switch ($$typeofType) {
                          case REACT_SERVER_CONTEXT_TYPE:
                          case REACT_CONTEXT_TYPE:
                          case REACT_FORWARD_REF_TYPE:
                          case REACT_LAZY_TYPE:
                          case REACT_MEMO_TYPE:
                          case REACT_PROVIDER_TYPE:
                            return $$typeofType

                          default:
                            return $$typeof
                        }

                    }

                  case REACT_PORTAL_TYPE:
                    return $$typeof
                }
              }

              return undefined
            }
            const ContextConsumer = REACT_CONTEXT_TYPE
            const ContextProvider = REACT_PROVIDER_TYPE
            const Element = REACT_ELEMENT_TYPE
            const ForwardRef = REACT_FORWARD_REF_TYPE
            const Fragment = REACT_FRAGMENT_TYPE
            const Lazy = REACT_LAZY_TYPE
            const Memo = REACT_MEMO_TYPE
            const Portal = REACT_PORTAL_TYPE
            const Profiler = REACT_PROFILER_TYPE
            const StrictMode = REACT_STRICT_MODE_TYPE
            const Suspense = REACT_SUSPENSE_TYPE
            const SuspenseList = REACT_SUSPENSE_LIST_TYPE
            let hasWarnedAboutDeprecatedIsAsyncMode = false
            let hasWarnedAboutDeprecatedIsConcurrentMode = false // AsyncMode should be deprecated

            function isAsyncMode(object) {
              {
                if (!hasWarnedAboutDeprecatedIsAsyncMode) {
                  hasWarnedAboutDeprecatedIsAsyncMode = true // Using console['warn'] to evade Babel and ESLint

                  console.warn('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 18+.')
                }
              }

              return false
            }
            function isConcurrentMode(object) {
              {
                if (!hasWarnedAboutDeprecatedIsConcurrentMode) {
                  hasWarnedAboutDeprecatedIsConcurrentMode = true // Using console['warn'] to evade Babel and ESLint

                  console.warn('The ReactIs.isConcurrentMode() alias has been deprecated, ' + 'and will be removed in React 18+.')
                }
              }

              return false
            }
            function isContextConsumer(object) {
              return typeOf(object) === REACT_CONTEXT_TYPE
            }
            function isContextProvider(object) {
              return typeOf(object) === REACT_PROVIDER_TYPE
            }
            function isElement(object) {
              return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE
            }
            function isForwardRef(object) {
              return typeOf(object) === REACT_FORWARD_REF_TYPE
            }
            function isFragment(object) {
              return typeOf(object) === REACT_FRAGMENT_TYPE
            }
            function isLazy(object) {
              return typeOf(object) === REACT_LAZY_TYPE
            }
            function isMemo(object) {
              return typeOf(object) === REACT_MEMO_TYPE
            }
            function isPortal(object) {
              return typeOf(object) === REACT_PORTAL_TYPE
            }
            function isProfiler(object) {
              return typeOf(object) === REACT_PROFILER_TYPE
            }
            function isStrictMode(object) {
              return typeOf(object) === REACT_STRICT_MODE_TYPE
            }
            function isSuspense(object) {
              return typeOf(object) === REACT_SUSPENSE_TYPE
            }
            function isSuspenseList(object) {
              return typeOf(object) === REACT_SUSPENSE_LIST_TYPE
            }

            exports.ContextConsumer = ContextConsumer
            exports.ContextProvider = ContextProvider
            exports.Element = Element
            exports.ForwardRef = ForwardRef
            exports.Fragment = Fragment
            exports.Lazy = Lazy
            exports.Memo = Memo
            exports.Portal = Portal
            exports.Profiler = Profiler
            exports.StrictMode = StrictMode
            exports.Suspense = Suspense
            exports.SuspenseList = SuspenseList
            exports.isAsyncMode = isAsyncMode
            exports.isConcurrentMode = isConcurrentMode
            exports.isContextConsumer = isContextConsumer
            exports.isContextProvider = isContextProvider
            exports.isElement = isElement
            exports.isForwardRef = isForwardRef
            exports.isFragment = isFragment
            exports.isLazy = isLazy
            exports.isMemo = isMemo
            exports.isPortal = isPortal
            exports.isProfiler = isProfiler
            exports.isStrictMode = isStrictMode
            exports.isSuspense = isSuspense
            exports.isSuspenseList = isSuspenseList
            exports.isValidElementType = isValidElementType
            exports.typeOf = typeOf
          })()
        }
      })
      reactIs_development.ContextConsumer
      reactIs_development.ContextProvider
      reactIs_development.Element
      reactIs_development.ForwardRef
      reactIs_development.Fragment
      reactIs_development.Lazy
      reactIs_development.Memo
      reactIs_development.Portal
      reactIs_development.Profiler
      reactIs_development.StrictMode
      reactIs_development.Suspense
      reactIs_development.SuspenseList
      reactIs_development.isAsyncMode
      reactIs_development.isConcurrentMode
      reactIs_development.isContextConsumer
      reactIs_development.isContextProvider
      reactIs_development.isElement
      reactIs_development.isForwardRef
      reactIs_development.isFragment
      reactIs_development.isLazy
      reactIs_development.isMemo
      reactIs_development.isPortal
      reactIs_development.isProfiler
      reactIs_development.isStrictMode
      reactIs_development.isSuspense
      reactIs_development.isSuspenseList
      reactIs_development.isValidElementType
      reactIs_development.typeOf

      const reactIs = exports('default', createCommonjsModule(function (module) {

        {
          module.exports = reactIs_development
        }
      }))

      const __esModule = exports('__esModule', true)

    },
  }
})
