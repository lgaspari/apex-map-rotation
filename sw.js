if(!self.define){let e,a={};const o=(o,i)=>(o=new URL(o+".js",i).href,a[o]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=o,e.onload=a,document.head.appendChild(e)}else e=o,importScripts(o),a()})).then((()=>{let e=a[o];if(!e)throw new Error(`Module ${o} didn’t register its module`);return e})));self.define=(i,r)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(a[n])return;let t={};const s=e=>o(e,n),c={module:{uri:n},exports:t,require:s};a[n]=Promise.all(i.map((e=>c[e]||s(e)))).then((e=>(r(...e),t)))}}define(["./workbox-7cfec069"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"/apex-map-rotation/apple-touch-icon-180x180.png",revision:"9b7a985648e65a01c130fa6e22b2459b"},{url:"/apex-map-rotation/assets/apex-predator-logo-lD1_FT7G.svg",revision:"f408341805f4df72bdf7340baf7443c0"},{url:"/apex-map-rotation/assets/index-BHsvEyWe.css",revision:"4fbfbe6dc7c446e8e06deb57719abe8c"},{url:"/apex-map-rotation/assets/index-BpnQYtjA.js",revision:"6a9eaa548706929a92d6df8b7d70bdae"},{url:"/apex-map-rotation/assets/workbox-window.prod.es5-DFjpnwFp.js",revision:"ed0c862094c41f455cdef837aa7dafd2"},{url:"/apex-map-rotation/favicon.ico",revision:"547587c645ecf0155439c8e0edb6cb3d"},{url:"/apex-map-rotation/index.html",revision:"7099e8e05d623c26208e1616261db837"},{url:"/apex-map-rotation/logo.svg",revision:"40dcf9f191738beb353d7a53edb8abd9"},{url:"/apex-map-rotation/maskable-icon-512x512.png",revision:"a51a4f0cc05f269554afef971b7f658d"},{url:"/apex-map-rotation/pwa-192x192.png",revision:"9397e91d5e3a42bfa03ce2d07f7e3171"},{url:"/apex-map-rotation/pwa-512x512.png",revision:"49e40aedc6b5cd06157f00d8c564e379"},{url:"/apex-map-rotation/pwa-64x64.png",revision:"160c4d06af493fa1cb62ae9f4258003b"},{url:"robots.txt",revision:"f77c87f977e0fcce05a6df46c885a129"},{url:"manifest.webmanifest",revision:"f9addcd4a864ed3a97c677e5274540c8"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));