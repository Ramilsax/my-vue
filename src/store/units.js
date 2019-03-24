/*Единицы измерения*/

export class Unit {
    constructor(id, name, fullName, notes) {
        this.id = id !== undefined ? id : -1;
        this.name = name !== undefined ? name : '';
        this.fullName = fullName !== undefined ? fullName : '';
        this.notes = notes !== undefined ? notes : '';
    }
}
export default {
    state: {
        units: [],                       //единицы измерения (е.и.)
        openUnitEditDialog: false,      //флаг открытия диалога редактирования е.и.
        unit: new Unit(),       //объект для создания / редактирования е.и.
        pagination: {                       //настройка разбиения на страницы
            rowsPerPage: 20                 //Количество строк на странице
        }
    },
    mutations: {
        //Загружает все е.и.
        loadUnits(state, payload) {
            state.units = payload
        },
        //Добавляет новую е.и. в список
        createUnit(state, payload) {
            state.units.push(payload)
        },
        //Изменяет существующую е.и. в списке
        updateUnit(state, payload) {
            let item = this.getters.units.find(p => {
                return p.id === payload.id
            });
            item.name = payload.name;
            item.fullName = payload.fullName;
            item.notes = payload.notes;
        },
        //Удаляет  из списка
        deleteUnit(state, payload) {
            state.units.splice(state.units.indexOf(payload), 1)
        },
        //Открывает или закрывает диалог редактирования 
        openUnitEditDialog(state, payload) {
            state.openUnitEditDialog = payload
        },
        //Устанавливает  для редактирования
        setUnit(state, payload) {
            state.unit = payload
        },
        //Разбиение на страницы
        setPagination(state, payload) {
            state.pagination = payload
        }
    },
    actions: {
        //Загружает все записи с сервера
        async loadUnits({commit}, vueHttp) {
            try {
                commit('clearError');
                commit('setLoading', true);
                const response = await vueHttp.get('units');
                commit('loadUnits', response.body);
            } catch (error) {
                commit('setError', 'Ошибка загрузки данных (' + error.status + ')');
                throw error
            } finally {
                commit('setLoading', false)
            }
        },
        //Сохранение 
        async saveUnit({commit}, {payload, vueHttp}) {
            
            commit('clearError');
            commit('clearSuccess');

            //Создание нового элемента
            if (payload.id === -1) {
                try {
                    const response = await vueHttp.post('units', payload);
                    payload.id = response.data.id;
                    commit('createUnit', payload);
                } catch (error) {
                    commit('setError', 'Ошибка сохранения записи (' + error.status + ')');

                    this.unit = new Unit();
                    throw error
                }
            }
                //Редактирование существующего элемента
             else {
                try {
                    await vueHttp.patch('units/' + payload.id, payload);
                    commit('updateUnit', payload);
                } catch (error) {
                    commit('setError', 'Ошибка сохранения записи (' + error.status + ')');
                    this.unit = new Unit();
                    throw error
                }
            }

            this.unit = new Unit();
            commit('setSuccess', 'Запись сохранена');
        },
        //Удаление 
        async deleteUnit({commit}, {payload, vueHttp}) {
            try {
                commit('clearError');
                await vueHttp.delete('units/' + payload.id, payload);
                commit('deleteUnit', payload);
                this.unit = new Unit();
            } catch (error) {
                commit('setError', 'Ошибка удаления записи (' + error.status + ')');
                throw error
            }

            commit('setSuccess', 'Запись удалена');
        },
        //Проверка существования  с заданными именем
        async checkExists({commit}, {payload, vueHttp}) {
            try {
                commit('clearError');
                const response = await vueHttp.get('units/search/findByName?name=' + payload.name);
                if (response.body.units.length > 0)
                    commit('setError', 'Запись с таким именем уже существует');
            } catch (error) {
                commit('setError', 'Ошибка проверки записи (' + error.status + ')');
                throw error
            }
        },
        //Открывает или закрывает диалог редактирования 
        openUnitEditDialog({commit}, payload) {
            commit('openUnitEditDialog', payload)
        },
        //Устанавливает  для редактирования
        setUnit({commit}, payload) {
            commit('setUnit', payload)
        },
        //Количество строк на странице
        setPagination({commit}, payload) {
            commit('setPagination', payload);
        }
    },
    getters: {
        //Все е.и.
        units(state) {
            return state.units
        },
        //Возвращает состояние переменной открытия / закрытия диалога редактирования е.и.
        openUnitEditDialog(state) {
            return state.openUnitEditDialog
        },
        //Создаваемая / редактируемая е.и.
        getUnit(state) {
            return state.unit;
        },
        //Количество строк на странице
        getUnitPagination(state) {
            return state.pagination;
        }
    }
}