import React from 'react'
import Preview from './Preview'
import { search } from 'cerebro-tools'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import initializeAsync from './initializeAsync'

const { openApp, toString } = process.platform === 'win32'
  ? require('./windows')
  : require('./linux')

let appsList = []

const fn = ({ term, actions, display }) => {
  const result = search(appsList, term, toString).map(app => {
    const { id, path, name, description, icon, exec, source } = app
    return {
      icon,
      id: id || path,
      command: exec || source,
      title: name,
      term: name,
      subtitle: description || path,
      clipboard: path,
      onKeyDown: (event) => {
        if (event.ctrlKey && event.keyCode === 82) {
          // Show application by ctrl+R shortcut
          actions.reveal(path)
          event.preventDefault()
        }
      },
      onSelect: () => openApp(app),
      getPreview: () => <Preview name={name} path={path} icon={icon} />
    }
  })
  display(uniqBy(result, app => app.command))
}

export default {
  fn,
  initializeAsync,
  onMessage: (apps) => {
    appsList = uniq([...appsList, ...apps])
  }
}
