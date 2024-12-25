<script>
import { defineComponent } from 'vue'
import { languagePack } from '../../languages'
import { Carousel, Pagination, Slide } from 'vue3-carousel'

import 'vue3-carousel/dist/carousel.css'

export default defineComponent({
  name: 'Autoplay',
  components: {
    Carousel,
    Slide,
    Pagination,
  },
  data() {
  return { imgslide: [
      {
          url: 'https://i.imgur.com/JsH9xqj.png',
          content:languagePack.home_notification_ct1,
          link: '/invest'
      }
      , 
      {
          url: 'https://i.imgur.com/wNZjbWh.png',
          content:languagePack.home_notification_ct2,
          link: '/buy'
      }, 
      {
          url: 'https://i.imgur.com/lG1yRk4.png',
          content:languagePack.home_notification_ct3,
          link: '/market'
      }
  ] }
}
})
</script>
<template>
    <Carousel :autoplay="50000" :wrap-around="true">
      <Slide v-for="(slide, index) in imgslide" :key="index">
        <div class="carousel__item">
           <div class="wrp">
                <div class="content">
                    <div class="ct">
                        <p>{{ slide.content }}</p>
                        <RouterLink :to="slide.link" class="button">
                          <i data-v-b9ee9796="" class="bx bx-right-arrow-alt"></i>
                        </RouterLink>
                    </div>
                    <div class="img">
                      <img :src="slide.url" alt="photo">
                    </div>
                </div>
           </div>
        </div>
      </Slide>
  
      <template #addons>
        <Pagination />
      </template>
    </Carousel>
  </template>
  

  <style scoped>
  p {
    font-size: 13px;
    text-align: left;
    font-weight: 700;
    line-height: 25px;
  }
.carousel__item {
  height: 120px;
  width: 100%;
}
.wrp {
    width: 100%;
    height: 100%;
}
.carousel__item .content {
    padding-block: 15px;
    width: 100%;
    height: 100%;
    position: relative;
    background-color: var(--background-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.carousel__item .content .ct {
    width: 70%;
    padding-left: 15px;
    text-align: left;
}
.carousel__item .content .button {
  height: 16px;
  line-height: 16px;
  padding-inline: 10px;
  border-radius: 10px;
  font-size: 16px;
  vertical-align: middle;
}
.content .img {
  width: 25%;
  padding-right: 15px;
}
.content .img img {
  display: block;
  max-width: 90%;
  object-fit: cover;
}
.carousel__pagination {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0;
    border-radius: 5px;
    overflow-x: hidden;
    background-color: var(--background-input) !important;
    height: 3.5px;
}

</style>
  