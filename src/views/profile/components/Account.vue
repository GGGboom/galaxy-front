<template>
  <el-form>
    <el-form-item label="Name">
      <el-input v-model.trim="user.name"/>
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="user.email"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateInfo } from '@/api/user'

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  methods: {
    submit() {
      console.log(this.user)
      updateInfo({ name: this.user.name, email: this.user.email }).then(res => {
        if (res.code === 0) {
          this.$message.success(res.message)
          setTimeout(() => {
            this.$router.push(0)
          }, 1.5 * 1000)
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    }
  }
}
</script>
