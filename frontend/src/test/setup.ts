import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '../i18n'

afterEach(() => cleanup())

// jsdom does not implement <dialog> modality; enough of it for focus tests.
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
}
