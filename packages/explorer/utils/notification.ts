import toast from 'react-hot-toast'
import { iNotification } from '../types/notification'

const customToastStyle = {
  style: {
    border: '1px solid #78838e',
    padding: '16px',
    color: 'white',
    background: '#1D2127',
  },
}

export const generateError = (message: string): iNotification => {
  return {
    message,
    type: 'error',
  }
}

export const generateSuccess = (message: string): iNotification => {
  return {
    message,
    type: 'success',
  }
}

export const isNotification = (object: any): object is iNotification => {
  return object.type === 'error' || object.type === 'success'
}

export const isError = (object: any): object is iNotification => {
  return object.type === 'error'
}

export const throwNotification = (notification: iNotification) => {
  return toast[notification.type](notification.message, customToastStyle)
}
