<template>
    <v-container fluid>
        <v-layout row>
            <v-flex xs12>
                <h1>Профессии</h1>
            </v-flex>
        </v-layout>
        <v-layout row wrap pt-2>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <v-layout align-center justify-space-between row fill-height>
                            <v-flex xs6>
                                <edit-profession-dialog class="left" button-text="Добавить"></edit-profession-dialog>
                            </v-flex>
                            <v-flex xs3>
                                <v-text-field
                                        v-model="search"
                                        append-icon="search"
                                        label="Поиск"
                                        single-line
                                        hide-details>
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-card-title>
                    <v-card-text>
                        <v-data-table :headers="headers" :items="items" class="elevation-1"
                                      :search="search" :loading="loading"
                                      :rows-per-page-items='rowsPerPageItems'
                                      :pagination.sync="pagination">
                            <template slot="items" slot-scope="props">
                                <tr @click="onRowClick(props.item)" style="cursor: pointer">
                                    <td class="text-xs-left">{{ props.item.name }}</td>
                                    <td class="text-xs-left">{{ props.item.notes }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import EditProfessionDialog from './EditProfessionDialog'
    import {Profession} from "../../../store/professions";

    export default {
        name: "Profession",
        data() {
            return {
                //Заголовки таблицы
                headers: [
                    {
                        text: 'Наименование', align: 'left', sortable: true, value: 'name'
                    },
                    {
                        text: 'Примечание', align: 'left', sortable: true, value: 'notes'
                    }
                ],
                //Для поиска по таблице
                search: '',
                rowsPerPageItems: [10, 20, 30, 40, 50, {"text": "$vuetify.dataIterator.rowsPerPageAll", "value": -1}]
            }
        },
        components: {
            editProfessionDialog: EditProfessionDialog
        },
        computed: {
            //Элементы для отображения
            items() {
                return this.$store.getters.professions
            },
            //Флаг загрузки данных
            loading() {
                return this.$store.getters.loading
            },
            //Разбиение на страницы
            pagination: {
                get() {
                    return this.$store.getters.getPagination
                },
                set(value) {
                    this.$store.dispatch('setPagination', value)
                }
            }
        },
        methods: {
            //Клик мышкой по строке таблицы
            onRowClick(item) {
                this.$store.commit('setProfession', new Profession(item.id, item.name, item.notes, item.department, item.profession));
                this.$store.commit('openProfessionEditDialog', true)
            }
        },
        //Вызывется, когда страница отображается
        mounted() {
            //Загружаем профессии из БД
            this.$store.dispatch('loadProfessions', this.$http);
            
        }
    }
</script>

<style scoped>

</style>
