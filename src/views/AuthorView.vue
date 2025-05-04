<script setup></script>

<template>
  <main>
    <div class="container">
      <div class="about">
        <img src="@/assets/avatar.png" class="avatar" alt="My Avatar" />
        <div class="author">Chris Wang</div>
        <div class="experience">
          <div class="title">Full Stack Engineer</div>
          <div class="description">who owns a warm indoor garden :D</div>
        </div>
      </div>
      <div class="introduce">
        <h2>免責聲明</h2>
        <br />
        1. 本網站為個人使用<br />
        2. 因抓取資料可能有些許誤差時間，本人本網站不負責你的財務狀況！<br />
        3. 投資有風險，請謹慎理財
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 1440px;
  display: flex;
  justify-content: space-around;
  text-align: center;
  width: 80%;
  margin: auto;
  flex-wrap: wrap;
}

.about {
  width: 50%;
  margin-top: 60px;
  padding-bottom: 30px;
}

.about .avatar {
  border-radius: 50%;
  width: 200px;
  height: 200px;
}

.about .author {
  font-size: 20px;
  margin: 10px;
}

.about .experience {
  margin-top: 10px;
}

.experience .description {
  color: #979797;
  font-style: italic;
  font-size: 14px;
}

.introduce {
  width: 50%;
  margin-top: 30px;
  padding: 10px;
  border: solid 1px;
  border-radius: 20px;
  line-height: 40px;
  background-color: #896d7a;
}

@media (max-width: 768px) {
  .about {
    width: 100%;
  }

  .introduce {
    width: 100%;
  }
}
</style>
