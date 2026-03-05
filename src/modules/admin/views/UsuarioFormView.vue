<template>
  <div>
    <div class="page-banner">
      <h1>{{ isEditing ? "Editar Usuário" : "Criar Novo Usuário" }}</h1>
      <p>
        {{
          isEditing
            ? "Atualize os dados do usuário."
            : "Preencha os dados para cadastrar um novo usuário."
        }}
      </p>
    </div>

    <div class="form-container">
      <div class="form-card card">
        <div class="card-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nome *</label>
                <div class="form-input">
                  <span class="material-icons-outlined icon">person</span>
                  <input
                    v-model="form.nome"
                    placeholder="Nome completo"
                    required
                  />
                </div>
              </div>
              <div class="form-group" v-if="isEditing">
                <label class="form-label">E-mail *</label>
                <div class="form-input">
                  <span class="material-icons-outlined icon">mail</span>
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">CPF</label>
                <div class="form-input">
                  <span class="material-icons-outlined icon">badge</span>
                  <input v-model="form.cpf" placeholder="000.000.000-00" />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Tipo *</label>
                <select class="form-select w-full" v-model="form.tipo" required>
                  <option value="">Selecionar tipo</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="PROFESSOR">Professor</option>
                  <option value="ALUNO">Aluno</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Telefone *</label>
                <div class="form-input">
                  <span class="material-icons-outlined icon">phone</span>
                  <input
                    v-model="form.telefone"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Data de Nascimento *</label>
                <div class="form-input">
                  <span class="material-icons-outlined icon">calendar_today</span>
                  <input v-model="form.nascimento" type="date" required />
                </div>
              </div>
            </div>

            <div class="form-actions mt-lg">
              <router-link to="/admin/usuarios" class="btn btn-outline"
                >Cancelar</router-link
              >
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span
                  v-if="saving"
                  class="spinner"
                  style="width: 16px; height: 16px; border-width: 2px"
                ></span>
                <span v-else>{{ isEditing ? "Atualizar" : "Cadastrar" }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { adminService } from "@/api/services/admin.service";
import { useToastStore } from "@/stores/toast.store";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const saving = ref(false);
const isEditing = computed(() => !!route.params.id);

const form = ref({
  nome: "",
  email: "",
  senha: "",
  cpf: "",
  tipo: "",
  telefone: "",
  nascimento: "",
});

onMounted(async () => {
  if (!isEditing.value) return;
  try {
    const user = await adminService.obterUsuarioPorId(Number(route.params.id));
    form.value = {
      nome: user.nome,
      email: user.email,
      senha: "",
      cpf: user.cpf || "",
      tipo: user.tipo,
      telefone: user.telefone || "",
      nascimento: user.nascimento || "",
    };
  } catch {
    toast.error("Erro ao carregar dados do usuário");
  }
});

async function handleSubmit() {
  saving.value = true;
  try {
    if (isEditing.value) {
      await adminService.atualizarUsuario(Number(route.params.id), form.value);
      toast.success("Usuário atualizado!");
    } else {
      await adminService.criarUsuario(form.value);
      toast.success("Usuário cadastrado!");
    }
    router.push("/admin/usuarios");
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Erro ao salvar usuário");
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.form-container {
  margin-top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--bg-white);
}
.form-card {
  width: 100%;
  max-width: 700px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .form-container {
    padding: 16px;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-actions {
    flex-direction: column;
  }
  .form-actions .btn {
    width: 100%;
  }
}
</style>
