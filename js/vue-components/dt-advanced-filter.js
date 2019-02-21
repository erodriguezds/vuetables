Vue.component('dt-advanced-filter',{
    props: [ "columns" ],
    data : function(){
        return {
            
        }
    },
    watch : {

    },
    methods : {
        getFilterHtml : function(column){
            return `<input class="form-control form-control-sm" type="text" placeholder="">`;
        }
    },
    template : `
        <div class="dropdown">
            <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><i class="fas fa-filter"></i>
            <span class="caret"></span></button>
            <div class="dropdown-menu">
                <a v-for="col in columns" v-if="col.searchable !== false" class="dropdown-item">
                    <span class="col-6">{{ col.header }}:</span>
                    <span class="col-6" v-html="getFilterHtml(col)"></span>
                </a>
            </div>
        </div>`
});