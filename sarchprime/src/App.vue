<template>
    <el-container>
        <!-- Navigator -->
        <el-aside>
            <Navigator />
        </el-aside>

        <el-container>
            <el-main>Main</el-main>
        </el-container>
  </el-container>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Navigator from './components/Navigator.vue';

@Options({
    components: { Navigator }
})

export default class App extends Vue {}
</script>

<style>
/* Global style */
#app,.el-aside {
    min-height: 100vh;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.el-aside {
    width: 200px;
}

.el-menu {
    min-height: 100vh;
}
</style>
