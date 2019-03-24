/* Смены */
export class Shift {
    constructor(id, name, notes) {
        this.id = id !== undefined ? id : -1;
        this.name = name !== undefined ? name : '';
        this.notes = notes !== undefined ? notes : '';
    }
}
export default {
    state: {
    shifts: [],                 // Смены
    openShiftEditDialog: false,     //флаг открытия диалога редактирования
    shift: new Shift(),        //объект для создания /редактирования смен
    pagination: {
        rowsPerpage: 20
    }
},
mutations: {
    // Загружает все смены
    loadShifts(state, payload) {
        state.shifts = payload
    },
    //Добавляет новую смену. в список
    createShift(state, payload) {
        state.shifts.push(payload)
    },
    // Изменяет существующую смену в списке
    updateShift(state, payload) {
        let item = this.getters.shifts.find(p=>{
            return p.id === payload.id
        });
        item.name = payload.name;
        item.notes = payload.notes;
    },
    //Удаляет смену из списка
     deleteShift(state, payload) {
         state.shifts.splice(state.shifts.indexOf(payload), 1)
     },
     //Открывает или закрывает диалог редактирования смен
     openShiftEditDialog(state, payload) {
        state.openShiftEditDialog = payload
},
    //Устанавливает смену для редактирования
    setShift(state, payload) {
        state.shift = payload
    },
    //Разбить на страницы
    setPagination(state, payload) {
        state.pagination = payload
    }
},
actions: {
    //загружает все записи с сервера
    async loadShifts({commit}, vueHttp) {
        try {
            commit('clearError');
            commit('setLoading', true);
            const response = await vueHttp.get('shifts');
            commit('loadShifts', response.body);
        } catch (error) {
            commit('setError', 'Ошибка загрузки данных (' + error.status + ')');
            throw error
        } finally {
            commit('setLoading', false)
        }
    },
     //Сохранение смены
     async saveShift({commit}, {payload, vueHttp}) {
        commit('clearError');
        commit('clearSuccess');
       //Создание нового элемента
            if (payload.id === -1) {
                try {
                    const response = await vueHttp.post('shifts', payload);
                    payload.id = response.data.id;
                    commit('createShift', payload);
                } catch (error) {
                    commit('setError', 'Ошибка сохранения записи (' + error.status + ')');

                    this.shift = new Shift();
                    throw error
                }
                //Редактирование существующего элемента
            } else {
                try {
                    await vueHttp.patch('shifts/' + payload.id, payload);
                    commit('updateShift', payload);
                } catch (error) {
                    commit('setError', 'Ошибка сохранения записи (' + error.status + ')');
                    this.shift = new Shift();
                    throw error
                }
            }

            this.shift = new Shift();
            commit('setSuccess', 'Запись сохранена');
        },
        //Удаление смен
        async deleteShift({commit}, {payload, vueHttp}) {
            try {
                commit('clearError');
                await vueHttp.delete('shifts/' + payload.id, payload);
                commit('deleteShift', payload);
                this.shift = new Shift();
            } catch (error) {
                commit('setError', 'Ошибка удаления записи (' + error.status + ')');
                throw error
            }

            commit('setSuccess', 'Запись удалена');
        },
        //Проверка существования смен с заданными именем
        async checkExists({commit}, {payload, vueHttp}) {
            try {
                commit('clearError');
                const response = await vueHttp.get('shifts/search/findByName?name=' + payload.name);
                if (response.body.shifts.length > 0)
                    commit('setError', 'Запись с таким именем уже существует');
            } catch (error) {
                commit('setError', 'Ошибка проверки записи (' + error.status + ')');
                throw error
            }
        },
        //Открывает или закрывает диалог редактирования профессий
        openShiftEditDialog({commit}, payload) {
            commit('openShiftEditDialog', payload)
        },
        //Устанавливает профессию для редактирования
        setShift({commit}, payload) {
            commit('setShift', payload)
        },
        //Количество строк на странице
        setPagination({commit}, payload) {
            commit('setPagination', payload);
        }
    },
    getters: {
        //Все смен
        shifts(state) {
            return state.shifts
        },
        //Возвращает состояние переменной открытия / закрытия диалога редактирования смены
        openShiftEditDialog(state) {
            return state.openShiftEditDialog
        },
        //Создаваемая / редактируемая сменя
        getShift(state) {
            return state.shift;
        },
        
    }
}
