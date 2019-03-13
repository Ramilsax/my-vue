/*Сотрудники*/
export class Person {
    constructor(id, name, notes, department, profession) {
        this.id = id !== undefined ? id : -1;
        this.name = name !== undefined ? name : '';
        this.notes = notes !== undefined ? notes : '';
        this.department = department !== undefined ? department : null;
        this.profession = profession !== undefined ? profession : null;
    }
}

export default {
    state: {
        personal: [],                       //персонал
        openPersonalEditDialog: false,      //флаг открытия диалога редактирования сотрудника
        person: new Person(),               //объект для создания / редактирования сотрудника
        pagination: {                       //настройка разбиения на страницы
            rowsPerPage: 20                 //Количество строк на странице
        }
    },
    mutations: {
        //Загружает всех сотрудников
        loadPersonal(state, payload) {
            state.personal = payload;
        },
        //Добавляет нового сотрудника в список
        createPerson(state, payload) {
            state.personal.push(payload);
        },
        //Изменяет существующего сотрудника в списке
        updatePerson(state, payload) {
            let item = this.getters.personal.find(p => {
                return p.id === payload.id;
            });

            item.name = payload.name;
            item.notes = payload.notes;
            item.department = payload.department;
            item.profession = payload.profession;
        },
        //Удаляет сотрудника из списка
        deletePerson(state, payload) {
            state.personal.splice(state.personal.indexOf(payload), 1);
        },
        //Открывает или закрывает диалог редактирования сотрудника
        openPersonalEditDialog(state, payload) {
            state.openPersonalEditDialog = payload;
        },
        //Устанавливает сотрудника для редактирования
        setPerson(state, payload) {
            state.person = payload;
        },
        //Разбиение на страницы
        setPersonalPagination(state, payload) {
            state.pagination = payload
        }
    },
    actions: {
        //Загружает все записи с сервера
        async loadPersonal({commit}, vueHttp) {
            try {
                commit('clearError');
                commit('setLoading', true);
                const response = await vueHttp.get('personal');
                commit('loadPersonal', response.body);
            } catch (e) {
                commit('setError', 'Ошибка загрузки данных (' + e.status + ')');
                throw e
            } finally {
                commit('setLoading', false)
            }
        },
        //Сохранение сотрудника
        async savePerson({commit}, {payload, vueHttp}) {
            commit('clearError');
            commit('clearSuccess');

            if (payload.id === -1) {
                try {
                    const response = await vueHttp.post('personal', payload);
                    payload.id = response.data.id;
                    commit('createPerson', payload);
                } catch (e) {
                    commit('setError', 'Ошибка сохранения записи (' + e.status + ')');
                    this.person = new Person();
                    throw e;
                }
            } else {
                try {
                    await vueHttp.patch('personal/' + payload.id, payload);
                    commit('updatePerson', payload);
                } catch (e) {
                    commit('setError', 'Ошибка сохранения записи (' + e.status + ')');
                    this.person = new Person();
                    throw e;
                }
            }

            this.person = new Person();
            commit('setSuccess', 'Запись сохранена');
        },
        //Удаление сотрудника
        async deletePerson({commit}, {payload, vueHttp}) {
            try {
                commit('clearError');
                await vueHttp.delete('personal/' + payload.id, payload);
                commit('deletePerson', payload);
                this.person = new Person();
            } catch (error) {
                commit('setError', 'Ошибка удаления записи (' + error.status + ')');
                throw error
            }

            commit('setSuccess', 'Запись удалена');
        },
        //Открывает или закрывает диалог редактирования сотрудника
        openPersonalEditDialog({commit}, payload) {
            commit('openPersonalEditDialog', payload);
        },
        //Устанавливает сотрудника для редактирования
        setPerson({commit}, payload) {
            commit('setPerson', payload)
        },
        //Количество строк на странице
        setPersonalPagination({commit}, payload) {
            commit('setPersonalPagination', payload);
        }
    },
    getters: {
        //Все сотрудники
        personal(state) {
            return state.personal
        },
        //Возвращает состояние переменной открытия / закрытия диалога редактирования сотрудника
        openPersonalEditDialog(state) {
            return state.openPersonalEditDialog
        },
        //Создаваемый / редактируемый сотрудник
        getPerson(state) {
            return state.person;
        },
        //Количество строк на странице
        getPersonalPagination(state) {
            return state.pagination;
        }
    }
}
