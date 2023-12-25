<!-- file ref: https://github.com/Stuyk/altv-athena/blob/master/src-webviews/src/App.vue -->
<template>
    asdasdasdasdasdasd
    <component v-for="(page, index) in pages" :key="index" :is="page.component" :id="'page-' + page.name" />
    <component v-for="(page, index) in overlays" :key="index" :is="page.component" :id="'page-' + page.name" />
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { VUE_IMPORTS } from "./imports/imports"
import { CORE_PAGES } from "./pages/components"
import { IPageData } from "./interfaces/IPageData"
import { INTERFACE_EVENTS } from "@Utils/shared/enums/InterfaceEvents"

const ALL_COMPONENTS = {
    ...CORE_PAGES,
    ...VUE_IMPORTS,
}

function componentsToArray() {
    let componentList = [];
    Object.keys(ALL_COMPONENTS).forEach((key) => {
        componentList.push({ name: key, component: ALL_COMPONENTS[key] })
    })
    return componentList
}

export default defineComponent({
    name: "App",
    components: {
        ...ALL_COMPONENTS,
    },
    data() {
        return {
            isPagesUpdating: false,
            pages: [] as Array<IPageData>,
            overlays: [] as Array<IPageData>,
            pageBindings: componentsToArray(),
            devMode: false,
        }
    },
    computed: {
        getAllPageNames() {
            return Object.keys(ALL_COMPONENTS)
        }
    },
    methods: {
        isPageUpdateReady(): Promise<void> {
            return new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    if (this.isPagesUpdating) return;

                    clearInterval(interval)
                    resolve()
                }, 100)
            })
        },
        setDevMode(value: boolean) {
            this.devMode = value
        },
        isDevMode() {
            return !(window as any).invokeNative
        },
        async handleSetPages(pages: Array<{ name: string }>, type: "pages" | "overlays") {
            if (!pages || !Array.isArray(pages)) {
                console.error("Pages array is empty");
                return
            }

            if (this.isPagesUpdating) {
                await this.isPageUpdateReady();
            }

            const foundPages = this.pageBindings.filter((page) => pages.find((type) => type.name === page.name))

            this[type] = foundPages;
            console.log(`[Vue] ${type} -> ${JSON.stringify(foundPages.map((x) => x.name))}`)
        },
        devUpdatePages(pageName: string, isAddingPage: boolean) {
            const currentPages = this["pages"];

            if (isAddingPage) {
                const newPages = currentPages.concat([{ name: pageName }]);
                this.handleSetPages(newPages, 'pages');
                localStorage.setItem("pages", JSON.stringify(newPages));
                return;
            }

            const index = currentPages.findIndex((x) => x.name === pageName);
            if (index === -1) return;

            currentPages.splice(index, 1);
            this.handleSetPages(currentPages, 'pages');
            localStorage.setItem("pages", JSON.stringify(currentPages));
        },

    },
    mounted() {
        if (this.isDevMode()) {
            setInterval(() => {

            })
        }
    }
})
</script>

<style></style>