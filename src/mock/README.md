# Mock 使用介绍
[文档](https://github.com/nuysoft/Mock/wiki/Getting-Started)


> 数据模板中的每个属性由 3 部分构成：属性名、生成规则、属性值： 

```
// 属性名   name
// 生成规则 rule
// 属性值   value
'name|rule': value
```

> 生成规则 有 7 种格式：  

```
'name|min-max': value
'name|count': value
'name|min-max.dmin-dmax': value
'name|min-max.dcount': value
'name|count.dmin-dmax': value
'name|count.dcount': value
'name|+step': value
```

> 属性值 中可以含有 @占位符 