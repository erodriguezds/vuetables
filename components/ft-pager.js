Vue.component('dt-pager',{
    props: {
        pageCount : {
            type : Number,
            default : 5
        }
    },
    data : function(){
        return {
            currentPage : 1
        }
    },
    watch : {
        pageCount: function (newPageCount) {
            if(this.currentPage > newPageCount){
                this.setCurrentPage(newPageCount);
            }
        },
    },
    methods : {
        setCurrentPage : function(n){
            this.currentPage = n;
            this.$emit('page-changed',this.currentPage);
        },
        nextPage : function(){
            if(this.currentPage < this.pageCount){
                this.setCurrentPage(this.currentPage + 1);
            }
        },
        prevPage : function(){
            if(this.currentPage > 1){
                this.setCurrentPage(this.currentPage - 1);
            }
        },
    },
    template : `<nav class="float-right">
        <ul class="pagination">
            
            <li class="page-item">
                <a @click="prevPage()" class="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            
            <li v-for="n in pageCount" :class="{ 'page-item' : true, active : (currentPage == n)}">
                <a class="page-link" href="#" @click="setCurrentPage(n)">{{ n }}</a>
            </li>
            
            <li>
                <a @click="nextPage()" class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>`
});