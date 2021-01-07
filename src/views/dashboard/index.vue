<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="18" :xs="24">
          <el-card>
            <blog-list/>
          </el-card>
        </el-col>

        <el-col :span="6" :xs="24">
          <user-card :user="user"/>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import BlogList from './components/BlogList'

export default {
  name: 'Profile',
  components: { UserCard, BlogList },
  data() {
    return {
      user: {},
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'email',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: this.email,
        avatar: this.avatar.replace(new RegExp('\\\\', 'g'), '/')
      }
    }
  }
}
</script>
