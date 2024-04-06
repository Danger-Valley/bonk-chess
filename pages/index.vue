<template>
  <div class="page">
    <Header />

    <main
      class="main"
      v-if="info"
    >
      <div class="main__title">Next tournament in</div>
      <div class="main__time">{{ formatTime }}</div>
      <div class="main__prizes">
        <div>Prize pool: {{ info.event.prizePool.all }}</div>
        <div>Entry: {{ info.event.participationFee }}</div>
        <div>Registered players: {{ info.participantsCount }}</div>
      </div>
      <div
        class="main__btn"
        @click="$router.push(`/events/${info.event.id}`)"
      >
        <template v-if="nextTournamentTime > 1000 * 60 * 60 * 2">
          <template v-if="!info.isRegistered">Register</template>
          <template v-else>Registered</template>
        </template>
        <template v-else>Open tournament</template>
      </div>
    </main>
  </div>
</template>

<script setup>
let nextTournamentTime = ref(null),
  interval = null,
  info = ref(false)

let { $API } = useNuxtApp();

const formatTime = computed(() => {
  if (!nextTournamentTime) return "";

  let days = Math.floor(nextTournamentTime.value / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
    hours = Math.floor((nextTournamentTime.value / (1000 * 60 * 60) % 24)).toString().padStart(2, '0'),
    minutes = Math.floor((nextTournamentTime.value / (1000 * 60 * 24) % 60)).toString().padStart(2, '0'),
    seconds = Math.floor((nextTournamentTime.value / 1000) % 60).toString().padStart(2, '0')

  return `${days} : ${hours} : ${minutes} : ${seconds}`
})

onMounted(async () => {
  let resp = await $API().Events.getBonk({ accessToken: localStorage.getItem('accessToken') });
  let body = await resp.json();

  console.log(body);
  nextTournamentTime.value = new Date(body.event.startAt) - new Date();
  info.value = body;

  interval = setInterval(() => {
    nextTournamentTime.value -= 1000;
  }, 1000)
})
</script>

<style
  lang="scss"
  scoped
>
.page {
  background-color: #F7931A;
}

:deep(.header) {
  position: absolute;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 50px;
  justify-content: center;
  align-items: center;
  height: 100dvh;
  color: #fff;
  font-family: "Poppins";

  &__title {
    font-size: 50px;
    line-height: 1;
  }

  &__time {
    font-size: 100px;
    line-height: 1;
    font-weight: 700;
  }

  &__prizes {
    font-size: 30px;
    line-height: 50px;
    text-align: center;
  }

  &__btn {
    font-family: "Space Mono";
    color: #ff0000;
    font-size: 30px;
    line-height: 1;
    padding: 20px 40px;
    background-color: #fff;
    cursor: pointer;
  }
}
</style>