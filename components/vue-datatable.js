Vue.component('datatable', {
    props: {
        columns : Array,
        data : Array,
        pageSize : {
            type : Number,
            default : 10
        },
        pageSizes : {
            type : Array,
            default : function(){
                return [ 3, 5, 10, 25, 50, 100 ];
            }
        },
        sortField : {
            type : String,
            default : null
        },
        ajax : {
            type : [String, Object],
            default : null
        }
    },
    data : function(){
        return {
            currentPage : 1,
            searchText : "",
            sortState : {
                column : null,
                asc : true
            },
            draw : 1
        }
    },
    template: `<div class="dt-wrapper container-fluid">
        <div class="row">
            <div class="col-8 form-inline">
                <label for="abc" class="my-1 mr-2">Items per page: </label>
                <select id="abc" class="custom-select my-1 mr-sm-2" v-model="pageSize">
                    <option v-for="ps in pageSizes" :value="ps">{{ ps }}</option>
                </select>
            </div>
            <div class="col-4">
                <div class="pull-right">
                    <div class="form-group input-sm input-group">
                        <input v-model="searchText" aria-describedby="addon-right addon-left" placeholder="Search" class="form-control">
                        <div class="input-group-append">
                            <span class="input-group-text">
                                <i class="fa fa-search"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <table class="table">
            <thead>
                <th v-for="(col, index) in columns" v-if="col.visible !== false">
                    <a @click="updateSortState(index)">{{ col.header }} <i v-if="sortState.column == index" :class="getSortBtnClass(index)"></i></a>
                </th>
            </thead>
            <tbody>
                <tr v-for="obj in pagedData">
                    <td v-for="col in columns" v-if="col.visible !== false" v-html="renderCellContent(obj,col)"></td>
                </tr>
            </tbody>
        </table>
        <div class="row">
            <div class="col-sm-6"></div>
            <div class="col-sm-6">
                <dt-pager @page-changed="setCurrentPage" :page-count="pageCount"></dt-pager>
            </div>
        </div>
    </div>`,
    computed : {
        tbodyContainerStyle : function(){
            return {
                height : (this.pageSize * 50) + "px",
            }
        },
        tbodyListStyle : function(){
            return {
                top : ((this.currentPage - 1) * this.pageSize * -50) + "px"
            }
        },
        /*filteredItems : function(){
            if(this.searchText.length > 0){
                c
            } else {
                return this.rows;
            }
        },*/
        sortPosition : function(){

        },
        pageCount : function(){
            return Math.ceil(this.filteredData.length / this.pageSize);
        },
        filteredData : function(){
            if(this.searchText.length <= 0){
                return this.data;
            } else {
                const _columns = this.columns;
                const regex = new RegExp(
                    this.searchText.split(' ').filter( str => str.length > 0).join(".+"),
                    "i"
                );
                return this.data.filter(function(obj){
                    for(const col of _columns){
                        if(col.searchable !== false &&
                            typeof col.actions === "undefined" &&
                            obj[col.field] &&
                            obj[col.field].toString().search(regex) != -1
                        ){
                            return true;
                        }
                    }
                    return false;
                });
            }
        },
        pagedData : function(){
            let start = (this.currentPage - 1) * this.pageSize;
            var result = this.filteredData.slice(start, start + this.pageSize);
            if(this.sortState.column !== null){
                result = result.sort(this.getSorting());
            }
            return result;
            /*const field = this.sortState.column !== null ?
                this.columns[this.sortState.column].field :
                null;
            const sortFactor = this.sortState.asc ? 1 : -1;
            return this.data.sort(function(a,b){
                if(field === null)
                    return 0;
                if(typeof a[field] === 'number'){
                    return (a[field] - b[field]) * sortFactor;
                }
                return sortFactor * a[field].toString().localeCompare(b[field].toString());
            }).slice(start, start + this.pageSize);*/
        },
    },
    methods : {
        updateSortState : function(colindex){
            this.sortState.column = colindex;
            this.sortState.asc = !this.sortState.asc;
            //console.log("Cambio el sortState: ",this.sortState);
        },
        setCurrentPage : function(n){
            this.currentPage = n;
            //console.log("Seteando current page en el datatable", n);
        },
        getCellContent : function(column, object){
            if(column.field){
                return object[column.field];
            } else if(typeof column.render == "function"){
                return column.render(object);
            } else {
                return "undefined";
            }
        },
        getSortBtnClass : function(colindex){
            return {
                "btn-sort" : true,
                "fa fa-sort-amount-up" : ( this.sortState.column == colindex && this.sortState.asc ),
                "fa fa-sort-amount-down" : ( this.sortState.column == colindex && !this.sortState.asc ),
            }
        },
        toKebabCase : function(str){
            return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        },
        renderCellContent : function(obj, col){
            if(col.type === "actions" || col.actions !== undefined){
                var btnHtml = ""
                for(const action of col.actions){
                    btnHtml += `<a href=""`;
                    if(action.attr){
                        for(const a in action.attr){
                            var attrValue = action.attr[a];
                            if(typeof attrValue === "function"){
                                attrValue = attrValue(obj);
                            }
                            btnHtml += " " + this.toKebabCase(a) + '="' + attrValue + '"';
                        }
                    }
                    btnHtml += ` class="btn btn-sm btn-primary">`;
                    if(typeof action.icon === "string"){
                        btnHtml += `<i class="fa fa-${action.icon}"></i>`;
                    }
                    btnHtml += `</a>`;
                }
                return btnHtml;
                //return `<a href="#" class="btn btn-sm btn-primary"><i class="fa fa-edit"></i></a>`;
            } else{
                return obj[col.field];
            }
            
        },
        getSorting : function(){
            const colindex = this.sortState.column;
            if(colindex === null){
                return function(a, b){
                    return 0;
                };
            }
            const field = this.columns[colindex].field;
            const sortFactor = this.sortState.asc ? 1 : -1;
            return function(a, b){
                if(!isNaN(a[field]) && !isNaN(b[field])){
                    return (a[field] - b[field]) * sortFactor;
                }
                return sortFactor * a[field].toString().localeCompare(b[field].toString());
            }
        },

        /**
         * 
         * AJAX related functions
         */
        fetchAjaxData : function(){
            var xhr = new XMLHttpRequest();
            if("withCredentials" in xhr){
                //tiene credenciales
                console.log("Tiene withCredentials");
            }
            var params = {
                draw : this.draw++,
                start : (this.currentPage - 1) * this.pageSize,
                length : this.pageSize,
                'search[value]' : this.searchText,
                'search[regex]' : false
            };
            if(this.ajax && typeof this.ajax.beforeSend === "function"){
                this.ajax.beforeSend(params);
            }
            xhr.open('GET', this.ajax.url+"?"+this.encodeParams(params), true);
            xhr.withCredentials = true;
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            xhr.onload = function() {
                if (xhr.status === 200) {
                    console.log(xhr);
                    var json = JSON.parse(xhr.responseText);
                    //alert('User\'s name is ' + xhr.responseText);
                }
                else {
                    console.error('Vue-DataTable AJAX Request failed.  Returned status of ' + xhr.status);
                }
            };
            xhr.send();
        },
        encodeParams : function(paramsObject){
            var encodedString = '';
            for (var prop in paramsObject) {
                if (paramsObject.hasOwnProperty(prop)) {
                    if (encodedString.length > 0) {
                        encodedString += '&';
                    }
                    encodedString += encodeURI(prop + '=' + paramsObject[prop]);
                }
            }
            return encodedString;
        },
        processAjaxResponse : function(data){

        }
    },
    mounted : function(){
        if(this.ajax && this.ajax.url){
            this.fetchAjaxData();
        }
    }
})