import { ref } from 'vue'

// 全局调整状态
const globalIsResizing = ref(false)
const globalResizeDirection = ref<'left' | 'right' | null>(null)

export function useResize() {
  const startX = ref(0)
  const startWidth = ref(0)

  function startResize(
    event: MouseEvent,
    direction: 'left' | 'right',
    currentWidth: number,
    onResize: (width: number) => void
  ) {
    globalIsResizing.value = true
    globalResizeDirection.value = direction
    startX.value = event.clientX
    startWidth.value = currentWidth

    const handleMouseMove = (e: MouseEvent) => {
      if (!globalIsResizing.value) return

      const deltaX = e.clientX - startX.value
      let newWidth: number

      if (direction === 'left') {
        newWidth = startWidth.value + deltaX
      } else {
        newWidth = startWidth.value - deltaX
      }

      // 设置最小和最大宽度
      const minWidth = 200
      const maxWidth = window.innerWidth * 0.4 // 最大不超过屏幕宽度的40%
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))

      onResize(newWidth)
    }

    const handleMouseUp = () => {
      globalIsResizing.value = false
      globalResizeDirection.value = null
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    event.preventDefault()
  }

  return {
    isResizing: globalIsResizing,
    resizeDirection: globalResizeDirection,
    startResize
  }
}