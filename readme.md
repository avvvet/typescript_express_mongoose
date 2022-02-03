#typescript express scaffolding

#npm run serve
"serve" uses our cross-env package to set the NODE_ENV to development,
so we know we’re in dev mode. We can then access process.env.NODE_ENV anywhere inside our .ts files should we need to.
Then, using concurrently we’re running tsc --watch (TypeScript Compiler in “watch mode”) which will rebuild whenever we change a file.
When that happens, our TypeScript code is outputted in out dist directory (remember we specified this in our tsconfig.json).
Once that’s recompiled, nodemon will see the changes and reload dist/index.js, our entry-point to the app.
This gives us full live recompilation upon every change to a .ts file.