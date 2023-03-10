import path from "path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import AutoImport from "unplugin-auto-import/vite";
import AutoImportComponent from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

function resolvePath(pathname: string): string {
  return path.resolve(process.cwd(), pathname);
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isProduction = mode === "production";
  return {
    base: "./",
    resolve: {
      alias: {
        "@": resolvePath("src")
      }
    },
    server: {
      open: true,
      host: "0.0.0.0",
      proxy: isProduction ? undefined : {
        [env.VITE_BASE_URL || "/dev"]: {
          ws: true,
          changeOrigin: true,
          target: env.VITE_PROXY_TARGET,
          rewrite: path => path.replace(env.VITE_BASE_URL, "")
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: "js/[name].[hash].bundle.js",
          chunkFileNames: ({ moduleIds }) => {
            const chunkFileName = moduleIds[moduleIds.length - 1];
            if(!chunkFileName.includes("/node_modules/") && /(index)\.[^.]+$/i.test(chunkFileName)) {
              const chhunkFilePaths = chunkFileName.split("/");
              let name = chhunkFilePaths[chhunkFilePaths.length - 2];
              name = name[0].toLowerCase() + name.substring(1).replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
              return `js/${name}.[hash].chunk.js`;
            } else {
              return "js/[name].[hash].chunk.js";
            }
          },
          assetFileNames({ name }) {
            if(/\.(jpe?g|png|gif|webp)$/i.test(name)) {
              return "images/[name].[hash].[ext]";
            }
            if(/\.svg$/i.test(name)) {
              return "svg/[name].[hash].[ext]";
            }
            if(/\.(woff|woff2|eot|ttf|otf)$/i.test(name)) {
              return "fonts/[name].[hash].[ext]";
            }
            if(/\.css$/i.test(name)) {
              return "css/[name].[hash].[ext]";
            }
            return "assets/[name].[hash].[ext]";
          },
          manualChunks: (filePath) => {
            if(/[\\/]element-plus[\\/]/i.test(filePath)) {
              return "element-plus";
            }
            if(/[\\/]@?vue[\\/]/i.test(filePath)) {
              return "vue";
            }
            if(/[\\/]vue-router[\\/]/i.test(filePath)) {
              return "vue-router";
            }
            if(/[\\/]pinia[\\/]/i.test(filePath)) {
              return "pinia";
            }
            /* ?????????????????? */
            if(/[\\/]node_modules[\\/]/i.test(filePath)) {
              return "vendor";
            }
          }
        }
      }
    },
    plugins: [
      vue(),
      VueSetupExtend(),
      AutoImport({
        resolvers: [ ElementPlusResolver() ],
        imports: [ "vue", "vue-router" ],
        dts: "types/auto-import.d.ts"
      }),
      AutoImportComponent({
        extensions: [ "vue" ],
        dirs: [ "src/components" ],
        dts: "types/components.d.ts",
        resolvers: [ ElementPlusResolver() ]
      })
    ]
  }
})
