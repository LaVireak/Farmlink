import type { RouterConfig } from '@nuxt/schema'

// Custom router options to safely handle invalid URL hash fragments (e.g. Supabase OAuth error hashes like #error=server_error...)
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      try {
        if (typeof document !== 'undefined') {
          // Verify if it's a valid CSS selector and references an existing element
          const el = document.querySelector(to.hash)
          if (el) {
            return {
              el: to.hash,
              behavior: 'smooth',
            }
          }
        }
      } catch (e) {
        // If it's an invalid CSS selector (like Supabase OAuth error hashes), ignore it gracefully
        return { el: undefined }
      }
    }

    if (savedPosition) {
      return savedPosition
    }

    // Don't scroll to top if we are on the same page
    if (to.path === from.path) {
      return
    }

    return { top: 0 }
  }
}