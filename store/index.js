/* Настройка хранилища */

import Vue from 'vue'
import Vuex from 'vuex' //библиотека для управления состоянием приложения и хранилищем данных
import Professions from './professions' //Профессии
import Departments from './departments' //отделы и подразделения
import Personal from './personal' //Сотрудники
import Units from './units' //единицы измерения
import Shifts from './shifts' //смены


Vue.use(Vuex);                      //подключаем vuex

export default new Vuex.Store({
    modules: {Professions, Departments, Personal, Units, Shifts},
    //Состояние - сами данные
    state: {
        loading: false,     //загрузка данных
        error: null,        //ошибка при выполнении операции
        success: null,      //операция выполнена успешно
        //Все ссылки приложения
        links: [
            {title: 'Управление', icon: 'bookmark', url: '/', topLevel: true, count: 0},
            {title: 'Производство', icon: 'bookmark', url: '/production', topLevel: true, count: 0},
            {title: 'Качество', icon: 'bookmark', url: '/quality', topLevel: true, count: 0},
            {title: 'Оборудование', icon: 'bookmark', url: '/equipment', topLevel: true, count: 0},
            {title: 'Справочники', icon: 'bookmark', url: '/directory', topLevel: true, count: 0},
            {title: 'Профессии', icon: 'format_paint', url: '/directory/professions', topLevel: false, count: 0},
            {title: 'Отделы и подразделения', icon: 'domain', url: '/directory/departments', topLevel: false, count: 0},
            {title: 'Персонал', icon: 'group', url: '/directory/personal', topLevel: false, count: 0}],
        links1: [
            {title: 'Единицы измерения', icon: 'straighten', url: '/directory/units', topLevel: false, count: 0}
        ],
        links2: [
            {title: 'Смены', icon: 'brightness_4', url: '/directory/shifts', topLevel: false, count: 0}
        ],
    },
    //Мутации - для изменения данных
    mutations: {
        //Загрузка данный
        setLoading(state, payload) {
            state.loading = payload
        },
        //Установка ошибки
        setError(state, payload) {
            state.error = payload
        },
        //Очистить ошибки
        clearError(state) {
            state.error = null
        },
        //Установка сообщения об успехе
        setSuccess(state, payload) {
            state.success = payload
        },
        //Очистить сообщения об успехе
        clearSuccess(state) {
            state.success = null
        }
    },
    //Действия - для асинхронных вызовов изменения данных
    actions: {
        setLoading({commit}, payload) {
            commit('setLoading', payload)
        },
        setError({commit}, payload) {
            commit('setError', payload)
        },
        clearError({commit}) {
            commit('clearError')
        },
        setSuccess({commit}, payload) {
            commit('setSuccess', payload)
        },
        clearSuccess({commit}) {
            commit('clearSuccess')
        }
    },
    //Геттеры для получения данных
    getters: {
        //Загрузка данных
        loading(state) {
            return state.loading
        },
        //Ошибка в приложении
        error(state) {
            return state.error
        },
        //Успешное выполенние операции
        success(state) {
            return state.success
        },
        //Все ссылки приложения
        links(state) {
            return state.links;
        },
        links1(state) {
            return state.links1;
        },
        links2(state) {
            return state.links2;
        },
        linksCount(state) {
            return state.linksCount; 
        },
        allLinks(state) {
            return state.links.concat(state.links1, state.links2);
        },
        //Ссылки верхнего уровня
        topLevelLinks(state) {
            return state.links.filter(link => {
                return link.topLevel
            })
        },
        topLevelLinks1(state) {
            return state.links1.filter(link => {
                return link.topLevel
            })
        },
        topLevelLinks2(state) {
            return state.links2.filter(link => {
                return link.topLevel
            })
        },
        topLevelLinkCount(state) {
            return state.linksCount.filter(link => {
                return link.topLevel
            })
        }, 
        //Ссылки для страницы Справочники
        directoryLinks(state) {
            return state.links.filter(link => {
                return link.url.includes('/directory/')
            })
        },
        directoryLinks1(state) {
            return state.links1.filter(link => {
                return link.url.includes('/directory/')
            })
        },
        directoryLinks2(state) {
            return state.links2.filter(link => {
                 return link.url.includes('/directory/')
                })
        },
        directoryLinks3(state) {
            return state.linkCount.filter(link => {
                 return link.url.includes('/directory/')
                })
            }, 
        }
})
