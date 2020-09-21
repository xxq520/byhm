<template>
    <div class="mainbox">
        <topnav :topnav="topnav"></topnav>
        <div class="nav-list">
            <ul v-for="act in list">
                <div class="name">{{act.name}}</div>
                <li v-for="(item,y) in act.listCategory" :key="y">
                    <div @click="gogoods(item.jumpTarget)"><span
                            :style="{ backgroundImage: 'url('+item.imageUrl+')'}"></span>
                        <p>{{ item.name }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'goodClassify',
        data() {
            return {
                topnav: {
                    searh: true
                },
               
                list: []
            }
        },
        mounted() {
            this.indefn();

        },
        methods: {
            indefn() {
                axios.get(this.Api1 + '/home/queryCategoryList', {}).then(res => {

                    this.list = res.data.data;
                })

            },
            //图标跳转至对应的查询条件
            gogoods(links) {
                if (!!links) {
                    if (links.indexOf('http') >= 0 || links.indexOf('https') >= 0) {
                        window.location.href = links;
                    } else {
                        this.$router.push({
                            path: links
                        })
                    }
                }
            },

        }
    }

</script>

<style scoped>
    .mainbox {
        overflow: hidden;
        min-height: 100vh;
        background: #fff;
        color: #333;

    }

    .nav-list {
        overflow: hidden;
        padding: 0.5rem 0.4rem;
        font-size: 12px;
    }

    .nav-list .name {
        font-size: 0.65rem;
        font-weight: 550;
        color: #333;
    }

    .nav-list ul {
        overflow: hidden;
        margin-bottom: 0.2rem;
    }





    .nav-list li {
        float: left;
        width: 20%;
        font-size: 0.6rem;
        margin-bottom: 0.5rem;
    }

    .nav-list li span {
        display: block;
        width: 2rem;
        height: 2rem;
        border-radius: 0.2rem;
        margin: 0 auto 0.2rem;
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-position: center center;
    }

    .nav-list li p {
        display: block;
        text-align: center;
        font-size: 12px;
        line-height: 1.4em;
        color: #333;
    }

</style>
