Vue.component('ft-row',{
    props: {
        columns : Array,
        object : Object,
        search : {
            type : String,
            default : ""
        },
        position : {
            type : Number,
            default : 0
        }
    },
    mounted : function(){
        console.log("Se acaba de crear una file con position: ",this.position);
    },
    computed : {
        filtered : function(){
            if(this.search.length > 0){
                for(const col of this.columns){
                    if(col.searchable !== false && (''+this.object[col.field]).includes(this.search))
                        return false;
                }
                return true;
            }
            return false;
        },
        liClass : function(){
            return {
                "list-group-item" : true,
                "d-flex" : true,
                "justify-content-around" : true,
                "filtered" : this.filtered
            }
        }
    },
    template : `
        <li :class="liClass" :style="{ top : ((this.position * 50)+'px')}">
            <span v-for="col in columns">{{ object[col.field] }}</span>
        </li>`
});