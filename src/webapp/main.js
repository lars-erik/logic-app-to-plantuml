import Vue from 'vue';
import App from './App.vue';

console.log("Creating");
new Vue({
    render: createElement => createElement(App)
}).$mount('#app');
console.log("Done");