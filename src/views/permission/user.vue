<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddUser">New User</el-button>

    <el-table :data="userList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="User Key" width="220">
        <template slot-scope="scope">
          {{ scope.row.userId }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="User Name" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="User Account">
        <template slot-scope="scope">
          {{ scope.row.account }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="User email">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Role">
        <template slot-scope="scope">
          {{ scope.row.role.roleName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit User':'New User'">
      <el-form :model="user" label-width="80px" label-position="left">
        <el-form-item label="userId" v-if="dialogType=='edit'">
          <el-input v-model="user.userId" placeholder="userId" :disabled="true" />
        </el-form-item>
        <el-form-item label="name">
          <el-input v-model="user.name" placeholder="name" />
        </el-form-item>
        <el-form-item label="account">
          <el-input v-model="user.account" placeholder="account" />
        </el-form-item>
        <el-form-item label="password" v-if="dialogType=='new'">
          <el-input v-model="user.password" placeholder="password" />
        </el-form-item>
        <el-form-item label="email">
          <el-input v-model="user.email" placeholder="email" />
        </el-form-item>
        <el-form-item label="Menus">
          <el-radio-group v-model="user.radio">
            <el-radio :label="1">admin</el-radio>
            <el-radio :label="2">editor</el-radio>
            <el-radio :label="3">visitor</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getAllUser, deleteRole, updateRole } from '@/api/role'
import { register } from '@/api/user'

const defaultUser = {
  userId: '',
  name: '',
  email: '',
  role: {},
  account: '',
  radio: '',
  password: ''
}

export default {
  data() {
    return {
      user: Object.assign({}, defaultUser),
      routes: [],
      userList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // get all routes and roles list from server
    this.getRoles()
  },
  methods: {
    async getRoles() {
      const res = await getAllUser()
      console.log(res)
      this.userList = res.data
    },
    handleAddUser() {
      this.user = Object.assign({}, defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.user = deepClone(scope.row)
      this.$nextTick(() => {
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the user?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async() => {
        await deleteRole(row.key)
        this.userList.splice($index, 1)
        this.$message({
          type: 'success',
          message: 'Delete succed!'
        })
      }).catch(err => { console.error(err) })
    },
    confirmRole() {
      console.log(this.user)
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        updateRole(this.user).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: 'Success',
              dangerouslyUseHTMLString: true,
              message: `修改成功`,
              type: 'success'
            })
            this.dialogVisible = false
            // this.$router.go(0)
          } else {
            this.$notify({
              title: 'Error',
              dangerouslyUseHTMLString: true,
              message: `修改失败`,
              type: 'error'
            })
          }
        })
      } else {
        register(this.user).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: 'Success',
              dangerouslyUseHTMLString: true,
              message: `成功添加用户`,
              type: 'success'
            })
            this.dialogVisible = false
            this.$router.go(0)
          } else {
            this.$notify({
              title: 'Error',
              dangerouslyUseHTMLString: true,
              message: `添加用户失败`,
              type: 'error'
            })
            this.dialogVisible = false
            this.$router.go(0)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
