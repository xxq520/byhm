<template>
    <div class="opnetiome">
        <mt-popup v-model="openVisible" position="bottom">
            <div class="visiblebtn">
            <mt-button size="small" type="default" class="quxiao" @click="quxiaofn">取消</mt-button>
            <mt-button size="small" type="primary" class="queding" @click="quedingfn">确定</mt-button>
        </div>
            <mt-picker :slots="typeslots" value-key="name" @change="onValuesChange"></mt-picker>
        </mt-popup>
    </div>
</template>

<script>
// carcount改变值刷新底部购物车数量
export default {
    props:['visible'],
    data(){
        return{
            times:'',
            openVisible:this.visible,
            openModel:'',
            typeslots:[
                {
                    flex: 1,
                    values: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "00"],
                    textAlign: 'center'
                },
                {
                    divider: true,
                    content: ':',
                },
                {
                    flex: 1,
                    values: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"],
                    textAlign: 'center'
                },
                {
                    divider: true,
                    content: '-',
                },
                {
                    flex: 1,
                    values: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "00"],
                    textAlign: 'center'
                },
                {
                    divider: true,
                    content: ':',
                },
                {
                    flex: 1,
                    values: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"],
                    textAlign: 'center'
                },
            ]
        }
    },
    watch:{
        visible(val){
            this.openVisible = val;
        },
        openVisible(val){
            this.$emit("openVisible",val);
        },
        times(val){
            this.$emit("time-data",val);
        }
    },
    mounted() {

    },
    methods:{
        onValuesChange(picker, values) {
         
            let val01 = values[0]=='0'?24:new Number(values[0]);
            let val02 = new Number(values[1]);
            let val03 = values[2]=='0'?24:new Number(values[2]);
            let val04 = new Number(values[3]);
         
            if(val01 >= val03){
                picker.setSlotValue(2, values[0]);
                /*if(val02 > val04){
                    picker.setSlotValue(3, values[1]);
                };*/
            };
            this.openModel = values[0] + ':' + values[1] + '-' + values[2] + ':' + values[3];
        },
        quedingfn(){
            this.openVisible = false;
            this.times = this.openModel;
        },
        quxiaofn(){
            this.openVisible = false;
        }
    }
}
</script>
<style scoped>
.mint-popup{
  width:100%;
}
.visiblebtn >>> .mint-button--small{
  font-size: 14px;
  padding: 0 8px;
  height: 25px;
}
.visiblebtn >>> .mint-button--default{
  -webkit-box-shadow: none;
  box-shadow: none;
}
.visiblebtn{
  padding:0.5rem;
  border-bottom:1px solid #eaeaea;
  overflow:hidden;
}
.visiblebtn .quxiao{
  float:left;
  border:1px solid #ccc;
}
.visiblebtn .queding{
  float:right;
}
</style>
