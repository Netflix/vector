let timer

self.addEventListener('message', (event) => {
  const interval = event && event.data && event.data.interval

  if (!interval) {
    console.warn('invalid interval received:', event.data)
    return
  }

  if (timer) {
    clearInterval(timer)
  }

  timer = setInterval(() => self.postMessage({}), interval)
}, false)
