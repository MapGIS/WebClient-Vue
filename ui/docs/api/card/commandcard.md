# Toolbar卡片

``` vue
<template>
<mapgis-ui-command-card bordered :tools="tools" title="标题">
    <div>
    卡片内容
    <mapgis-ui-statistic
        title="Feedback"
        :value="11.28"
        :precision="2"
        suffix="%"
        :value-style="{ color: '#3f8600' }"
        style="margin-right: 50px"
        >
        <template #prefix>
        </template>
        </mapgis-ui-statistic>
    </div>
</mapgis-ui-command-card>
</template>

<script>
export default {
    data() {
        return {
            tools: [
                { title: "工具栏1", icon: "mapgis-huizhi1", method: () => {} },
                { title: "工具栏2", icon: "mapgis-font-colors", method: () => {} },
                { title: "工具栏3", icon: "mapgis-translate", method: () => {} },
            ],
        };
    },
}
</script>
```