<template>
    <v-form v-model="valid" ref="form">
        <v-layout row justify-center>
            <v-dialog v-model="modal" persistent max-width="600px"
                      @keydown.esc="onClose" @keydown.enter="onSave">
                <v-spacer></v-spacer>
                <v-btn slot="activator" color="primary" dark>
                    <v-icon v-if="btnText === ''">add</v-icon> {{btnText}}
                </v-btn>
                <v-card v-if="modal">
                    <!--Заголовок-->
                    <v-card-title class="blue white--text headline">
                        {{title}}
                    </v-card-title>
                    <v-card-text>
                        <v-container row>
                            <v-flex xs12>
                                <!--Наименование-->
                                <v-text-field label="Наименование" type="text" required autofocus
                                              v-model.trim="item.name" :rules="nameRules">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <!--Примечание-->
                                <v-text-field label="Примечание" type="text"
                                              v-model.trim="item.notes" :rules="notesRules">
                                </v-text-field>
                            </v-flex>
                        </v-container>
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
    import {Profession} from "../../../store/professions";

    export default {
        data() {
            return {
                btnText: this.buttonText,        //текст кнопки
                valid: false,
                //Проверка заполнения поля наименование
                nameRules: [
                    v => !!v || 'Это поле является обязательным',
                    v => v.length < 255 || 'Длина должна быть меньше 255 символов',
                    v => !this.alreadyExists(v) || 'Запись уже существует'
                ],
                //Проверка заполнения поля примечание
                notesRules: [
                    v => v.length < 255 || 'Длина должна быть меньше 255 символов'
                ]
            }
        },
        methods: {
            //Нажатие на кнопку сохранить
            onSave() {
                if (this.valid) {
                    this.$store.dispatch('saveProfession', {payload: this.item, vueHttp: this.$http});
                    this.modal = false;
                    this.clearFields();
                }
            },
            //Нажатие на кнопку закрыть
            onClose() {
                this.item = new Profession();
                this.modal = false;
                this.$refs.form.resetValidation()
            },
            //Нажатие на кнопку удалить
            onDelete() {
                if (confirm('Удалить запись с именем ' + this.item.name + '?')) {
                    this.$store.dispatch('deleteProfession', {payload: this.item, vueHttp: this.$http});
                    this.modal = false;
                    this.clearFields();
                }
            },
            //Очистка полей и валидации
            clearFields() {
                this.item = new Profession();
                this.$refs.form.resetValidation();
            },
            //Проверка на существование элемента в списке
            alreadyExists(name) {
                return this.$store.getters.professions.filter(o => o.name === name && o.id !== this.item.id).length > 0;
            }
        },
        computed: {
            //Отвечает за открытие / закрытие окна
            modal: {
                get() {
                    return this.$store.getters.openProfessionEditDialog
                },
                set(value) {
                    this.$store.dispatch('openProfessionEditDialog', value);
                }
            },
            //Создаваемый / редактируемый элемент
            item: {
                get() {
                    return this.$store.getters.getProfession
                },
                set(value) {
                    this.$store.dispatch('setProfession', value)
                }
            },
            //Наименование окна
            title() {
                if (this.item.id === -1) {
                    return "Создание профессии"
                } else {
                    return "Редактирование профессии"
                }
            }
        },
        props: ['buttonText']
    }
</script>

<style scoped>

</style>
