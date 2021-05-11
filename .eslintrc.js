// This is a dynamic eslint template that loads and configures itself based on the current project
// You might not care how it does it's job. If you really need to change a rule, just edit the rules props

const packageJson = require('./package.json')
const dependencies = Object.keys({
  ...(packageJson.dependencies || {}),
  ...(packageJson.devDependencies || {})
})

const browser = dependencies.includes('webpack')
const node = Boolean(packageJson.engines && packageJson.engines.node)
const babel = dependencies.some((x) => x.includes('babel'))
const typescript = dependencies.some((x) => x.includes('typescript'))
const imports = dependencies.includes('eslint-plugin-import')
const promise = dependencies.includes('eslint-plugin-promise')
const react = dependencies.includes('react')
const reactHooks = react && dependencies.includes('eslint-plugin-react-hooks')
const jquery = dependencies.includes('jquery')
const jest = dependencies.includes('jest') // eslint-disable-line no-shadow
const style = dependencies.includes('prettier') ? 'off' : 'warn'
const tsPrefix = typescript ? '@typescript-eslint/' : ''
const indentSetting = 'tab'
const semiSetting = 'always'
const ecmaVersion = 11
const minSupportedEcmaVersion =
  babel || typescript || node || react ? ecmaVersion : 5 // this is an assumption!

let configFile
try {
  configFile = require(typescript ? './tsconfig.json' : './jsconfig.json')
} catch (e) {
  if (typescript) throw e
  configFile = {}
}
const { strict, strictNullChecks, baseUrl, module: moduleType = '' } =
  configFile.compilerOptions || {}
const esModules = moduleType.toLowerCase().startsWith('es')

const env = process.env.NODE_ENV || ''
const isInProductionMode = env.includes('production')
const productionWarn = isInProductionMode ? 'warn' : 'off'
const productionError = isInProductionMode ? 'error' : 'warn'

module.exports = {
  root: true,
  env: {
    es6: true,
    browser,
    node,
    jest,
    jquery
  },
  extends: [
    'eslint:recommended',
    jest && 'plugin:jest/recommended',
    react && 'plugin:react/recommended',
    typescript && 'plugin:@typescript-eslint/recommended'
  ].filter(Boolean),
  parser: babel
    ? 'babel-eslint'
    : typescript
    ? '@typescript-eslint/parser'
    : null,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion,
    project: typescript ? './tsconfig.lint.json' : null,
    ecmaFeatures: {
      impliedStrict: true,
      jsx: react
    }
  },
  plugins: [
    jest && 'jest',
    react && 'react',
    reactHooks && 'react-hooks',
    typescript && '@typescript-eslint',
    typescript && 'unused-imports',
    imports && 'import',
    node && 'node',
    promise && 'promise'
  ].filter(Boolean),
  overrides: [
    {
      files: ['.*.js', '*.conf?(ig).js'],
      rules: Object.assign(
        {
          'global-require': 'off',
          'no-sync': 'off'
        },
        imports && {
          'import/no-commonjs': 'off',
          'import/no-dynamic-require': 'off'
        },
        typescript && {
          '@typescript-eslint/no-unnecessary-condition': 'off'
        }
      )
    },
    {
      files: ['./src/**/!(*.test).js'],
      rules: {
        'no-console': productionWarn
      }
    }
  ],
  rules: Object.assign(
    {
      'accessor-pairs': 'warn',
      'array-bracket-newline': [style, 'consistent'],
      'array-bracket-spacing': 'off',
      'array-callback-return': ['warn', { allowImplicit: true }],
      'array-element-newline': 'off',
      'arrow-body-style': 'off',
      'arrow-parens': 'off',
      'arrow-spacing': style,
      'block-scoped-var': 'error',
      'block-spacing': style,
      [`${tsPrefix}brace-style`]: [style, '1tbs', { allowSingleLine: true }],
      'callback-return': [
        'warn',
        [
          'cb',
          'cb2',
          'error_cb',
          'cb_error',
          'success_cb',
          'cb_success',
          'callback',
          'error_callback',
          'callback_error',
          'success_callback',
          'success_error',
          'errorCb',
          'cbError',
          'successCb',
          'cbSuccess',
          'errorCallback',
          'callbackError',
          'successCallback',
          'successError',
          'done'
        ]
      ],
      [`${tsPrefix}camelcase`]: 'off',
      'capitalized-comments': 'off',
      'class-methods-use-this': 'off',
      'comma-dangle': [
        style,
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions:
            babel || typescript || minSupportedEcmaVersion >= 6
              ? 'always-multiline'
              : 'ignore'
        }
      ],
      [`${tsPrefix}comma-spacing`]: style,
      'comma-style': style,
      complexity: 'off',
      'computed-property-spacing': [style, 'never'],
      'consistent-return': 'off',
      'consistent-this': 'off',
      'constructor-super': 'error',
      curly: [style, 'multi-line'],
      'default-case': 'warn',
      // 'default-case-last': 'error', // v7
      [`${tsPrefix}default-param-last`]: 'error',
      'dot-location': [style, 'property'],
      'dot-notation': 'warn',
      'eol-last': [style, 'never'],
      eqeqeq: 'warn', // fix is not func eq
      'for-direction': 'off',
      [`${tsPrefix}func-call-spacing`]: style,
      'func-name-matching': 'off',
      'func-names': 'off',
      'func-style': 'off',
      'function-call-argument-newline': 'off',
      'function-paren-newline': [style, 'consistent'],
      'generator-star-spacing': style,
      'getter-return': 'error',
      'global-require': 'warn',
      'grouped-accessor-pairs': 'error',
      'guard-for-in': 'off',
      'handle-callback-err': 'warn',
      'id-blacklist': 'off',
      'id-length': 'off',
      'id-match': 'off',
      'implicit-arrow-linebreak': [style, 'beside'],
      [`${tsPrefix}indent`]: [
        style,
        indentSetting,
        {
          ignoredNodes: ['JSXElement'],
          flatTernaryExpressions: true
        }
      ],
      'init-declarations': 'off',
      'jsx-quotes': [style, 'prefer-single'],
      'key-spacing': style,
      'keyword-spacing': style,
      'line-comment-position': 'off',
      'linebreak-style': 'off',
      'lines-around-comment': 'off',
      'lines-between-class-members': [
        style,
        'always',
        { exceptAfterSingleLine: true }
      ],
      'max-classes-per-file': 'off',
      'max-depth': 'off',
      'max-len': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-nested-callbacks': 'error',
      'max-params': 'off',
      'max-statements': 'off',
      'max-statements-per-line': 'off',
      'multiline-comment-style': 'off',
      'multiline-ternary': 'off',
      'new-cap': [
        'warn',
        {
          newIsCap: true,
          capIsNew: true,
          properties: true
        }
      ],
      'new-parens': 'warn',
      'newline-per-chained-call': [style, { ignoreChainWithDepth: 3 }],
      'no-alert': 'warn',
      [`${tsPrefix}no-array-constructor`]: 'warn',
      'no-async-promise-executor': 'error',
      'no-await-in-loop': 'off',
      'no-bitwise': 'off',
      'no-buffer-constructor': 'off',
      'no-caller': 'error',
      'no-case-declarations': 'warn',
      'no-class-assign': 'error',
      'no-compare-neg-zero': 'error',
      'no-cond-assign': ['error', 'except-parens'],
      'no-confusing-arrow': 'off',
      'no-continue': 'off',
      'no-console': 'off',
      'no-const-assign': 'error',
      'no-constant-condition': 'error',
      'no-constructor-return': 'error',
      'no-control-regex': 'warn',
      'no-delete-var': 'error',
      'no-debugger': productionError,
      'no-div-regex': 'off',
      'no-dupe-args': 'error',
      [`${tsPrefix}no-dupe-class-members`]: 'error',
      'no-dupe-else-if': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-duplicate-imports': imports ? 'off' : 'error',
      'no-else-return': 'warn',
      'no-empty': productionError, // should have justifying comment
      'no-empty-character-class': 'warn',
      [`${tsPrefix}no-empty-function`]: 'off',
      'no-empty-pattern': 'warn',
      'no-eq-null': 'off',
      'no-eval': 'error',
      'no-ex-assign': 'warn',
      'no-extend-native': 'error',
      'no-extra-boolean-cast': 'warn',
      'no-extra-bind': 'warn',
      'no-extra-label': 'off', // no-labels
      [`${tsPrefix}no-extra-parens`]: 'off', // useful for unambiguity
      [`${tsPrefix}no-extra-semi`]: style,
      'no-import-assign': 'error',
      'no-fallthrough': 'warn',
      'no-floating-decimal': style,
      'no-func-assign': 'error',
      'no-global-assign': 'error',
      'no-implicit-coercion': 'warn',
      'no-implicit-globals': 'error',
      [`${tsPrefix}no-implied-eval`]: 'error',
      'no-inline-comments': 'off',
      'no-inner-declarations': 'off',
      'no-invalid-regexp': 'error',
      'no-invalid-this': 'off',
      'no-irregular-whitespace': 'warn',
      'no-iterator': 'error',
      'no-labels': 'error',
      'no-label-var': 'off', // no-labels
      'no-lone-blocks': 'warn',
      'no-lonely-if': 'warn',
      'no-loop-func': 'warn',
      [`${tsPrefix}no-magic-numbers`]: 'off',
      'no-misleading-character-class': 'warn',
      'no-mixed-operators': 'off',
      'no-mixed-requires': 'warn',
      'no-mixed-spaces-and-tabs': style,
      'no-multi-assign': 'off',
      'no-multi-spaces': style,
      'no-multi-str': 'warn',
      'no-multiple-empty-lines': [style, { max: 2 }],
      'no-negated-condition': 'warn',
      'no-nested-ternary': 'off',
      'no-new': 'warn',
      'no-new-func': 'error',
      'no-new-object': 'warn',
      'no-new-require': 'error',
      'no-new-symbol': 'error',
      'no-new-wrappers': 'error',
      'no-obj-calls': 'error',
      'no-octal': 'warn',
      'no-octal-escape': 'error',
      'no-param-reassign': 'warn',
      'no-path-concat': 'error',
      'no-plusplus': 'off',
      'no-process-env': 'off',
      'no-process-exit': 'off',
      'no-proto': productionError,
      'no-prototype-builtins': 'error',
      'no-redeclare': 'error',
      'no-regex-spaces': 'warn',
      'no-restricted-globals': 'error',
      // 'no-restricted-exports': 'error', // v7
      'no-restricted-imports': 'error',
      'no-restricted-modules': 'error',
      'no-restricted-properties': 'error',
      'no-restricted-syntax': 'error',
      'no-return-assign': 'error',
      [`${typescript ? tsPrefix : 'no-'}return-await`]: 'off',
      'no-script-url': 'warn',
      'no-self-assign': 'warn',
      'no-self-compare': 'warn',
      'no-setter-return': 'error',
      'no-sequences': 'error',
      'no-shadow': [
        'warn',
        {
          builtinGlobals: true,
          allow: [
            'blur',
            'close',
            'closed',
            'confirm',
            'crypto',
            'defaultStatus',
            'defaultstatus',
            'devicePixelRatio',
            'external',
            'find',
            'focus',
            'getSelection',
            'history',
            'innerHeight',
            'innerWidth',
            'length',
            'location',
            'menubar',
            'moveBy',
            'moveTo',
            'name',
            'open',
            'opener',
            'origin',
            'outerHeight',
            'outerWidth',
            'pageXOffset',
            'pageYOffset',
            'parent',
            'performance',
            'postMessage',
            'resizeBy',
            'resizeTo',
            'scheduler',
            'screen',
            'screenLeft',
            'screenTop',
            'screenX',
            'screenY',
            'scroll',
            'scrollBy',
            'scrollX',
            'scrollY',
            'scrollbars',
            'self',
            'status',
            'statusbar',
            'stop',
            'toolbar',
            'top'
          ]
        }
      ],
      'no-shadow-restricted-names': 'error',
      'no-sparse-arrays': 'warn',
      'no-sync': 'warn',
      'no-tabs': [style, { allowIndentationTabs: indentSetting === 'tab' }],
      'no-template-curly-in-string': 'warn',
      'no-ternary': 'off',
      'no-this-before-super': 'warn',
      [`${tsPrefix}no-throw-literal`]: 'off', // disabled in favor of async fns
      'no-trailing-spaces': style,
      'no-undef-init': 'warn',
      'no-undef': 'error',
      'no-undefined': 'off',
      'no-underscore-dangle': 'off',
      'no-unmodified-loop-condition': 'warn',
      'no-unneeded-ternary': 'warn',
      'no-unreachable': 'warn',
      'no-unsafe-finally': 'warn',
      'no-unsafe-negation': 'warn',
      [`${tsPrefix}no-unused-expressions`]: 'warn',
      'no-unused-labels': 'off', // no-labels
      'no-unexpected-multiline': 'error',
      [`${tsPrefix}no-unused-vars`]: [
        productionError,
        { ignoreRestSiblings: true }
      ],
      [`${tsPrefix}no-use-before-define`]: [
        'error',
        {
          functions: false
        }
      ],
      // 'no-useless-backreference': 'warn', // v7
      'no-useless-catch': 'warn',
      'no-useless-computed-key': 'warn',
      [`${tsPrefix}no-useless-constructor`]: 'warn',
      'no-useless-call': 'warn',
      'no-useless-rename': 'warn',
      'no-useless-concat': 'warn',
      'no-useless-escape': 'warn',
      'no-useless-return': 'warn',
      'no-var': 'error',
      'no-void': 'error',
      'no-warning-comments': 'off',
      'no-whitespace-before-property': style,
      'no-with': 'warn',
      'nonblock-statement-body-position': style,
      'object-curly-newline': [
        style,
        {
          multiline: true,
          consistent: true,
          minProperties: 4
        }
      ],
      'object-curly-spacing': [style, 'always'],
      'object-property-newline': [
        style,
        { allowAllPropertiesOnSameLine: true }
      ],
      'object-shorthand':
        babel || typescript || minSupportedEcmaVersion >= 6 ? 'warn' : 'off',
      'one-var': ['error', 'never'],
      'one-var-declaration-per-line': 'off',
      'operator-assignment': 'off',
      'operator-linebreak': 'off',
      'padded-blocks': 'off',
      'padding-line-between-statements': 'error',
      'prefer-arrow-callback': 'off',
      'prefer-const': 'warn',
      'prefer-destructuring': 'off',
      'prefer-exponentiation-operator':
        babel || typescript || minSupportedEcmaVersion >= 7 ? 'error' : 'off',
      'prefer-named-capture-group': 'off',
      'prefer-numeric-literals': 'off',
      'prefer-object-spread': 'off',
      'prefer-promise-reject-errors': 'off',
      'prefer-regex-literals': 'off',
      'prefer-rest-params': 'off',
      'prefer-spread': 'off',
      'prefer-template': 'off',
      'quote-props': [style, 'consistent-as-needed'],
      [`${tsPrefix}quotes`]: [style, 'single', { avoidEscape: true }],
      radix: 'off',
      'require-atomic-updates': 'warn',
      [`${tsPrefix}require-await`]: 'off',
      'require-unicode-regexp': 'off',
      'require-yield': 'warn',
      'rest-spread-spacing': style,
      [`${tsPrefix}semi`]: [style, semiSetting],
      'semi-spacing': style,
      'semi-style': style,
      'sort-imports': 'off',
      'sort-keys': 'off',
      'sort-vars': 'off',
      'space-before-blocks': style,
      [`${tsPrefix}space-before-function-paren`]: [
        style,
        {
          anonymous: 'never',
          named: 'never',
          asyncArrow: 'always'
        }
      ],
      'space-in-parens': style,
      'space-infix-ops': style,
      'space-unary-ops': [
        style,
        {
          words: true,
          nonwords: false
        }
      ],
      'spaced-comment': 'off',
      strict: 'off',
      'switch-colon-spacing': style,
      'symbol-description': 'warn',
      'template-curly-spacing': [style, 'never'],
      'template-tag-spacing': style,
      'unicode-bom': ['error', 'never'],
      'unused-imports/no-unused-imports-ts': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',
      'vars-on-top': 'off',
      'wrap-iife': [style, 'inside', { functionPrototypeMethods: true }],
      'wrap-regex': 'off',
      'yield-star-spacing': [style, 'before'],
      yoda: ['warn', 'never', { exceptRange: true }]
    },
    imports && {
      'import/no-unresolved': [
        'error',
        {
          commonjs: true,
          ignore: [
            '\\.serverless-outputs/stack.json$',
            '\\.serverless-outputs/test-resources.json$'
          ]
        }
      ],
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/no-restricted-paths': 'off',
      'import/no-absolute-path': 'off',
      'import/no-dynamic-require': 'error',
      'import/no-internal-modules': 'off',
      'import/no-webpack-loader-syntax': 'off',
      'import/no-self-import': 'error',
      'import/no-cycle': 'error',
      'import/no-useless-path-segments': 'warn',
      'import/no-relative-parent-imports': 'off',
      'import/no-unused-modules': 'off',
      'import/export': 'error',
      'import/no-named-as-default': 'warn',
      'import/no-named-as-default-member': 'warn',
      'import/no-deprecated': 'off',
      'import/no-extraneous-dependencies': 'warn',
      'import/no-mutable-exports': 'off',
      'import/unambiguous': 'off',
      'import/no-commonjs': esModules ? 'error' : 'off',
      'import/no-amd': 'error',
      'import/no-nodejs-modules': 'off',
      'import/first': 'warn',
      'import/exports-last': 'off',
      'import/no-duplicates': 'warn',
      'import/no-namespace': 'warn',
      'import/extensions': 'off',
      'import/order': 'off',
      'import/newline-after-import': style,
      'import/prefer-default-export': 'off',
      'import/max-dependencies': 'off',
      'import/no-unassigned-import': 'off',
      'import/no-named-default': 'warn',
      'import/no-default-export': 'off',
      'import/no-named-export': 'off',
      'import/no-anonymous-default-export': 'off',
      'import/group-exports': 'off',
      'import/dynamic-import-chunkname': 'off'
    },
    jest && {
      'jest/consistent-test-it': 'warn',
      'jest/expect-expect': productionWarn,
      'jest/lowercase-name': 'off',
      'jest/no-alias-methods': style,
      'jest/no-disabled-tests': 'warn',
      'jest/no-commented-out-tests': productionError,
      'jest/no-focused-tests': productionError, // circumvents whole test suite
      'jest/no-hooks': 'off',
      'jest/no-identical-title': 'warn',
      'jest/no-jasmine-globals': 'warn',
      'jest/no-jest-import': 'error',
      'jest/no-mocks-import': 'error',
      'jest/no-large-snapshots': 'off',
      'jest/no-test-callback': 'off', // possibility of evergreen test
      'jest/no-test-prefixes': style,
      'jest/no-test-return-statement': 'warn',
      'jest/no-truthy-falsy': 'off',
      'jest/prefer-expect-assertions': 'off',
      'jest/prefer-spy-on': 'warn',
      'jest/prefer-strict-equal': 'off',
      'jest/prefer-to-be-null': style,
      'jest/prefer-to-be-undefined': style,
      'jest/prefer-to-contain': style,
      'jest/prefer-to-have-length': style,
      'jest/require-to-throw-message': 'off',
      'jest/valid-describe': 'error',
      'jest/valid-expect-in-promise': 'error',
      'jest/valid-expect': 'error',
      ['jest/prefer-tod' + 'o']: 'warn', // eslint-disable-line no-useless-concat
      'jest/prefer-called-with': 'off',
      'jest/no-export': 'off'
    },
    react && {
      'react/boolean-prop-naming': 'off',
      'react/button-has-type': 'warn',
      'react/default-props-match-prop-types': 'off',
      'react/destructuring-assignment': 'off',
      'react/display-name': 'off',
      'react/forbid-component-props': 'off',
      'react/forbid-dom-props': 'off',
      'react/forbid-elements': 'off',
      'react/forbid-prop-types': 'off',
      'react/forbid-foreign-prop-types': 'off',
      'react/no-access-state-in-setstate': 'warn',
      'react/no-array-index-key': 'off',
      'react/no-children-prop': 'warn',
      'react/no-danger': productionError,
      'react/no-danger-with-children': productionError,
      'react/no-deprecated': 'error',
      'react/no-did-mount-set-state': 'error',
      'react/no-did-update-set-state': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'warn',
      'react/no-is-mounted': 'warn',
      'react/no-multi-component': 'off',
      'react/no-redundant-should-component-update': 'error',
      'react/no-render-return-value': 'warn',
      'react/no-set-state': 'off',
      'react/no-typos': 'warn',
      'react/no-string-refs': 'warn',
      'react/no-this-in-sfc': 'error',
      'react/no-unescaped-entities': [
        'warn',
        {
          forbid: ['<', '>', '||', '&&']
        }
      ],
      'react/no-unknown-property': 'warn',
      'react/no-unsafe': 'error',
      'react/no-unused-state': 'warn',
      'react/no-unused-prop-types': 'warn',
      'react/no-will-update-set-state': 'error',
      'react/prefer-es6-class': minSupportedEcmaVersion >= 6 ? 'error' : 'off',
      'react/prefer-read-only-props': 'off',
      'react/prefer-stateless-function': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'error',
      'react/require-default-props': 'off',
      'react/require-optimization': 'off',
      'react/require-render-return': 'warn',
      'react/self-closing-comp': [
        style,
        {
          component: true,
          html: true
        }
      ],
      'react/sort-comp': 'off',
      'react/sort-prop-types': 'off',
      'react/state-in-constructor': 'off',
      'react/style-prop-object': 'error',
      'react/void-dom-elements-no-children': 'error',
      'react/jsx-boolean-value': 'off',
      'react/jsx-child-element-spacing': 'off',
      'react/jsx-closing-bracket-location': style,
      'react/jsx-closing-tag-location': 'off',
      'react/jsx-curly-spacing': style,
      'react/jsx-equals-spacing': style,
      'react/jsx-filename-extension': 'off',
      'react/jsx-first-prop-new-line': [style, 'multiline-multiprop'],
      'react/jsx-handler-names': 'off',
      'react/jsx-indent': [
        style,
        indentSetting,
        {
          indentLogicalExpressions: true,
          checkAttributes: true
        }
      ],
      'react/jsx-indent-props': [style, indentSetting],
      'react/jsx-key': 'warn',
      'react/jsx-max-depth': 'off',
      'react/jsx-max-props-per-line': 'off',
      'react/jsx-no-bind': [
        style,
        {
          ignoreDOMComponents: true,
          ignoreRefs: true,
          allowArrowFunctions: true,
          allowFunctions: true,
          allowBind: false
        }
      ],
      'react/jsx-no-comment-textnodes': 'warn',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-literals': 'off',
      'react/jsx-no-target-blank': 'warn',
      'react/jsx-no-undef': 'error',
      'react/jsx-one-expression-per-line': [style, { allow: 'single-child' }],
      'react/jsx-curly-brace-presence': [
        style,
        { props: 'never', children: 'ignore' }
      ],
      'react/jsx-fragments': style,
      'react/jsx-pascal-case': style,
      'react/jsx-props-no-multi-spaces': style,
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-sort-default-props': 'off',
      'react/jsx-sort-props': 'off',
      'react/jsx-space-before-closing': 'off', // deprecated
      'react/jsx-tag-spacing': [
        style,
        {
          closingSlash: 'never',
          beforeSelfClosing: 'always',
          afterOpening: 'never',
          beforeClosing: 'never'
        }
      ],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'warn',
      'react/jsx-wrap-multilines': [
        style,
        {
          declaration: 'parens-new-line',
          assignment: 'parens-new-line',
          return: 'parens-new-line',
          arrow: 'parens-new-line',
          condition: 'parens-new-line',
          logical: 'parens-new-line',
          prop: 'parens-new-line'
        }
      ]
    },
    reactHooks && {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    },
    node && {
      // there are much more rules, need to check
      'node/no-callback-literal': 'off',
      'node/no-exports-assign': 'off',
      'node/no-extraneous-import': 'warn',
      'node/no-extraneous-require': 'error',
      'node/no-missing-import': 'off',
      'node/no-missing-require': 'off',
      'node/no-unpublished-bin': 'error',
      'node/no-unpublished-import': 'off',
      'node/no-unpublished-require': 'off',
      'node/no-unsupported-features/es-builtins':
        typescript || babel ? 'off' : 'error',
      'node/no-unsupported-features/es-syntax':
        typescript || babel ? 'off' : 'error',
      'node/no-unsupported-features/node-builtins': 'error',
      'node/process-exit-as-throw': 'off',
      'node/shebang': 'off',
      'node/no-deprecated-api': 'error'
    },
    promise && {
      'promise/always-return': 'off',
      'promise/avoid-new': 'off',
      'promise/catch-or-return': [
        'warn',
        { allowThen: true, allowFinally: true }
      ],
      'promise/no-callback-in-promise': 'warn',
      'promise/no-native': 'off',
      'promise/no-nesting': 'warn',
      'promise/no-new-statics': 'error',
      'promise/no-promise-in-callback': 'off',
      'promise/no-return-in-finally': 'error',
      'promise/no-return-wrap': 'off',
      'promise/param-names': 'warn',
      'promise/prefer-await-to-callbacks': 'off',
      'promise/prefer-await-to-then': 'off',
      'promise/valid-params': 'error'
    },
    typescript && {
      '@typescript-eslint/adjacent-overload-signatures': 'warn',
      '@typescript-eslint/array-type': 'warn',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/ban-types': 'error',
      '@typescript-eslint/consistent-type-assertions': [
        'off',
        {
          assertionStyle: 'as',
          objectLiteralTypeAssertions: 'allow-as-parameter'
        }
      ],
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/member-delimiter-style': [
        style,
        {
          multiline: {
            delimiter: semiSetting ? 'semi' : 'none',
            requireLast: true
          },
          singleline: { delimiter: 'comma', requireLast: false }
        }
      ],
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-base-to-string': 'error',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extra-non-null-assertion': 'error',
      '@typescript-eslint/no-extraneous-class': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-for-in-array': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-misused-promises': 'warn',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion':
        strict || strictNullChecks ? 'warn' : 'off',
      '@typescript-eslint/no-parameter-properties': 'off',
      '@typescript-eslint/no-require-imports':
        !imports && esModules ? 'error' : 'off',
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/no-type-alias': 'off',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unnecessary-qualifier': 'error',
      '@typescript-eslint/no-unnecessary-type-arguments': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/no-unused-vars-experimental': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/prefer-function-type': 'off',
      '@typescript-eslint/prefer-includes': 'warn',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/prefer-readonly': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/prefer-regexp-exec': 'warn',
      '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
      '@typescript-eslint/promise-function-async': 'warn',
      '@typescript-eslint/require-array-sort-compare': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'off',
      '@typescript-eslint/triple-slash-reference': 'error',
      '@typescript-eslint/type-annotation-spacing': style,
      '@typescript-eslint/typedef': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/unified-signatures': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['off']
    }
  ),
  settings: {
    'import/resolver': browser
      ? {
          webpack: { config: 'webpack.config.js' }
        }
      : typescript
      ? {
          typescript: {}
        }
      : {
          node: {
            paths: baseUrl ? [baseUrl] : [],
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.node']
          }
        },
    react: {
      version: 'detect'
    },
    minSupportedEcmaVersion
  }
}

/* To get all rules (to check for updates/deprecations):
 * Goto: https://eslint.org/docs/rules/ and run:
 * const pageRules = [...document.querySelectorAll("table.rule-list td:nth-child(3) p a")].map(x => x.innerHTML)
 *
 * Run the following bash command and paste the contents into a const myRules
 * node -e "console.log(require('./.eslintrc.js').rules)"
 *
 * Then you can run these checks:
 * pageRules.filter(x => !myRules.includes(x))
 * myRules.filter(x => !pageRules.includes(x) && !x.includes('/'))
 * myRules.filter(x => myRules.includes(`@typescript-eslint/${x}`))
 */
console.log('eslint config parsed')
