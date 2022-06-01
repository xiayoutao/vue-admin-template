# 配置表单组件
> 通过配置信息生成表单

## 组件参数
| 参数名 | 说明 | 类型 | 默认值 |
| :-----| :---- | :----: | :----: |
| value | 表单数据。最好使用v-model绑定 | Object | {} |
| fields | 表单字段配置信息 | Array | [] |
| rules | 表单校验规则。参考element table组件文档 | Object | {} |
| alone-rules | 是否单独传入规则，true则用传入的rules规则，false则使用fields里面配置的rules | Boolean | true |
| disabled | 是否禁用整个表单 | Boolean | false |
| disabled-fields | 表单字段配置信息 | Array | [] |

## 组件方法
| 名称 | 说明 | 返回值 |
| :-----| :---- | :---- |
| validate | 校验表单 | valid 校验成功状态 |
| resetFields | 重置表单校验 | - |

## 插槽
| 名称 | 说明 |
| footer | 表单底部插槽，一般放提交、取消等按钮 |

### fields 参数详情
> 其他没列出来的字段可以参考element form-item参数

| 字段 | 说明 | 类型 | 默认值 |
| :-----| :---- | :----: | :----: |
| type | 控件类型 | String | text |
| rules | 字段规则 | Array | - |
| disabled | 是否禁用 | Boolean | false |
| defaultValue | 默认值。不建议给object、array类型设置 | - | - |
| dataType | 数据源类型 | String | - |
| dataSource | 数据源 | String | - |
| dataLevel | dataType=region时有效。地区数据级别，2只显示省市，3显示省市区 | 3 |
| prop | 表单字段key值 | String | - |
| prop1 | 表单字段key值；用户日期范围有2个字段 | String | - |
| prop2 | 表单字段key值；用户日期范围有2个字段 | String | - |
| label | 表单标签文本 | String | - |
| label1 | 表单标签文本；用户日期范围有2个字段 | String | - |
| label2 | 表单标签文本；用户日期范围有2个字段 | String | - |
| span | 所占位置宽度，24占满整行；用户日期范围有2个字段 | Number | - |
| span1 | 所占位置宽度，24占满整行；用户日期范围有2个字段 | Number | - |
| span2 | 所占位置宽度，24占满整行；用户日期范围有2个字段 | Number | - |
| options | 数据选项 | String | - |
| events | 绑定事件 | Object | - |
| onChange | type=upload时，文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用 | Function(val) 或者 Function({file, fileList, option, refs}) | - |
| onPreview | type=upload，点击文件列表中已上传的文件时的钩子 | Function({file, option, refs}) | - |
| onSuccess | type=upload，文件上传成功时的钩子 | Function({response, file, fileList, option, refs}) | - |
| onProgress | type=upload，文件上传时的钩子 | Function({event, file, fileList, option, refs}) | - |
| onError | type=upload，文件上传失败时的钩子 | Function({file, option, refs}) | - |
| onExceed | type=upload，文件超出个数限制时的钩子 | Function({file, fileList, option, refs}) | - |
