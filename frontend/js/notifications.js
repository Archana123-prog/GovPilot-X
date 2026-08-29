export function notify(message,type='info'){document.dispatchEvent(new CustomEvent('govpilot:notification',{detail:{message,type}}))}
