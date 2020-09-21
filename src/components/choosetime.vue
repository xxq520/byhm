<template>
    <div class="opnetiome">
        <div class="cart-list">
            <label>{{actName}}<span class="f1">*</span>:</label>
            <p class="lmain" >
                <input type="text" placeholder="开始时间" v-model="inStartTime" readonly class="a2" @click="openPicker">
               <span style="flex-shrink: 0;">--</span>
                <input type="text" placeholder="结束时间" v-model="inEndTime" readonly class="a2" @click="openPicker2">
                <i class="el-icon-arrow-right "></i>
            </p>
        </div>
        <mt-datetime-picker ref="picker" type="datetime" year-format="{value} 年" v-model="startTime"
            month-format="{value} 月" date-format="{value} 日" hour-format="{value} 时"
            minute-format="{value} 分" @confirm="handleConfirm" :startDate="startDate"
            :endDate="endDate">
        </mt-datetime-picker>
        <!-- mint datepicker 结束时间-->
        <mt-datetime-picker ref="picker2" type="datetime" year-format="{value} 年" v-model="endTime" month-format="{value} 月" date-format="{value} 日" hour-format="{value} 时"
            minute-format="{value} 分" @confirm="handleConfirm2" :startDate="startDate2" :endDate="endDate">
        </mt-datetime-picker>
    </div>
</template>

<script>
    // carcount改变值刷新底部购物车数量
    export default {
        props: ['StartTime','EndTime'],
        data() {
            return {
                startTime: new Date(),
                endTime: new Date(),
                inStartTime: this.StartTime,
                inEndTime: this.EndTime,
                startDate: new Date(),
                startDate2: new Date(), //开始时间
                endDate: new Date('2030'),
                actName: '活动时间'

            }
        },
        watch: {
            inStartTime(val) {
                this.$emit("update:StartTime", val);
            },
           inEndTime(val) {
                this.$emit("update:EndTime", val);
            },
            StartTime(val){
                this.inStartTime = val
            },
            EndTime(val){
               this.inEndTime = val
            }
        },
        mounted() {
        
        },
        methods: {
            //时间转换函数
            formData(time) {
                var date = new Date(time);
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
                var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                var s = date.getSeconds();
                return Y + M + D +' '+h+':'+m+':00';
            },
            //选择时间匹配
            handleConfirm(data) {
                if (new Date(data).getTime() <= new Date(this.endTime).getTime()) {
                    this.startDate2 = data
                    let date = this.formData(data);
                    this.inStartTime = date;
                  
                } else {
                   this.startDate2 = data
                   let date = this.formData(data);
                   this.inStartTime = date;
                }
            },
            handleConfirm2(data) {
                if (new Date(data).getTime() >= new Date(this.startTime).getTime()) {
                    let date = this.formData(data);
                    this.inEndTime = date;
                    // console.log(this.inEndTime)
                } else {
                    Toast({
                        message: '结束时间不能小于开始时间！',
                        duration: 2000,
                        className: 'counttc'
                    });
                }
            },
            // 时间筛选
            openPicker() {
                this.$refs.picker.open();
            },
            openPicker2() {
                this.$refs.picker2.open();
            },
        }
    }

</script>
<style scoped>
    .opnetiome>>>.picker-items {
        width: 100%;
        
    }
 .opnetiome>>>.picker-item {
     font-size: 0.65rem;
     padding: 0;
 }
    .cart-list {
        display: -webkit-flex;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0.6rem 0.5rem;
        font-size: 0.6rem;
        line-height: 1.4em;
        border-bottom: 1px solid #eee;
        background-color: #fff;
    }

    .cart-list label .f1 {
        color: #f00;
        font-size: 0.7rem;
        position: relative;
        top: 0.1rem;
    }

    .cart-list label {
        width: 6em;
        display: flex;
        align-items: center;
        color: #333;
    }

    .cart-list .lmain {
        display: -webkit-flex;
        display: flex;
        font-size: 0.58rem;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 6em);
        color: #333;
        margin-left: .416667rem;
       
    }

    .cart-list .lmain .a2 {
        width: 5rem;
        text-align: center;
        font-size: 0.45rem;
    }

    .cart-list input {
        display: block;
        flex: 1;
        text-align: right;
        font-size: 0.55rem;
        color: #888;
    }

</style>
