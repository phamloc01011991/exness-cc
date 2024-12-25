<script setup>
import { ref, onMounted } from 'vue'
import { languagePack } from '../../../languages';
import request from '../../../utils/request'
import HistoryDetail from '../../Layout/person/HistoryDetail.vue'
const lstHistory = ref(false)
const itemDetail = ref()
const showHistoryDetail = ref(false)
const emit = defineEmits(['close-popup'])
import { formatUsdt, usdToVnd, formatVnd } from '../../../utils/money.js'
async function loadHistory() {
  let user = localStorage.getItem('user')
  if (typeof user == 'string') {
    user = JSON.parse(user)
    await request
      .get('user/get_trans_history', {
        params: {
          limit: 30,
        }
      })
      .then((res) => {
        if (res.data.success === true) {
          lstHistory.value = res.data.data.filter((item) => item.typeTransaction !== 'manual')
        }
      })
  }
}
const theme = ref(localStorage.getItem('theme') || 'dark')
const closePopup = () => {
  emit('close-popup')
}
function clickDetail(data) {
  itemDetail.value = data
  showHistoryDetail.value = true
}
function changeDate(inputDateTime = '') {
  // Tạo đối tượng Date từ chuỗi đầu vào
  const dateObj = new Date(inputDateTime)
  // Cộng thêm 7 giờ
  dateObj.setUTCHours(dateObj.getUTCHours() + 7)
  // Lấy thông tin giờ, phút và giây
  const hours = dateObj.getUTCHours()
  const minutes = dateObj.getUTCMinutes()
  const seconds = dateObj.getUTCSeconds()
  // Lấy ngày, tháng và năm
  const day = dateObj.getUTCDate()
  const month = dateObj.getUTCMonth() + 1 // Lưu ý: Tháng trong JavaScript bắt đầu từ 0, nên cần cộng thêm 1
  const year = dateObj.getUTCFullYear()
  // Tạo chuỗi kết quả
  const outputDateTime = `${day.toString().padStart(2, '0')}-${month
    .toString()
    .padStart(2, '0')}-${year} ${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')} `
  // console.log(outputDateTime); // Kết quả: 07:22:58 24-05-2023
  return outputDateTime
}
function transferType(type) {
  var i, x, tablinks
  x = document.getElementsByClassName('type-trans')
  for (i = 0; i < x.length; i++) {
    x[i].style.display = 'none'
  }
  tablinks = document.getElementsByClassName('tablink')
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove('active')
  }
  document.getElementById(type + '1').classList.add('active')
  document.getElementById(type).style.display = 'block'
}

onMounted(async () => {
  await loadHistory()
})
</script>
<template>
  <div>
    <div class="popbuy" :data-theme="theme" v-if="!showHistoryDetail">
      <div class="popbuy-content">
        <div class="top">
          <div class="ct">
            <div class="back"><i class="bx bx-left-arrow-alt" @click="closePopup"></i></div>
            <h4>{{ languagePack.person_history_title }}</h4>
          </div>
        </div>
        <div class="wr">
          <div class="tab-control">
            <span id="all1" class="tablink active" @click="transferType('all')">{{ languagePack.person_history_link1 }}</span>
            <span id="buy1" class="tablink" @click="transferType('buy')">{{ languagePack.person_history_link2 }}</span>
            <span id="sell1" class="tablink" @click="transferType('sell')">{{ languagePack.person_history_link3 }}</span>
            <span id="transfer1" class="tablink" @click="transferType('transfer')">{{ languagePack.person_history_link4 }} Farming</span>
            <span id="recieve1" class="tablink" @click="transferType('recieve')">{{ languagePack.person_history_link5 }} Farming</span>
          </div>
          <div class="scroll">
            <div id="all" class="type-trans">
              <ul style="position: relative; z-index: 9999999999; overflow-y: scroll">
                <div class="not-history" v-if="lstHistory == false">
                  <img src="../../../assets/ancient-scroll.png" alt="" />
                  <p>{{ languagePack.person_history_unhistory }}</p>
                </div>
                <template v-for="(item, index) in lstHistory">
                  <li @click="clickDetail(item)">
                    <div class="left">
                      <span>{{
                        item.typeTransaction == 'toup' && item.type == 'bank'
                          ? languagePack.person_history_type1
                          : item.typeTransaction == 'withdrawal' && item.type == 'bank'
                          ? languagePack.person_history_type2
                          : item.typeTransaction == 'withdrawal' && item.type == 'staking'
                          ? languagePack.person_history_type3
                          : languagePack.person_history_type4
                      }}</span>
                      <div class="time-create">{{ changeDate(item.createdAt) }}</div>
                    </div>
                    <div class="right">
                      <div class="kk">
                        <div :class="item.typeTransaction == 'toup' ? 'price l' : 'price s'">
                          {{
                            item.typeTransaction == 'toup'
                              ? '+' + formatUsdt(item.amount_usd)
                              : '-' + formatUsdt(item.amount_usd)
                          }}
                        </div>
                        <div
                          :class="
                            item.status == 'approved'
                              ? 'status ok'
                              : item.status == 'rejected'
                              ? 'status can'
                              : 'status pending'
                          "
                        >
                          {{ item.status == 'approved'
                              ? languagePack.person_history_status1
                              : item.status == 'rejected'
                              ? languagePack.person_history_status2
                              : languagePack.person_history_status3 }}
                        </div>
                      </div>
                      <i class="bx bx-chevron-right"></i>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
            <div id="buy" class="type-trans" style="display: none">
              <ul>
                <div class="not-history" v-if="lstHistory == false">
                  <img src="../../../assets/ancient-scroll.png" alt="" />
                  <p>{{ languagePack.person_history_unhistory }}</p>
                </div>
                <template v-for="(item, index) in lstHistory">
                  <li v-if="item.typeTransaction == 'toup' && item.type == 'bank'" @click="clickDetail(item)">
                    <div class="left">
                      <span>{{ languagePack.person_history_type1 }}</span>
                      <div class="time-create">{{ changeDate(item.createdAt) }}</div>
                    </div>
                    <div class="right">
                      <div class="kk">
                        <div class="price l">
                          {{ '+' + formatUsdt(item.amount_usd) }}
                        </div>
                        <div
                          :class="
                            item.status == 'approved'
                              ? 'status ok'
                              : item.status == 'rejected'
                              ? 'status can'
                              : 'status pending'
                          "
                        >
                          {{ item.status == 'approved'
                              ? languagePack.person_history_status1
                              : item.status == 'rejected'
                              ? languagePack.person_history_status2
                              : languagePack.person_history_status3 }}
                        </div>
                      </div>
                      <i class="bx bx-chevron-right"></i>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
            <div id="sell" class="type-trans" style="display: none">
              <div class="not-history" v-if="lstHistory == false">
                <img src="../../../assets/ancient-scroll.png" alt="" />
                <p>{{ languagePack.person_history_unhistory }}</p>
              </div>
              <ul>
                <template v-for="(item, index) in lstHistory">
                  <li v-if="item.typeTransaction == 'withdrawal' && item.type == 'bank'" @click="clickDetail(item)">
                    <div class="left">
                      <span>{{ languagePack.person_history_type2 }}</span>
                      <div class="time-create">{{ changeDate(item.createdAt) }}</div>
                    </div>
                    <div class="right">
                      <div class="kk">
                        <div class="price s">
                          {{ '-' + formatUsdt(item.amount_usd) }}
                        </div>
                        <div
                          :class="
                            item.status == 'approved'
                              ? 'status ok'
                              : item.status == 'rejected'
                              ? 'status can'
                              : 'status pending'
                          "
                        >
                          {{ item.status == 'approved'
                              ? languagePack.person_history_status1
                              : item.status == 'rejected'
                              ? languagePack.person_history_status2
                              : languagePack.person_history_status3 }}
                        </div>
                      </div>
                      <i class="bx bx-chevron-right"></i>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
            <div id="transfer" class="type-trans" style="display: none">
              <div class="not-history" v-if="lstHistory == false">
                <img src="../../../assets/ancient-scroll.png" alt="" />
                <p>{{ languagePack.person_history_unhistory }}</p>
              </div>
              <ul>
                <template v-for="(item, index) in lstHistory">
                  <li v-if="item.typeTransaction == 'withdrawal' && item.type == 'staking'" @click="clickDetail(item)">
                    <div class="left">
                      <span>{{ languagePack.person_history_type3 }}</span>
                      <div class="time-create">{{ changeDate(item.createdAt) }}</div>
                    </div>
                    <div class="right">
                      <div class="kk">
                        <div class="price s">
                          {{ '-' + formatUsdt(item.amount_usd) }}
                        </div>
                        <div
                          :class="
                            item.status == 'approved'
                              ? 'status ok'
                              : item.status == 'rejected'
                              ? 'status can'
                              : 'status pending'
                          "
                        >
                          {{ item.status == 'approved'
                              ? languagePack.person_history_status1
                              : item.status == 'rejected'
                              ? languagePack.person_history_status2
                              : languagePack.person_history_status3 }}
                        </div>
                      </div>
                      <i class="bx bx-chevron-right"></i>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
            <div id="recieve" class="type-trans" style="display: none">
              <ul>
                <div class="not-history" v-if="lstHistory == false">
                  <img src="../../../assets/ancient-scroll.png" alt="" />
                  <p>{{ languagePack.person_history_unhistory }}</p>
                </div>
                <template v-for="(item, index) in lstHistory">
                  <li v-if="item.typeTransaction == 'toup' && item.type == 'staking'" @click="clickDetail(item)">
                    <div class="left">
                      <span>{{ languagePack.person_history_type4 }}</span>
                      <div class="time-create">{{ changeDate(item.createdAt) }}</div>
                    </div>
                    <div class="right">
                      <div class="kk">
                        <div class="price l">
                          {{ '+' + formatUsdt(item.amount_usd) }}
                        </div>
                        <div
                          :class="
                            item.status == 'approved'
                              ? 'status ok'
                              : item.status == 'rejected'
                              ? 'status can'
                              : 'status pending'
                          "
                        >
                          {{ item.status == 'approved'
                              ? languagePack.person_history_status1
                              : item.status == 'rejected'
                              ? languagePack.person_history_status2
                              : languagePack.person_history_status3 }}
                        </div>
                      </div>
                      <i class="bx bx-chevron-right"></i>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <HistoryDetail
      v-if="showHistoryDetail"
      :item="itemDetail"
      @close-popup="showHistoryDetail = false"
    />
  </div>
</template>

<style scoped>
.scroll {
  padding: 5px 12px 75px 12px;
}
.not-history {
  margin-top: 50px;
  text-align: center;
}
.not-history p {
  margin-top: 20px;
  font-weight: 500;
}

.img {
  width: 64px;
  height: 64px;
  margin-bottom: 15px;
}
.popbuy {
  position: fixed;
  left: 0;
  top: 0;
  min-height: 100vh;
  width: 100%;
  z-index: 9999999999;
  background: var(--background-color);
  height: 100vh;
  overflow: scroll;
}
.popbuy-content {
  width: 100%;
  height: 100%;
  margin: auto;
  position: relative;
}
.popbuy-content .top {
  padding: 40px 12px 5px 12px;
}
.popbuy-content .top .ct {
  display: flex;
}
.popbuy-content .top .back {
  font-size: 25px;
}
.popbuy-content .top h4 {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
  font-size: 17px;
}
.tablink {
  background: none;
  color: var(--text-sub-color);
  border: none;
  font-weight: 600;
  border-radius: 5px;
  cursor: point;
}
.tab-control .active {
  color: var(--text-color);
  position: relative;
}

.tab-control {
  display: flex;
  padding-block: 10px;
  border-bottom: 1px solid var(--border-color);
}
.tab-control span {
  font-size: 15px;
  padding: 0;
  margin-right: 15px;
  display: inline-block;
}
.tablink.active::after {
    content: '';
    width: 100%;
    height: 2px;
    display: block;
    background-color: #faa600;
    position: absolute;
    right: 0;
    bottom: -11px;
    transition: ease all 0.7s;
}
.tab-control span:last-child {
  margin-right: 0px;
}
li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block: 15px;
}
.left {
}
.right {
  display: flex;
  align-items: center;
}
.right > i {
  display: inline-block;
  font-size: 23px;
  color: var(--text-sub-color);
  margin-left: 5px;
}
.right .kk {
  text-align: right;
}

.tab-control {
  padding-inline: 12px;
}

.time-create {
  font-size: 13px;
  color: var(--text-sub-color);
}
.price {
  font-weight: 600;
}
.price.l {
  color: #24af6c;
}
.price.s {
  color: #f14545;
}
.status {
  position: relative;
  display: inline-block;
}
.status.pending::after {
  content: '';
  position: absolute;
  display: block;
  width: 6px;
  height: 6px;
  background: #faa600;
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
}
.status.ok::after {
  content: '';
  position: absolute;
  display: block;
  width: 6px;
  height: 6px;
  background: #24af6c;
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
}
.status.can::after {
  content: '';
  position: absolute;
  display: block;
  width: 6px;
  height: 6px;
  background: #f14545;
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
}
</style>
