export const useDarkMode = () => {
  const colorMode = useColorMode()

  const isDark = computed(() => colorMode.preference === 'dark')

  function toggle() {
    colorMode.preference = isDark.value ? 'light' : 'dark'
  }

  return { isDark, toggle }
}