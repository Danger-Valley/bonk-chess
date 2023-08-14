<template>
  <div class="page">
    <Header></Header>

    <div class="top">
      <div class="top__heading">{{ arena?.event.title }}</div>
      <div class="top__underheading">{{ arena?.event.description }}</div>
      <div class="top__modes">
        <div class="mode">
          <GameModeFigure />
          {{ foundGameMode?.name }}
        </div>
        <div class="mode">
          <GameModeTime />
          {{ foundGameMode?.dur }}
        </div>
        <div class="mode">
          <GameModeCoins />
          {{ arena?.event.participationFee }}
        </div>
      </div>
    </div>

    <div class="info">
      <div class="info__block">{{ arena?.infoline }}</div>
      <div class="info__block">{{ arena?.infoline }}</div>
      <div class="info__block">{{ arena?.infoline }}</div>
      <div class="info__block">{{ arena?.infoline }}</div>
    </div>

    <div
      class="main"
      v-if="arena"
    >
      <div class="register">
        <div class="register__btn" v-if="!event?.isRegistered" @click="register">Register</div>
        <div class="register__btn" v-else-if="new Date() < new Date(arena?.event.startAt)">Registered</div>
        <div class="register__btn" v-else>Play Now</div>
        <div class="progress">
          <div class="progress__start">{{ formatDate(new Date(arena?.event.startAt)) }}</div>
          <div class="progress__end">{{ formatDate(new Date(arena?.event.endAt)) }}</div>
          <div class="progress__bar">
            <div
              class="progress__bar-active"
              :style="`width: ${Math.max(Math.min((new Date(arena?.event.endAt) - dateNow) / (new Date(arena?.event.endAt) - new Date(arena?.event.startAt)), 100), 0)}%;`"
            ></div>
          </div>
        </div>
        <div class="prize">
          <div class="prize__heading">Prize Pool</div>
          <div class="prize__underheading">{{ arena?.event.prizePool.all }}</div>
        </div>
      </div>
    </div>

    <div class="ranks">
      <div class="ranks__heading">
        <div>#</div>
        <div>Username</div>
        <div>W-D-L</div>
        <div>Score</div>
        <div>Reward</div>
      </div>
      <div
        class="rank"
        v-for="(rank, counter) in participants"
      >
        <div>{{ counter + 1 }}</div>
        <div>
          <img
            class="rank__avatar"
            v-if="rank.user?.avatar"
            :src="rank.user.avatar"
          />
          {{ rank.user.username }}
        </div>
        <div>{{ rank.winsCount }}-{{ rank.drawsCount }}-{{ rank.losesCount }}</div>
        <div>{{ rank.score }}</div>
        <div>{{ rank.reward }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import GameModeFigure from "@/assets/imgs/game-mode-figure.svg"
import GameModeTime from "@/assets/imgs/game-mode-time.svg"
import GameModeCoins from "@/assets/imgs/game-mode-coins.svg"
import gameModes from "@/assets/content/gameModes.json"
let { $API } = useNuxtApp();
let arena = ref(),
  foundGameMode = ref(),
  dateNow = ref(),
  participants = ref([])

const findGameModeParams = (id) => {
  let name, dur
  gameModes.map(el => {
    el.items.map(item => {
      if (item.id == id) {
        name = el.name
        dur = item.name
        return true
      }
    })
  })
  return { name, dur }
}

const formatDate = (date) => {
  console.log(date)
  let month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
    day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(date),
    year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(date),
    time = new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(date)

  let str = `${month} ${day}, ${year}, ${time}`
  console.log(str)
  return str
}

const register = async () => {
  let resp = await $API().Events.register({
    accessToken: localStorage.getItem('accessToken'),
    id: arena.value.event.id
  });
  let body = await resp.json();
  console.log(body);
}

onMounted(async () => {
  let resp = await $API().Events.getArena();
  let body = await resp.json();
  console.log(body);
  arena.value = body;
  foundGameMode.value = findGameModeParams(body.event.gameMode);
  resp = await $API().Events.getLeaderboard({ id: body.event.id });
  body = await resp.json();
  //participants.value = body.participants
  dateNow.value = new Date();
  setInterval(() => {
    dateNow.value = new Date()
  }, 1000 * 60 * 5)
})
</script>

<style lang="scss" scoped>
:deep(.header) {
  position: fixed;
}

.top {
  width: 100%;
  height: 250px;
  padding: 52px 0;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("@/assets/imgs/arena-bg.png");
  background-position: center;
  font-family: "Space Mono";
  text-align: center;

  &__heading {
    color: #FFF;
    font-size: 50px;
    font-weight: 400;
    line-height: 50px;
  }

  &__underheading {
    margin: 16px 0 20px;
    color: #FFF;
    font-size: 20px;
    font-weight: 400;
    line-height: normal;
  }

  &__modes {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
}

.mode {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid #FFF;
  color: #FFF;
  font-family: "Space Mono";
  font-size: 14px;
  font-weight: 400;
  line-height: 10px;
}

@keyframes info-move {
  0% {
    margin-left: 0;
  }

  100% {
    margin-left: calc(-25% - 10%);
  }
}

.info {
  width: max-content;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  gap: 10%;
  background: #27F4BA;
  font-family: "Space Mono";

  &__block {
    width: max-content;
    white-space: nowrap;
    color: #181B20;
    font-size: 14px;
    font-weight: 400;
    line-height: normal;

    &:first-of-type {
      transition: .5s;
      animation-name: info-move;
      animation-duration: 10s;
      animation-timing-function: linear;
      animation-fill-mode: both;
      animation-iteration-count: infinite;
    }
  }
}

.main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 50px;
  font-family: "Space Mono";
}

.register {
  display: flex;
  flex-direction: row;

  &__btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 14px;
    background: #1FA2F3;
    color: #FFF;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    cursor: pointer;
  }
}

.progress {
  width: 530px;
  height: 27px;
  display: grid;
  grid-template-columns: 50% 50%;
  margin: auto 20px auto 12px;
  gap: 5px;
  align-items: center;
  color: #FFF;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: "Space Mono";
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;

  &__start {
    text-align: start;
  }

  &__end {
    text-align: end;
  }

  &__bar {
    grid-column: 1 / span 2;
    width: 100%;
    height: 10px;
    position: relative;

    &-active {
      content: '';
      position: absolute;
      height: inherit;
      left: 0;
      width: 60%;
      z-index: 2;
      border-radius: inherit;
      background: #1FA2F3;
    }

    border-radius: 100px;
    background: #385682;
    z-index: 1;
  }
}

.prize {
  font-family: "Space Mono";
  font-feature-settings: 'clig' off, 'liga' off;
  color: #FFF;

  &__heading {
    font-size: 18px;
    font-weight: 700;
    line-height: 100%;
  }

  &__underheading {
    color: #FFF;
    font-size: 14px;
    font-weight: 400;
    line-height: 100%;
  }
}

.rank {
  display: grid;
  grid-template-columns: inherit;

  color: #FFF;
  font-variant-numeric: lining-nums tabular-nums;
  font-size: 14px;
  font-weight: 400;
  line-height: 140%;
  align-items: center;
  gap: 20px;
  padding: 8px 16px;

  >div {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  &__avatar {
    width: 21px;
  }

  &:nth-of-type(2n+1) {
    background: rgba(39, 244, 186, 0.04);
  }

  &s {
    display: flex;
    flex-direction: column;
    grid-template-columns: 50px 300px repeat(3, calc((100% - 350px - 20px * 4) / 3));
    font-family: "Space Mono";
    margin: 0 50px;
    max-height: 50vh;
    overflow: auto;

    &__heading {
      display: grid;
      grid-template-columns: inherit;
      padding: 8px 16px;
      gap: 20px;
      background: #1FA2F3;

      color: #FFF;
      font-variant-numeric: lining-nums tabular-nums;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 140%;
    }
  }
}

@media screen and (max-width: #{map-get($sizes, "tablet") + px}) {
  .top {
    padding: 52px 20px;
  }

  .main {
    padding: 20px;
  }

  .register {
    flex-direction: column;
    gap: 20px;

    &__btn {
      width: 120px;
      margin: auto;
    }
  }

  .progress {
    width: calc(100% - 5px);
    margin: unset;
  }

  .rank {
    align-items: start;

    &s {
      margin: 20px 0;
      grid-template-columns: 20px 160px 50px 50px auto;
    }
  }
}
</style>