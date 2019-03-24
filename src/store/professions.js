/*Профессии*/

export class Profession {
    constructor(id, name, notes) {
        this.id = id !== undefined ? id : -1;
        this.name = name !== undefined ? name : '';
        this.notes = notes !== undefined ? notes : '';
    }
}

export default {
    state: {
        professions: [],                    //Все профессии
        openProfessionEditDialog: false,    //флаг открытия диалога редактирования профессии
        profession: new Profession(),       //объект для создания / редактирования профессии
        pagination: {                       //настройка разбиения на страницы
            rowsPerPage: 20                 //Количество строк на странице
        }
    },
    mutations: {
        //Загружает все профессии
        loadProfessions(state, payload) {
            state.professions = payload
        },
        //Добавляет новую профессию в список
        createProfession(state, payload) {
            state.professions.push(payload)
        },
        //Изменяет существующую профессию в списке
        updateProfession(state, payload) {
            let item = this.getters.professions.find(p => {
                return p.id === payload.id
            });

            item.name = payload.name;
            item.notes = payload.notes;
        },
        //Удаляет профессию из списка
        deleteProfession(state, payload) {
            state.professions.splice(state.professions.indexOf(payload), 1)
        },
        //Открывает или закрывает диалог редактирования профессий
        openProfessionEditDialog(state, payload) {
            state.openProfessionEditDialog = payload
        },
        //Устанавливает профессию для редактирования
        setProfession(state, payload) {
            state.profession = payload
        },
        //Разбиение на страницы
        setPagination(state, payload) {
            state.pagination = payload
        }
    },
    actions: {
        //Загружает все записи с сервера
        async loadProfessions({commit}, vueHttp) {
            try {
                commit('clearError');
                commit('setLoading', true);
                const response = await vueHttp.get('professions');
                commit('loadProfessions', response.body);
            } catch (error) {
                commit('setError', 'Ошибка загрузки данных (' + error.status + ')');
                throw error
            } finally {
                commit('setLoading', false)
            }
        },
        //Сохранение профессии
        async saveProfession({commit}, {payload, vueHttp}) {
            commit('clearError');
            commit('clearSuccess');

            //Создание нового элемента
            if (payload.id === -1) {
                try {
                    const response = await vueHttp.post('professions', payload);
                    payload.id = response.data.id;
                    commit('createProfession', payload);
                } catch (error) {
                    commit('setError', 'Ошибка сохранения записи (' + error.status + ')');

                    this.profession = new Profession();
                    throw error
                }
                //Редактирование существующего элемента
            } else {
                try {
                    await vueHttp.patch('professions/' + payload.id, payload);
                    commit('updateProfession', payload);
                } catch (error) {
                    commit('setError', 'Ошибка сохранения записи (' + error.status + ')');
                    this.profession = new Profession();
                    throw error
                }
            }

            this.profession = new Profession();
            commit('setSuccess', 'Запись сохранена');
        },
        //Удаление профессии
        async deleteProfession({commit}, {payload, vueHttp}) {
            try {
                commit('clearError');
                await vueHttp.delete('professions/' + payload.id, payload);
                commit('deleteProfession', payload);
                this.profession = new Profession();
            } catch (error) {
                commit('setError', 'Ошибка удаления записи (' + error.status + ')');
                throw error
            }

            commit('setSuccess', 'Запись удалена');
        },
        //Проверка существования профессии с заданными именем
        async checkExists({commit}, {payload, vueHttp}) {
            try {
                commit('clearError');
                const response = await vueHttp.get('professions/search/findByName?name=' + payload.name);
                if (response.body.professions.length > 0)
                    commit('setError', 'Запись с таким именем уже существует');
            } catch (error) {
                commit('setError', 'Ошибка проверки записи (' + error.status + ')');
                throw error
            }
        },
        //Открывает или закрывает диалог редактирования профессий
        openProfessionEditDialog({commit}, payload) {
            commit('openProfessionEditDialog', payload)
        },
        //Устанавливает профессию для редактирования
        setProfession({commit}, payload) {
            commit('setProfession', payload)
        },
        //Количество строк на странице
        setPagination({commit}, payload) {
            commit('setPagination', payload);
        }
    },
    getters: {
        //Все профессии
        professions(state) {
            return state.professions
        },
        //Возвращает состояние переменной открытия / закрытия диалога редактирования профессии
        openProfessionEditDialog(state) {
            return state.openProfessionEditDialog
        },
        //Создаваемая / редактируемая профессия
        getProfession(state) {
            return state.profession;
        },
        //Количество строк на странице
        getPagination(state) {
            return state.pagination;
        },
        //количество записей
        getProfessionsCount() {
            return this.$store.state.professions.length;
        }
    }
}
