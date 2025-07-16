import { defineStore } from 'pinia'
import { ref, computed, onMounted, onUnmounted } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const leftSidebarCollapsed = ref(false)
  const rightSidebarCollapsed = ref(false)
  const leftSidebarWidth = ref(1000)
  const rightSidebarWidth = ref(420)
  const screenWidth = ref(window.innerWidth)
  const isMobile = computed(() => screenWidth.value < 768)
  const isTablet = computed(() => screenWidth.value >= 768 && screenWidth.value < 1024)
  const isDesktop = computed(() => screenWidth.value >= 1024)

  // 响应式侧边栏宽度
  const responsiveLeftWidth = computed(() => {
    if (isMobile.value) return Math.min(320, screenWidth.value * 0.8)
    if (isTablet.value) return 340
    return leftSidebarWidth.value
  })

  const responsiveRightWidth = computed(() => {
    if (isMobile.value) return Math.min(360, screenWidth.value * 0.8)
    if (isTablet.value) return 380
    return rightSidebarWidth.value
  })

  // 自动响应屏幕尺寸
  function handleResize() {
    screenWidth.value = window.innerWidth
    
    // 小屏幕自动折叠侧边栏
    if (isMobile.value) {
      leftSidebarCollapsed.value = true
      rightSidebarCollapsed.value = true
    }
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
    handleResize() // 初始化
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  function toggleLeftSidebar() {
    leftSidebarCollapsed.value = !leftSidebarCollapsed.value
  }

  function toggleRightSidebar() {
    rightSidebarCollapsed.value = !rightSidebarCollapsed.value
  }

  function setLeftSidebarCollapsed(collapsed: boolean) {
    leftSidebarCollapsed.value = collapsed
  }

  function setRightSidebarCollapsed(collapsed: boolean) {
    rightSidebarCollapsed.value = collapsed
  }

  function setLeftSidebarWidth(width: number) {
    leftSidebarWidth.value = width
  }

  function setRightSidebarWidth(width: number) {
    rightSidebarWidth.value = width
  }

  return {
    leftSidebarCollapsed,
    rightSidebarCollapsed,
    leftSidebarWidth,
    rightSidebarWidth,
    responsiveLeftWidth,
    responsiveRightWidth,
    screenWidth,
    isMobile,
    isTablet,
    isDesktop,
    toggleLeftSidebar,
    toggleRightSidebar,
    setLeftSidebarCollapsed,
    setRightSidebarCollapsed,
    setLeftSidebarWidth,
    setRightSidebarWidth
  }
})