# C++环境准备
82.44上复制环境 
> \\192.168.82.44\MapGIS 10 开发环境\WebClient\env
1. ![vs_buildtools__1466874956.1638177422.exe](./yarn/cpp.png)
2. 安装C++依赖![env](./yarn/cpp_build.png)
3. 设置npm C++编译器 
``` sh
# 管理员 cmd 或者 powershell
# yarn
yarn config set msvs_version 2017
# npm 
npm config set msvs_version 2017
```

## 安装windows-build-tool
[windows-build-tools](https://github.com/felixrieseberg/windows-build-tools)
::: tip
> 这一步花费时间极长，请耐心等待,大概下载2G的内容，这一步过了，后面就很容易走通
``` sh
yarn global add windows-build-tools
```
:::
