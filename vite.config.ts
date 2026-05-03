import { defineConfig } from 'vite'
import type { Connect, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const choiSpa = (): PluginOption => {
  const rewrite: Connect.NextHandleFunction = (req, _res, next) => {
    const url = req.url ?? ''
    if (url === '/choi' || url === '/choi/') {
      req.url = '/choi/index.html'
    } else if (url.startsWith('/choi/') && !/\.[a-zA-Z0-9]+(\?.*)?$/.test(url)) {
      req.url = '/choi/index.html'
    }
    next()
  }
  return {
    name: 'choi-static-spa',
    configureServer(server) {
      server.middlewares.use(rewrite)
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite)
    },
  }
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    choiSpa(),
  ],
  server: {
    port: 5555
  }
})
