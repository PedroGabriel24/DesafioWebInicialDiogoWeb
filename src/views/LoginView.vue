<template>
  <div class="login-page">
    <div class="login-left">
      <div class="login-left-content">
        <div class="login-logo">
          <img src="../assets/logo.svg" alt="Logo" width="500px" />
        </div>
        <div class="login-welcome">
          <h1>Bem vindo de volta!</h1>
          <p class="login-brand">Plataforma Instituto J&F</p>
          <p class="login-sub">
            Faça login para acessar suas<br />informações escolares
          </p>
        </div>
      </div>
    </div>

    <div class="login-right">
      <div class="login-form-wrapper">
        <h2 class="login-title">Fazer Login</h2>
        <p class="login-subtitle">
          Faça login para acessar suas informações escolares
        </p>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label class="form-label">E-mail</label>
            <div class="form-input">
              <span class="material-icons-outlined icon">mail</span>
              <input
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Senha</label>
            <div class="form-input">
              <span class="material-icons-outlined icon">lock</span>
              <input
                v-model="senha"
                :type="showPw ? 'text' : 'password'"
                placeholder="••••••••••"
                required
              />
              <span
                class="material-icons-outlined icon toggle-pw"
                @click="showPw = !showPw"
              >
                {{ showPw ? "visibility_off" : "visibility" }}
              </span>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary login-btn"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="spinner"
              style="width: 18px; height: 18px; border-width: 2px"
            ></span>
            <span v-else>Entrar</span>
          </button>

          <p v-if="errorMsg" class="login-error">{{ errorMsg }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useToastStore } from "@/stores/toast.store";

const authStore = useAuthStore();
const toast = useToastStore();

const email = ref("");
const senha = ref("");
const showPw = ref(false);
const loading = ref(false);
const errorMsg = ref("");

async function handleLogin() {
  const trimmedEmail = email.value.trim();
  const trimmedSenha = senha.value.trim();

  if (!trimmedEmail || !trimmedSenha) return;

  loading.value = true;
  errorMsg.value = "";
  try {
    await authStore.login(trimmedEmail, trimmedSenha);
    toast.success("Login realizado com sucesso!");
  } catch (err: any) {
    const msg =
      err.response?.data?.message ||
      err.response?.data ||
      "Credenciais inválidas. Tente novamente.";
    errorMsg.value = typeof msg === "string" ? msg : "Erro ao realizar login.";
    toast.error("Falha no login");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
}

.login-left {
  width: 42%;
  background: linear-gradient(160deg, #2d3de1 0%, #1a2494 60%, #0f1660 100%);
  display: flex;
  align-items: flex-end;
  padding: 60px 48px;
  position: relative;
  overflow: hidden;
  border-radius: 0 40px 40px 0;
}
.login-left::before {
  content: "";
  position: absolute;
  top: -20%;
  right: -30%;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 50%;
}
.login-left-content {
  position: relative;
  z-index: 1;
}
.login-logo {
  position: absolute;
  top: -340px;
  left: 0;
}
.login-welcome h1 {
  font-size: 34px;
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 8px;
}
.login-brand {
  font-weight: 700;
  font-size: 15px;
  color: #fff;
  margin-bottom: 8px;
}
.login-sub {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: var(--bg-white);
}
.login-form-wrapper {
  width: 100%;
  max-width: 420px;
}
.login-title {
  font-size: 30px;
  font-weight: 800;
  color: var(--primary);
  text-align: center;
  margin-bottom: 6px;
}
.login-subtitle {
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 36px;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.toggle-pw {
  cursor: pointer;
  font-size: 18px;
}
.toggle-pw:hover {
  color: var(--primary);
}
.login-btn {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 700;
  border-radius: var(--radius-md);
  margin-top: 8px;
}
.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.login-error {
  background: #fee2e2;
  color: #dc2626;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  text-align: center;
}

@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }
  .login-left {
    width: 100%;
    border-radius: 0 0 32px 32px;
    padding: 40px 24px;
    min-height: 200px;
    align-items: center;
    justify-content: center;
  }
  .login-logo {
    display: none;
  }
  .login-welcome {
    text-align: center;
  }
  .login-welcome h1 {
    font-size: 24px;
  }
  .login-right {
    padding: 24px 20px;
  }
  .login-title {
    font-size: 24px;
  }
  .login-subtitle {
    margin-bottom: 24px;
  }
}
</style>
