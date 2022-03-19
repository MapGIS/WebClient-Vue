# 常见问题

## element-ui混用mapgis-ui

[参考](../../guide/borderBox.html)

## 低版本vue/vue-loader
[vue-loader过低](https://stackoverflow.com/questions/51501138/browserslisterror-unknown-browser-query-dead)
``` json
  "devDependencies": {
    "@vue/cli-service": "^3.3.0",
    "element-ui": "^2.15.6",
    "html-webpack-plugin": "^4.2.0",
    "less": "^3.9.0",
    "less-loader": "^4.1.0",
    "vue-template-compiler": "^2.6.10"
  },
   "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11"
  ]
}
```
解决方式
删除browserslist部分的规则
``` json
  "devDependencies": {
    "@vue/cli-service": "^3.3.0",
    "element-ui": "^2.15.6",
    "html-webpack-plugin": "^4.2.0",
    "less": "^3.9.0",
    "less-loader": "^4.1.0", // 升级到"less-loader": "7.0.2",
    "vue-template-compiler": "^2.6.10"
  },// 删除browserslist
}
```

## 兼容性
### less-7版本
``` json
{
    "css": {
        "loaderOptions": {
            "less": {
                "lessOptions": {
                    "modifyVars": {},
                    "javascriptEnabled": true
                }
            }
        }
    }
}
```