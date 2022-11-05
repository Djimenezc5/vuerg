import { ToastProgrammatic as toast } from 'buefy'
const alerta = (duration, msg, position, type) => {
  toast.open({
    duration: duration || 3000,
    message: msg || 'Update Successful',
    position: position || 'is-bottom-left',
    type: type || 'is-success',
  })
}

export { alerta }
