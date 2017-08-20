var vm = new Vue({
    el: '#app',
    data: {
        ubikeStops: [],
        isEN:false,
        searchsna:"",
        searchdata:{
            sna:"",
            sarea:"",
            ar:"",
            snaen:"",
            sareaen:"",
            aren:""
        },
        sortdata:{
            sno:"",
            act:""
        }
    },
    computed:{
        filteredStops(){
            let tempstops=this.ubikeStops;
            if(this.isEN)
            {
                if(this.searchdata.snaen!=="")
                    {
                        tempstops=tempstops.filter((d)=>{return d.snaen.toUpperCase().indexOf(this.searchdata.snaen.toUpperCase())>-1});
                    }
                    if(this.searchdata.sareaen!=="")
                        {
                            tempstops=tempstops.filter((d)=>{return d.sareaen.toUpperCase().indexOf(this.searchdata.sareaen.toUpperCase())>-1});
                        }
                    if(this.searchdata.aren!=="")
                        {
                            tempstops=tempstops.filter((d)=>{return d.aren.toUpperCase().indexOf(this.searchdata.aren.toUpperCase())>-1});
                        }
            }
            else{
                
                if(this.searchdata.sna!=="")
                {
                    tempstops=tempstops.filter((d)=>{return d.sna.toUpperCase().indexOf(this.searchdata.sna.toUpperCase())>-1});
                }
                if(this.searchdata.sarea!=="")
                    {
                        tempstops=tempstops.filter((d)=>{return d.sarea.toUpperCase().indexOf(this.searchdata.sarea.toUpperCase())>-1});
                    }
                if(this.searchdata.ar!=="")
                    {
                        tempstops=tempstops.filter((d)=>{return d.ar.toUpperCase().indexOf(this.searchdata.ar.toUpperCase())>-1});
                    }
            }
            if(this.sortdata.sno && this.sortdata.sno!=="")
                {
                if(this.sortdata.sno==="asc")
                    {
                        tempstops=sortByKey(tempstops,"sno",true);
                    }
                else
                    {
                        tempstops=sortByKey(tempstops,"sno",false);
                    }
            }
            if(this.sortdata.act && this.sortdata.act!=="")
                {
                if(this.sortdata.act===""||this.sortdata.act==="asc")
                    {
                        tempstops=sortByKey(tempstops,"act",false);
                    }
                else
                    {
                        tempstops=sortByKey(tempstops,"act",true);
                    }
            }
            return tempstops;
        },
        filteredSNA(){
            return (this.searchsna==="")
            ?this.ubikeStops
            :this.ubikeStops.filter(
              (d)=>{return d.sna.toUpperCase().indexOf(this.searchsna.toUpperCase())>-1}
              // function(d){
              //   return d.name.indexOf(searchname)>-1;
              // }
              )
          }
    },
    filters: {
      timeFormat(t){

        var date = [], time = [];

        date.push(t.substr(0, 4));
        date.push(t.substr(4, 2));
        date.push(t.substr(6, 2));
        time.push(t.substr(8, 2));
        time.push(t.substr(10, 2));
        time.push(t.substr(12, 2));

        return date.join("/") + ' ' + time.join(":");
      },
      isActive(val)
      {
          if(this.isEN)
            return val==="1"?"Active":"Inactive";
          else
          return val==="1"?"正常營運":"暫停營運";
      }
    },
    methods:{
        SetEN(){
            this.isEN=!this.isEN;
        },
        ClearSearch(val){
            this.searchdata[val]="";
        },
        ASC(val){
            this.sortdata={};
            this.sortdata[val]="asc";
        },
        DESC(val){
            this.sortdata={};
            this.sortdata[val]="desc";
        }
    },
    created() {

        // 欄位說明請參照:
        // http://data.taipei/opendata/datalist/datasetMeta?oid=8ef1626a-892a-4218-8344-f7ac46e1aa48

        // sno：站點代號、 sna：場站名稱(中文)、 tot：場站總停車格、
        // sbi：場站目前車輛數量、 sarea：場站區域(中文)、 mday：資料更新時間、
        // lat：緯度、 lng：經度、 ar：地(中文)、 sareaen：場站區域(英文)、
        // snaen：場站名稱(英文)、 aren：地址(英文)、 bemp：空位數量、 act：全站禁用狀態

        axios.get('https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.gz')
            .then(res => {

                // 將 json 轉陣列後存入 this.ubikeStops
                this.ubikeStops = Object.keys(res.data.retVal).map(key => res.data.retVal[key]);

            });

    },
    mounted()    {
        $(function() {
            $('#setEN').bootstrapToggle({
            });
            $('#setEN').change(function() {
                vm.SetEN();
              })
          })
    }
});

function sortByKey(array, key,reverse) {
    if(reverse)
        {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }); 
        }
    else
        {
            return array.reverse(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        
    }
}