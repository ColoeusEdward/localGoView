<template></template>

<script lang="ts" setup>
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'

(self as any).MonacoEnvironment = {
  getWorker(workerId:any, label:any) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    if (label === 'html') {
      return new htmlWorker()
    }
    return new editorWorker()
  }
}
</script>
