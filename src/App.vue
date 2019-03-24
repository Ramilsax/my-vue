<template>
    <v-app id="app" v-scroll="onScroll">
        <!--Выдвижная панель-->
        <v-navigation-drawer app v-model="drawer">
            <v-list dense pt0>
                <v-list-tile exact
                             v-for="item in allLinks" :key="item.title" :to="item.url">
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                        <v-list-tile-title :class="{ 'subheading' : item.topLevel }">{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <!--Верхняя панель-->
        <v-toolbar color="primary" dark fixed app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer">

            </v-toolbar-side-icon>
            <v-toolbar-title>СУПП</v-toolbar-title>
            <v-spacer></v-spacer>
            <!--ссылки навигации-->
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn flat v-for="link in topLevelLinks" :key="link.title" :to="link.url" exact>
                    {{link.title}}
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <!--Содержимое страницы-->
        <v-content>
            <router-view></router-view>
        </v-content>
        <!--Нижняя панель-->
        <v-footer app>
            <v-spacer></v-spacer>
            <div>&copy; {{ new Date().getFullYear() }}</div>
        </v-footer>
        <!--Всплывающее c cообщение об ошибке-->
        <template v-if="error">
            <v-snackbar
                    :multi-line="true"
                    :top="true"
                    :vertical="false"
                    :timeout="5000"
                    @input="closeError"
                    :value="true"
                    color="error">
                {{error}}
                <v-btn flat dark @click.native="closeError">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-snackbar>
        </template>
        <!--Всплывающее c cообщение об успехе-->
        <template v-if="success">
            <v-snackbar
                    :multi-line="false"
                    :top="true"
                    :vertical="false"
                    :timeout="2000"
                    @input="closeSuccess"
                    :value="true"
                    color="success">
                {{success}}
                <v-btn flat dark @click.native="closeSuccess">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-snackbar>
        </template>
        <!--Кнопка для быстрого перемещения вверх-->
        <v-fab-transition>
            <v-btn fixed dark fab bottom right
                   color="primary" v-if="offsetTop > 140"
                   @click="onFloatButtonClick();"
                   title="Вверх">
                <v-icon>keyboard_arrow_up</v-icon>
            </v-btn>
        </v-fab-transition>
    </v-app>
</template>
<script>
    export default {
        name: 'app',
        components: {},
        data: () => ({
            drawer: false,   //отвечает за показ и скрытие боковой панели
            offsetTop: 0
        }),
        computed: {
            //Ссылки
            links() {
                return this.$store.getters.links;

            },
            links1() {
                return this.$store.getters.links;

            },
            links2() {
                return this.$store.getters.links;

            },
            count() {
                return this.$store.getters.getProfessionsCount.length;

            },

            allLinks(){
                return this.$store.getters.allLinks;
            },
            //Ссылки верхнего уровня
            topLevelLinks() {
                return this.$store.getters.topLevelLinks;
            },
            //Ошибка при выполнение какой-либо операции
            error() {
                return this.$store.getters.error;
            },
            //Успешное выполнение операции
            success() {
                return this.$store.getters.success;
            }
        },
        methods: {
            //Закрыть окно с ошибкой
            closeError() {
                this.$store.dispatch('clearError')
            },
            //Закрыть окно с успехом
            closeSuccess() {
                this.$store.dispatch('clearSuccess')
            },
            //Нажатие на кнопку быстрого перемещения вверх
            onFloatButtonClick() {
                this.$vuetify.goTo(0);
            },
            onScroll(e) {
                this.offsetTop = e.path[1].scrollY;
            }
        }
    }
</script>
