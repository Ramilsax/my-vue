<template>
    <v-container fluid>
        <v-layout row>
            <v-flex xs12>
                <h1>Отделы и подразделения</h1>
            </v-flex>
        </v-layout>
        <v-layout row wrap pt-2>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <v-layout align-center justify-space-between row fill-height>
                            <v-flex xs9>
                                <edit-department-dialog class="left" button-text="Добавить"></edit-department-dialog>
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
                                    <td class="text-xs-left">{{ props.item.parentDepartment != null ? getParentDepartments(props.item) : ''}}</td>
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
    import EditDepartmentDialog from './EditDepartmentDialog'
    import {Department} from "../../../store/departments";

    export default {
        name: "Department",
        data() {
            return {
                //Заголовки таблицы
                headers: [
                    {
                        text: 'Принадлежит', align: 'left', sortable: true, value: 'parentDepartment'
                    },
                    {
                        text: 'Наименование', align: 'left', sortable: true, value: 'name'
                    },
                    {
                        text: 'Примечание', align: 'left', sortable: true, value: 'notes'
                    }
                ],
                //Для поиска по таблице
                search: '',
                rowsPerPageItems: [10, 20, 30, 40, 50, {"text": "$vuetify.dataIterator.rowsPerPageAll", "value": -1}],
            }
        },
        components: {
            editDepartmentDialog: EditDepartmentDialog
        },
        computed: {
            //Элементы для отображения
            items() {
                return this.$store.getters.departments;
            },
            //Флаг загрузки данных
            loading() {
                return this.$store.getters.loading
            },
            //Разбиение на страницы
            pagination: {
                get() {
                    return this.$store.getters.getDepartmentPagination;
                },
                set(value) {
                    this.$store.dispatch('setDepartmentPagination', value)
                }
            }
        },
        methods: {
            //Клик мышкой по строке таблицы
            onRowClick(item) {
                this.$store.commit('setDepartment', new Department(item.id, item.name, item.notes, item.parentDepartment));
                this.$store.commit('openDepartmentEditDialog', true)
            },
            getParentDepartments(item){
                var retVal = (item.parentDepartment != null ? (item.parentDepartment.name) : '');
                return retVal;
            }
        },
        //Вызывется, когда страница отображается
        mounted() {
            //Загружаем отделы из БД
            this.$store.dispatch('loadDepartments', this.$http);
        }
    }
</script>

<style scoped>

</style>
