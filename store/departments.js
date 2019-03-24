/*Отделы и подразделения*/
export class Department {
    constructor(id, name, notes, department) {
        this.id = id !== undefined ? id : -1;
        this.name = name !== undefined ? name : '';
        this.notes = notes !== undefined ? notes : '';
        this.parentDepartment = department !== undefined ? department : null;   //родительский отдел
    }
}

export default {
    state: {
        departments: [],                            //Все отделы
        openDepartmentEditDialog: false,            //флаг открытия диалога редактирования отдела
        department: new Department(),               //объект для создания / редактирования отдела
        pagination: {                               //настройка разбиения на страницы
            rowsPerPage: 20                         //Количество строк на странице
        }
    },
    mutations: {
        //Загружает все отделы
        loadDepartments(state, payload) {
            state.departments = payload;
        },
        //Добавляет новый отдел в список
        createDepartment(state, payload) {
            state.departments.push(payload);
        },
        //Изменяет существующий отдел в списке
        updateDepartment(state, payload) {
            var item = this.getters.departments.find(d => {
                return d.id === payload.id;
            });

            item.name = payload.name;
            item.notes = payload.notes;
        },
        //Удаляет отдел из списка
        deleteDepartment(state, payload) {
            state.departments.splice(state.departments.indexOf(payload), 1);
        },
        //Открывает или закрывает диалог редактирования отдела
        openDepartmentEditDialog(state, payload) {
            state.openDepartmentEditDialog = payload;
        },
        //Устанавливает отдел для редактирования
        setDepartment(state, payload) {
            state.department = payload;
        },
        //Разбиение на страницы
        setPagination(state, payload) {
            state.pagination = payload;
        }
    },
    actions: {
        //Загружает все записи с сервера
        async loadDepartments({commit}, vueHttp) {
            try {
                commit('clearError');
                commit('setLoading', true);
                const response = await vueHttp.get('departments');
                commit('loadDepartments', response.body);
            } catch (e) {
                commit('setError', 'Ошибка загрузки данных (' + e.status + ')');
                throw e
            } finally {
                commit('setLoading', false);
            }
        },
        //Сохранение отдела
        async saveDepartment({commit}, {payload, vueHttp}) {
            commit('clearError');
            commit('clearSuccess');

            if (payload.id === -1) {
                //Создание нового отдела
                try {
                    const response = await vueHttp.post('departments', payload);
                    payload.id = response.data.id;
                    commit('createDepartment', payload);
                } catch (e) {
                    commit('setError', 'Ошибка сохранения записи (' + e.status + ')');
                    this.department = new Department();
                    throw e
                }
            } else {
                //Редактировнаие существующей записи
                try {
                    await vueHttp.patch('departments/' + payload.id, payload);
                    commit('updateDepartment', payload)
                } catch (e) {
                    commit('setError', 'Ошибка сохранения записи (' + e.status + ')');
                    this.department = new Department();
                    throw e;
                }
            }

            this.department = new Department();
            commit('setSuccess', 'Запись сохранена');
        },
        //Удаление отдела
        async deleteDepartment({commit}, {payload, vueHttp}) {
            try {
                commit('clearError');
                await vueHttp.delete('departments/' + payload.id, payload);
                commit('deleteDepartment', payload);
                this.department = new Department();
            } catch (e) {
                commit('setError', 'Ошибка удаления записи (' + e.status + ')');
                throw e;
            }

            commit('setSuccess', 'Запись удалена');
        },
        //Открывает или закрывает диалог редактирования отдела
        openDepartmentEditDialog({commit}, payload) {
            commit('openDepartmentEditDialog', payload);
        },
        //Устанавливает отдел для редактирования
        setDepartment({commit}, payload) {
            commit('setDepartment', payload);
        },
        //Количество строк на странице
        setDepartmentPagination({commit}, payload) {
            commit('setPagination', payload);
        }
    },
    getters: {
        //Все отделы
        departments(state) {
            return state.departments
        },
        //Возвращает состояние переменной открытия / закрытия диалога редактирования отдела
        openDepartmentEditDialog(state) {
            return state.openDepartmentEditDialog;
        },
        //Создаваемая / редактируемая отдела
        getDepartment(state) {
            return state.department;
        },
        //Количество строк на странице
        getDepartmentPagination(state) {
            return state.pagination;
        }
    }
}
