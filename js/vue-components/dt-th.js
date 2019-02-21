/**
 * DataTable Header cell
 */
Vue.component('dt-th',{
    props: {
        column : Object,
        index : Number,
        sortState : Object
    },
    computed : {
        sortBtnClass : function(){
            return {
                "btn-sort" : true,
                "fa fa-sort-ammount-down" : ( this.sortState.column == this.index && this.sortState.asc )
            }
        }
    },
    template : `
        <th>
            <a @click="">{{ column.header }} <i v-if="sortState.column == index" :class="sortBtnClass"></i></a>
        </th>`
});