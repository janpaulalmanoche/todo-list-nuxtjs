<template>
  <NuxtLayout>
    <v-app>
      <v-snackbar v-model="snackbar" color="success">
        {{ text }}
        <template v-slot:actions>
          <!-- <v-btn
            color="pink"
            variant="text"
            @click="snackbar = false"
          >
            Close
          </v-btn> -->
        </template>
      </v-snackbar>
      <div class="main-container">
        <div class="content-container">
          <div class="header">
            <v-chip-group>
              <v-chip @click="showTaskDone = false" class="chip">
                Task
                <span v-if="tasks.length > 0" class="chip-count">
                  {{ tasks.filter((i) => i.status == false).length ?? 0 }}
                </span>
              </v-chip>
              <v-chip @click="showTaskDone = true" class="chip">
                Task Done
                <span v-if="tasks.length > 0" class="chip-count">
                  {{ tasks.filter((i) => i.status == true).length ?? 0 }}
                </span>
              </v-chip>
            </v-chip-group>
            <div v-if="idsForUpdate.length > 0 && !showTaskDone" class="button-group">
              <span class="pr-4">Selected {{ idsForUpdate.length }}</span>
              <v-btn class="action-btn" @click="deleteTasks">
                Delete
                <v-icon color="red" size="20">mdi-delete</v-icon>
              </v-btn>
              <v-btn  class="action-btn" @click="updateTasks">
                Mark as done
                <v-icon color="green" size="20">mdi-check-circle</v-icon>
              </v-btn>
            </div>
          </div>
          <div class="task-list">
            <transition-group name="list-transition" tag="div">
              <div v-for="task in showTaskDone ? tasks.filter((i) => i.status == true) : tasks.filter((i) => i.status == false)" :key="task.id" class="task-card">
                <v-card @click="handleClickTask(task.id)" class="w-100 pa-4" :style="{ backgroundColor: idsForUpdate.includes(task.id) || showTaskDone ? '#cacaca' : 'white' }">
                  <div class="task-details">
                    <div class="task-info">
                      <v-icon :style="{ color: idsForUpdate.includes(task.id) ? 'gray' : 'green' }">mdi-check-circle</v-icon>
                      <strong class="ml-4" :style="{ textDecoration: idsForUpdate.includes(task.id) || showTaskDone ? 'line-through' : '' }">{{ task.task }}</strong>
                    </div>
                    <div class="task-actions">
                      <v-btn variant="plain" @click="idsForUpdate.push(task.id), deleteTasks()" v-if="!showTaskDone">
                        <v-icon color="red" size="30">mdi-delete</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </v-card>
              </div>
            </transition-group>
          </div>
          <div class="footer">
            <div class="input-container rounded-pill">
              <v-text-field :loading="loading" label="New Task" variant="" hide-details single-line v-model="taskField"></v-text-field>
              <v-icon class="add-icon cursor-pointer" color="blue" size="40" @click="createTask">mdi-plus-circle</v-icon>
            </div>
          </div>
        </div>
      </div>
    </v-app>
  </NuxtLayout>
</template>

<style scoped>
.main-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #00c58e 0%, #00664f 100%);
  padding: 5rem;
}

.content-container {
  height: 500px;
  width: 600px;
  background-color: #ffff;
  display: flex;
  flex-direction: column;
}

.header {
  height: auto;
  background-color: #e8e8e8;
  display: flex;
  flex-direction: column;
  padding: 10px;
  justify-content: center;
  align-items: 
  flex-end;
}

.chip {
  background-color: blue;
  color: white;
  width: auto;
}

.chip-count {
  align-items: center;
  display: inline-flex;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
  height: 1.25rem;
  justify-content: center;
  min-width: 20px;
  padding: 4px 6px;
  margin-left: 5px;
  text-align: center;
  background: white;
  color: blue;
}

.button-group {
  margin-left: auto;
  display:flex;
  align-items: center;
}

.action-btn {
  margin-right: 10px;
}

.task-list {
  display: flex;
  height: 400px;
  flex-direction: column;
  overflow-y: scroll;
}

.list-transition-enter-active,
.list-transition-leave-active {
  transition: opacity 0.2s ease;
}

.list-transition-enter,
.list-transition-leave-to /* <=2.1.8 compatibility */ {
  opacity: 1;
}

.task-card {
  display: flex;
  justify-content: center;
  padding: 10px;
  width: 100%;
}

.task-details {
  display: flex;
  align-items: center;
}

.task-info {
  display: flex;
}

.task-actions {
  margin-left: auto;
}

.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 15px;
  background: #e8e8e8;
}

.input-container {
  display: flex;
  width: 70%;
  background-color: white;
  padding: 6px;
  align-items: center;
}

.add-icon {
  margin-left: auto;
}

</style>

<script lang="">
import TaskRepository from "./repository/TaskRepository.js";
export default {
  data() {
    return {
      list: [{ id: 1, task: "Learn Vue", status: { done: false } }],
      showTaskDone: false,
      nextItemId: 2,
      tasks: [],
      idsForUpdate: [],
      taskField: "",
      text: "",
      snackbar: false,
    };
  },

  methods: {
    delete(id) {
      this.list = this.list.filter((l) => l.id !== id);
    },
    handleClickTask(id) {
      if (this.showTaskDone) {
        return;
      }
      if (this.idsForUpdate.find((i) => i == id)) {
        this.idsForUpdate = this.idsForUpdate.filter((i) => i != id);
      } else {
        this.idsForUpdate.push(id);
      }
    },
    fetchAllTasks() {
      const repository = new TaskRepository(this.$apollo);
      repository.fetchTasks().then((result) => {
        this.tasks = result.data.tasks;
        this.idsForUpdate = [];
      });
    },
    createTask() {
    if(this.taskField == ""){
      return
    }
      const repository = new TaskRepository(this.$apollo);
      repository.createTask(this.taskField).then((result) => {
        this.text = 'Task created successfully';
        this.snackbar = true;
        this.fetchAllTasks();
        this.taskField = "";
      });
    },
    updateTasks() {
      const repository = new TaskRepository(this.$apollo);
      repository.updateTasks(this.idsForUpdate).then((result) => {
        this.text = 'Tasks mark as done successfully';
        this.snackbar = true;
        this.fetchAllTasks();
      });
    },
    deleteTasks() {
      const repository = new TaskRepository(this.$apollo);
      repository.deleteTasks(this.idsForUpdate).then((result) => {
        this.text = 'Tasks deleted successfully';
        this.snackbar = true;
        this.fetchAllTasks();
      });
    },
    deleteSingleTask() {},
  },

  mounted() {
    this.fetchAllTasks();
  },
};
</script>
