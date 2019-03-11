<template>
    <v-form v-model="valid" ref="form">
        <v-layout row justify-center>
            <v-dialog v-model="modal" persistent max-width="600px"
                      @keydown.esc="onClose" @keydown.enter="onSave">
                <v-spacer></v-spacer>
                <v-btn slot="activator" color="primary" dark>Добавить</v-btn>
                <v-card v-if="modal">
                    <!--Заголовок-->
                    <v-card-title class="blue white--text headline">
                        {{title}}
                    </v-card-title>
                    <v-card-text>
                        <!--ФИО-->
                        <v-layout row>
                            <v-flex xs12>

                                <v-text-field label="Наименование" type="text" required autofocus
                                              v-model.trim="item.name" :rules="nameRules">
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                        <!--Профессия-->
                        <v-layout row>
                            <v-flex xs12>
                                <v-autocomplete
                                        :items="professions"
                                        item-text="name"
                                        item-value="id"
                                        v-model="item.profession"
                                        return-object
                                        label="Профессия или должность"
                                        append-outer-icon="add"
                                        @click:append-outer="openProfessionEditDialog = true">
                                </v-autocomplete>
                                <edit-profession-dialog button-text="" v-if="openProfessionEditDialog"></edit-profession-dialog>
                            </v-flex>
                        </v-layout>
                        <!--Отдел или подразделение-->
                        <v-layout row>
                            <v-flex xs12>
                                <v-select
                                        :items="departments"
                                        item-text="name"
                                        item-value="id"
                                        v-model="item.department"
                                        return-object
                                        label="Отдел или подразделение"
                                        append-outer-icon="add"
                                        @click:append-outer="openDepartmentEditDialog = true">
                                </v-select>
                                <edit-department-dialog button-text="" v-if="openDepartmentEditDialog"></edit-department-dialog>
                            </v-flex>
                        </v-layout>
                        <!--Примечание-->
                        <v-layout>
                            <v-flex xs12>
                                <v-text-field label="Примечание" type="text"
                                              v-model.trim="item.notes" :rules="notesRules">
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                    <!--Кнопки-->
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" light @click="onSave" :disabled="!valid">Сохранить</v-btn>
                        <v-btn color="warning" flat v-if="item.id !== -1" @click="onDelete">Удалить</v-btn>
                        <v-btn color="blue darken-1" flat @click="onClose">Закрыть</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-form>
</template>

<script>

    import {Person} from '../../../store/personal'
    import EditProfessionDialog from '../../directory/professions/EditProfessionDialog'
    import EditDepartmentDialog from '../../directory/departments/EditDepartmentDialog'


    export default {
        data() {
            return {
                valid: false,
                //Проверка заполнения поля наименование
                nameRules: [
                    v => !!v || 'Это поле является обязательным',
                    v => v.length < 255 || 'Длина должна быть меньше 255 символов'
                ],
                //Проверка заполнения поля примечание
                notesRules: [
                    v => (v == null || v.length < 255) || 'Длина должна быть меньше 255 символов'
                ]
            }
        },
        components: {
            editProfessionDialog: EditProfessionDialog,
            editDepartmentDialog: EditDepartmentDialog
        },
        methods: {
            //Нажатие на кнопку Сохранить
            onSave() {
                if (this.valid) {
                    this.$store.dispatch('savePerson', {payload: this.item, vueHttp: this.$http});
                    this.modal = false;
                    this.clearFields();
                }
            },
            //Нажатие на кнопку Закрыть
            onClose() {
                this.item = new Person();
                this.modal = false;
                this.$refs.form.resetValidation();
            },
            //Нажатие на кнопку Удалить
            onDelete() {
                if (confirm('Удалить сотрудника с именем ' + this.item.name + '?')) {
                    this.$store.dispatch('deletePerson', {payload: this.item, vueHttp: this.$http});
                    this.modal = false;
                    this.clearFields();
                }
            },
            //Очистка полей и валидации
            clearFields() {
                this.item = new Person();
                this.$refs.form.resetValidation();
            },
            //Сортировка строк
            sort(a, b) {
                var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            }
        },
        computed: {
            //Отвечает за открытие / закрытие окна
            modal: {
                get() {
                    return this.$store.getters.openPersonalEditDialog;
                },
                set(value) {
                    this.$store.dispatch('openPersonalEditDialog', value);
                }
            },
            //Создаваемый / редактируемый элемент
            item: {
                get() {
                    return this.$store.getters.getPerson;
                },
                set(value) {
                    this.$store.dispatch('setPerson', value)
                }
            },
            openProfessionEditDialog:{
                get() {
                    return this.$store.getters.openProfessionEditDialog;
                },
                set(value) {
                    this.$store.dispatch('openProfessionEditDialog', value)
                }
            },
            openDepartmentEditDialog:{
                get() {
                    return this.$store.getters.openDepartmentEditDialog;
                },
                set(value) {
                    this.$store.dispatch('openDepartmentEditDialog', value)
                }
            },
            //Наименование окна
            title() {
                if (this.item.id === -1) {
                    return "Создание записи о сотруднике"
                } else {
                    return "Редактирование записи о сотруднике"
                }
            },
            //Все отделы
            departments() {
                let departments = this.$store.getters.departments;
                if (departments.length === 0) {
                    //Загружаем отделы из БД
                    this.$store.dispatch('loadDepartments', this.$http);
                }

                departments.sort((a,b)=>this.sort(a,b));

                return departments;
            },
            //Все профессии
            professions() {
                let professions = this.$store.getters.professions;
                if (professions.length === 0) {
                    //Загружаем отделы из БД
                    this.$store.dispatch('loadProfessions', this.$http);
                }

                professions.sort((a,b)=>this.sort(a,b));

                return professions;
            }
        }
    }
</script>

<style scoped>

</style>
