<script setup></script>

<template>
  <main>
    <div class="container">
      <div class="about">
        <img src="@/assets/avatar.png" class="avatar" alt="My Avatar" />
        <div class="author">Chris Wang</div>
        <div class="experience">
          <div class="title">Backend Engineer</div>
          <div class="description">
            who wants to be a Full Stack Engineer :D
          </div>
        </div>
      </div>
      <div class="introduce">
        因抓取資料可能有些許誤差時間，本人本網站不負責你的財務狀況！<br />
        投資有風險，請謹慎理財
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  margin-top: 30px;
  padding: 10px;
  border: solid 1px;
  border-radius: 20px;
  line-height: 40px;
}

@media (max-width: 768px) {
  .about {
    width: 100%;
  }
}
</style>
