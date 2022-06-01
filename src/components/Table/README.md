# 表格组件
```
虚拟表格
<virtual-table></virtual-table>
饿了么表格
<element-table></element-table>
简单表格：没有排序
<simple-table></simple-table>
```

## 组件参数
> 以下为自定义的参数，其他参数，虚拟表格参考umy-ui的ux-grid组件，饿了么表格参考element-ui的table组件  

| 参数名 | 说明 | 类型 | 默认值 |
| :-----| :---- | :----: | :----: |
| tid | 表格ID，用来区分缓存数据 | String | - |
| version | 表格版本，用来区分缓存数据。上线后如果表格有新增、删除列以及排序改动都要修改这个版本号 | String | - |
| data | 非虚拟表格数据 | Array | [] |
| datas | 虚拟表格数据 | Array | [] |
| columns | 表格列配置 | Array | [] |
| calc-height | 是否计算表格高度 | Boolean | false |
| show-table-config | 是否显示表格配置按钮 | Boolean | false |
| single-sort | 同时只能一个字段排序。暂时有问题，没有完全实现 | Boolean | true |

## 组件事件
> 同样参考相应组件的事件

| 名称 | 说明 | 返回值 |
| :-----| :---- | :---- |
| on-params | 表格过滤参数改变 | - |
| on-sort | 表格排序参数改变 | - |

## 组件方法
| 名称 | 说明 | 返回值 |
| :-----| :---- | :---- |
| reloadData | 虚拟表格加载数据 | - |
| getSelection | 获取选中的数据 | - |
| doLayout | 重新渲染表格 | - |
| callTableFn | 调用内部表格组件的方法，如要调用doLayout方法 可以使用this.$refs.table.callTableFn('doLayout') | - |

## 插槽
| 名称 | 说明 |
| search | 过滤条件插槽 |
| toolbar | 工具栏插槽 |
| pagination | 分页器插槽 |

### columns参数详情
| key值 | 说明 | 类型 | 默认值 |
| :-----| :---- | :---- | :----: |
| type | selection为多选框列 | String | - |
| label | 显示的标题 | - | String |
| prop | 列内容的字段名 | String | - |
| width | 列的宽度 | - | String |
| align | 对齐方式 | String | center |
| tooltip | 当内容过长被隐藏时显示 tooltip | Boolean | true |
| showType | 显示类型，默认text。text文本、number数字(如果没有设置align，则默认右对齐)、colorNumber显示颜色的数字，负数显示红色（如需自定义颜色，可用showColor配置）、amount显示金额，默认保留3位小数（可通过showDigit更改）。select为多种值匹配，radio为2种值匹配，一般为是/否 | String | text |
| showDigit | 保留几位小数，值为大于等于0的整数。showType为number或colorNumber可用 | Number | - |
| showColor | 显示颜色。showType=colorNumber可用 | String | - |
| renderKeys | 自定义渲染的字段，需要注意顺序问题。如果显示的字段是由a和b两个字段合并，则可以设置renderKeys="['a', 'b']" | Array | [] |
| renderFormat | 格式化数据。传对象数组（对象包含name和value）| Array | - |
| render | 自定义列显示 | Function(h, row) | - |
| formatter | 格式化内容 | Function(row, column, cellValue, index) | - |


## 参考示例
```
<template>
  <virtual-table
    :datas="dataList"
    :columns="tableColumns"
    :calc-height="true"
    @on-param="handleParamChange"
    @on-sort="handleSortChange"
  >
    <template #search>
      <x-filters :config="tableSearch"></x-filters>
    </template>
    <template #toolbar>
      <el-button type="primary" icon="el-icon-plus">新增</el-button>
      <el-button icon="el-icon-plus" disabled>禁用</el-button>
      <el-button icon="el-icon-plus">禁用</el-button>
    </template>
    <template #pagination>
      <x-pagination
        :config="{ total: dataList.length }"
        @on-page="handlePageChange"
      ></x-pagination>
    </template>
  </virtual-table>
</template>


<script>
export default {
  name: 'virtualTablePage',
  data() {
    return {
      tableSearch: [],
      tableColumns: [],
      dataList: [],
      dataForm: {},
    }
  }
}
</script>
```