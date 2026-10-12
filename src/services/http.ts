/** 模拟普通请求：延迟后返回数据（无真实网络请求） */
export function mockRequest<T>(data: T, delay = 400): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

/** 深拷贝，避免 mock 数据被外部引用直接篡改 */
export function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T
}
