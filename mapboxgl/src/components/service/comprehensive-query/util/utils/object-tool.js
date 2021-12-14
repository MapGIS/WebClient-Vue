export class ObjectTool {
    static deepClone(target) {
        // 定义一个变量
        let result;
        // 如果当前需要深拷贝的是一个对象的话
        if (typeof target === 'object') {
            // 如果是一个数组的话
            if (Array.isArray(target)) {
                // 将result赋值为一个数组，并且执行遍历
                result = [];
                target.forEach(element => {
                    // 递归克隆数组中的每一项
                    result.push(this.deepClone(element));
                });
                // 判断如果当前的值是null的话；直接赋值为null
            }
            else if (target === null) {
                result = null;
                // 判断如果当前的值是一个RegExp对象的话，直接赋值
            }
            else if (target.constructor === RegExp) {
                result = target;
            }
            else if (typeof target.clone === 'function') {
                // 如果该对象有克隆方法，则直接调用该类克隆方法
                result = target.clone();
            }
            else {
                // 否则是普通对象，直接for in循环，递归赋值对象的所有值
                result = {};
                Object.entries(target).forEach(element => {
                    const key = element[0];
                    const valueIndex = 1;
                    result[key] = this.deepClone(element[valueIndex]);
                });
            }
            // 如果不是对象的话，就是基本数据类型，那么直接赋值
        }
        else {
            result = target;
        }
        // 返回最终结果
        return result;
    }
}
