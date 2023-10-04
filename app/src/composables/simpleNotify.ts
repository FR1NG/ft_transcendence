import  Notify from 'simple-notify'
import 'simple-notify/dist/simple-notify.min.css'
import { notifyStatus } from 'simple-notify/dist/types'
import '@/scss/simple-notify.scss'

let myNotify: Notify

export function pushNotify(config = {status:'info' as notifyStatus, title:"info", text:"notification title", }) {
  myNotify = new Notify({
    status: config.status,
    title: config.title,
    text: config.text,
    effect: 'fade',
    speed: 300,
    showIcon: true,
    showCloseButton: true,
    autoclose: true,
    autotimeout: 3000,
    gap: 20,
    distance: 20,
    type: 1,
    position: 'right top',
    customClass:'.notifications-container'
  })
}

export function close() {
  myNotify.close()
}
