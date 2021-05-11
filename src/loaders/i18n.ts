import i18n from 'i18n'
import path from 'path'

i18n.configure({
  locales: ['en'],
  defaultLocale: 'en',
  queryParameter: 'lang',
  directory: path.join('./', '/src/locales'),
  api: {
    __: 'translate',
    __n: 'translateN'
  },
  updateFiles: false,
  objectNotation: true
})

i18n.setLocale('en')

export { i18n }
