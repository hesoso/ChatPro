### 场景问题解决方案

1. 对于某些依赖（如electron）安装安装问题，通常通过配置镜像源来解决。
```shell
pnpm config set registry https://registry.npmmirror.com
# 指定 electron 的镜像
pnpm config set electron_mirror https://npmmirror.com/mirrors/electron/
# 指定 sqlite3 的预编译镜像
pnpm config set sqlite3_binary_host_mirror https://npmmirror.com/mirrors/sqlite3
# 也可以单独为某个镜像设置源
pnpm add better-sqlite3 --registry=https://registry.npmmirror.com
# 有时候碰到的依赖包问题可以尝试使用以下命令清理依赖后重新安装
pnpm store prune
```

2. windows下安装sqlite3报错。
> 🌟🌟🌟 需要安装Visual Studio 2022 的C++工具集，然后重新安装


3. 模块与当前 Node.js 或 Electron 运行环境的 ABI 版本不兼容。
```shell
# 比如出现类似以下报错
(node:78954) UnhandledPromiseRejectionWarning: Error: The module '/Users/hejianhong/Desktop/ChatPro/node_modules/.pnpm/better-sqlite3@11.10.0/node_modules/better-sqlite3/build/Release/better_sqlite3.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 115. This version of Node.js requires
NODE_MODULE_VERSION 123. Please try re-compiling or re-installing
# NODE_MODULE_VERSION 是 Node.js 的 ABI 版本标识符，不同 Node.js 或 Electron 版本会使用不同的值。
# 这种情况常见于：在 Electron 项目中直接使用 npm install 安装原生模块（如 better-sqlite3），但未针对 Electron 重新编译。
# 🌟🌟🌟解决方案：安装 electron-rebuild 为 Electron 重新编译模块
pnpm add -D electron-rebuild
./node_modules/.bin/electron-rebuild
```