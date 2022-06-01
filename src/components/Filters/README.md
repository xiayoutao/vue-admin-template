# 搜索条件参数
> 通过配置信息生成表单

## 参数
| 参数名 | 说明 | 类型 | 默认值 |
| :-----| :---- | :----: | :----: |
| config | 配置信息 | Array | [] |

### config 参数详情
| 字段 | 说明 | 类型 | 默认值 |
| :-----| :---- | :----: | :----: |
| type | 控件类型 | String | - |
| prepend | type=input或daterange prepend插槽显示类型 | String | - |
| selectValue | type=input或daterange，并且prepend=select时，下拉框默认值 | String | - |
| key | key值。type=input或daterange，并且prepend=select时 可以不设置 | String | - |
| key1 | key值；用户日期范围有2个字段。type=input或daterange，并且prepend=select时 可以不设置 | String | - |
| key2 | key值；用户日期范围有2个字段。type=input或daterange，并且prepend=select时 可以不设置 | String | - |
| label | 表单标签文本 | String | - |
| width | 宽度 | String | - |
| format | 日期值的格式 | String | yyyy-MM-dd |
| options | 下拉框选项 | Array | [] |