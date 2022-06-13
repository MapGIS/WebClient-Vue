let symbolsConfig = {
    "rootPath": "/plot",
    //符号配置
    "symbols": [
        {
            //文件夹相对路径，有个根目录upload
            "path": "/regular",
            //文件夹名称
            "name": "regular",
            //文件夹id
            "id": 3,
            //类型为文件
            "type": "folder",
            //文件里的图片或文件或其他
            "items": [
                {
                    //文件夹相对路径，有个根目录upload
                    "path": "/point",
                    //文件夹名称
                    "name": "point",
                    //文件夹id
                    "id": 2,
                    //类型为文件
                    "type": "folder",
                    "items": []
                },
                {
                    //文件夹相对路径，有个根目录upload
                    "path": "/line",
                    //文件夹名称
                    "name": "line",
                    //文件夹id
                    "id": 2,
                    //类型为文件
                    "type": "folder",
                    "items": []
                },
                {
                    //文件夹相对路径，有个根目录upload
                    "path": "/area",
                    //文件夹名称
                    "name": "area",
                    //文件夹id
                    "id": 2,
                    //类型为文件
                    "type": "folder",
                    "items": []
                }
            ]
        },
        {
            //文件夹相对路径，有个根目录upload
            "path": "/irregular",
            //文件夹名称
            "name": "irregular",
            //文件夹id
            "id": 3,
            //类型为文件
            "type": "folder",
            //文件里的图片或文件或其他
            "items": []
        }
    ]
}

export default symbolsConfig;
