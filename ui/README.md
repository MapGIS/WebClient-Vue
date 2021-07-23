# Webclient-Vue-Ui

敬请期待...


## FormModel使用注意事项：

当涉及<u>^$refs</u>时，后面应添加<u>$children[0]</u>项。  
### 示例：
> $refs.name.onFieldBlur()  
> this.$refs.ruleForm.validate()   
> this.$refs.ruleForm.resetFields()  

### 应分别改为：

> $refs.name.$children[0].onFieldBlur()  
> this.$refs.ruleForm.$children[0].validate()   
> this.$refs.ruleForm.$children[0].resetFields()  