/*Настройка маршрутизации по приложению*/

import Vue from 'vue'
import VueRouter from 'vue-router' //библиотека для маршрутизации по приложению
import Home from '../components/Home' //домашняя страница
import Directory from '../components/directory/Directory' //страница справочников
import Professions from '../components/directory/professions/Professions' //страница профессий
import Departments from '../components/directory/departments/Departments' //страница подразделений
import Personal from '../components/directory/personal/Personal' //страница сотрудников
import Units from '../components/directory/units/Units' //страница едениц измерения
import Shifts from '../components/directory/shifts/Shifts' //страница смен

Vue.use(VueRouter);                 //подключаем vue-router

export default new VueRouter({
    routes: [
        {   // домашняя страница
            path: '/',
            name: 'Home',
            component: Home
        },
        {   //справочники
            path: '/directory',
            name: 'Directory',
            component: Directory
        },
        {   //профессии
            path: '/directory/professions',
            name: 'Professions',
            component: Professions
        },
        {   //отделы и подразделения
            path: '/directory/departments',
            name: 'Departments',
            component: Departments
        },
        {   //сотрудники
            path: '/directory/personal',
            name: 'Personal',
            component: Personal
        },
        {   //Еденицы измерения
            path: '/directory/units',
            name: 'Units',
            component: Units
        },
        {   //Еденицы измерения
            path: '/directory/shifts',
            name: 'Shifts',
            component: Shifts
        }],
    mode: 'history'
});
