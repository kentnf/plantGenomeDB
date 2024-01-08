<template>
    <div class="contentWraper">
        <div class="row">
            <div class="col-md-10 col-xs-10 col-xs-offset-1 col-md-offset-1">
                <h3>Contact us</h3>
                <hr />
            </div>

            <!-- basic information -->
            <div class="row">
                <div
                    class="col-md-10 col-xs-10 col-xs-offset-1 col-md-offset-1"
                >
                    <h5>
                    The {{ siteConfig.siteName }} will be updated at intervals. <br /> <br/>
                    The data in this database are freely available for all academic and non-commercial users. <br /> <br/>
                    Please mail your comments and suggestions to: 
                    <span v-for="(item, index) in labs" :key="index">
                        <span v-if="index === labs.length - 1">
                        {{ item.pi }} ({{ item.mail }})
                        </span>
                        <span v-else>
                        {{ item.pi }} ({{ item.mail }}), 
                        </span>
                    </span>.

                    </h5>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { inject } from 'vue';
const siteConfig = inject('siteConfig');
const labs = siteConfig.labs;
</script>