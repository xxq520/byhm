<template>
    <div class="mainbox">
        <topnav :topnav="topnav"></topnav>
         <div class="detailhead">
             商家从业资质
         </div>
        <div class="inforimg">
            <div class="license" v-if="bizLicence">
                <img :src="bizLicence" @click="checkShow">
                 <picture-viewer v-if="check" :imgUrl.sync="yilist"></picture-viewer>
            </div>
            <!-- <div class="certificate" v-if="otherQualication.length > 0">
                <img v-for="(item,i) in otherQualication" :key="i" :src="item">
            </div> -->
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                topnav: {
                    title: '营业资质'
                },
                id: this.$route.query.id,
                otherQualication: [],
                bizLicence: '',
                yilist:[{
                    name:"营业执照",
                    url:''
                }],
                check:false
            }
        },
        mounted() {
            axios({
                url: this.Api + 'merchant/queryMerchantInfo?merid=' + this.id,
                method: "get"
            }).then(res => {
                if (res.data.code == 0) {
                    let data = res.data.resultMap;
                    this.bizLicence = data.bizLicence;
                    this.yilist[0].url = data.bizLicence;
                    this.otherQualication = data.merchantOtherQualification;
                }
            });
        },
        methods: {
          //查看图片
          checkShow(){
             this.check = !this.check
          
          }

        }
    }

</script>

<style scoped>
    .mainbox {
        overflow: hidden;
        padding-top: 40px;
        min-height: 100vh;
        background: #f2f2f2;
    }

    .mainbox>>>.mint-header {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 999;
    }
        .detailhead {
        overflow: hidden;
        padding: 0.7em 10px;
        font-size: 0.7rem;
        color: #333;
        border-bottom: 1px solid #eee;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        }

     .inforimg {
     overflow: hidden;
     padding-bottom: 0.5rem;
     display: flex;
     flex-direction: column;
     align-items: center;
     }

     .license {
     width: 60%;

     border: 1px solid #d1d1d1;
     height: 12rem;
     padding: 0.4rem;
     margin: 0.5rem;
     display: -webkit-flex;
     /* Safari */
     display: flex;
     align-items: center;
     justify-content: center;
     }

     .license img {
     width: auto;
     height: auto;
     max-height: 100%;
     }


</style>
