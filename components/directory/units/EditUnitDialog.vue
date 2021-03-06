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
                                <!--Полное название-->
                                <v-text-field label="Полное название" type="text" required autofocus
                                              v-model.trim="item.fullName" :rules="nameRules">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <!--Примечание-->
                                <v-text-field label="Примечание" type="text" 
                                              v-model.trim="item.notes" :rules="nameRul">
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
    import {Unit} from '../../../store/units'


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
                nameRul: [
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
                    this.$store.dispatch('saveUnit', {payload: this.item, vueHttp: this.$http});
                    this.modal = false;
                    this.clearFields();
                }
            },
            //Нажатие на кнопку закрыть
            onClose() {
                this.item = new Unit();
                this.modal = false;
                this.$refs.form.resetValidation()
            },
            //Нажатие на кнопку удалить
            onDelete() {
                if (confirm('Удалить запись с именем ' + this.item.name + '?')) {
                    this.$store.dispatch('deleteUnit', {payload: this.item, vueHttp: this.$http});
                    this.modal = false;
                    this.clearFields();
                }
            },
            //Очистка полей и валидации
            clearFields() {
                this.item = new Unit();
                this.$refs.form.resetValidation();
            },
            //Проверка на существование элемента в списке
            alreadyExists(name) {
                return this.$store.getters.units.filter(o => o.name === name && o.id !== this.item.id).length > 0;
            }
        },
        computed: {
            //Отвечает за открытие / закрытие окна
            modal: {
                get() {
                    return this.$store.getters.openUnitEditDialog
                },
                set(value) {
                    this.$store.dispatch('openUnitEditDialog', value);
                }
            },
            //Создаваемый / редактируемый элемент
            item: {
                get() {
                    return this.$store.getters.getUnit
                },
                set(value) {
                    this.$store.dispatch('setUnit', value)
                }
            },
            //Наименование окна
            title() {
                if (this.item.id === -1) {
                    return "Создание едениц измерения"
                } else {
                    return "Редактирование едениц измерения"
                }
            }
        },
        props: ['buttonText']
    }
</script>

<style scoped>

</style>