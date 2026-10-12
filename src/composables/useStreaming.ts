import { ref } from 'vue'

export interface StreamOptions {
  /** 每块字符数 */
  chunkSize?: number
  /** 每块间隔 ms */
  interval?: number
  /** 全部吐完后的回调 */
  onDone?: () => void
}

/**
 * SSE 流式输出的前端模拟：用 setInterval 逐块吐出完整文案。
 * 返回 stop 函数，可在中途停止。
 */
export function useStreaming() {
  const output = ref('')
  const streaming = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  function stop() {
    if (timer) clearInterval(timer)
    timer = null
    streaming.value = false
  }

  function streamText(fullText: string, opts: StreamOptions = {}) {
    stop()
    streaming.value = true
    output.value = ''
    let i = 0
    const { chunkSize = 2, interval = 30, onDone } = opts

    timer = setInterval(() => {
      i += chunkSize
      output.value = fullText.slice(0, i)
      if (i >= fullText.length) {
        stop()
        onDone?.()
      }
    }, interval)
  }

  return { output, streaming, streamText, stop }
}
