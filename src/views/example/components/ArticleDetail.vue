<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-button v-if="!isEdit" v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          Publish
        </el-button>
        <el-button v-if="isEdit" v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          Update
        </el-button>
        <el-button v-loading="loading" type="warning" @click="deleteForm">
          Delete
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <!--          <Warning />-->
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="blogTitle">
              <MDinput v-model="postForm.blogTitle" :maxlength="100" name="name" required>
                Title
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>

        <!--            <div class="postInfo-container">-->
        <!--              <el-row>-->
        <!--                <el-col :span="8">-->
        <!--                  <el-form-item label-width="60px" label="Author:" class="postInfo-container-item">-->
        <!--                    <el-select v-model="postForm.author" :remote-method="getRemoteUserList" filterable default-first-option remote placeholder="Search user">-->
        <!--                      <el-option v-for="(item,index) in userListOptions" :key="item+index" :label="item" :value="item" />-->
        <!--                    </el-select>-->
        <!--                  </el-form-item>-->
        <!--                </el-col>-->

        <!--                <el-col :span="10">-->
        <!--                  <el-form-item label-width="120px" label="Publish Time:" class="postInfo-container-item">-->
        <!--                    <el-date-picker v-model="displayTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Select date and time" />-->
        <!--                  </el-form-item>-->
        <!--                </el-col>-->

        <!--                <el-col :span="6">-->
        <!--                  <el-form-item label-width="90px" label="Importance:" class="postInfo-container-item">-->
        <!--                    <el-rate-->
        <!--                      v-model="postForm.importance"-->
        <!--                      :max="3"-->
        <!--                      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"-->
        <!--                      :low-threshold="1"-->
        <!--                      :high-threshold="3"-->
        <!--                      style="display:inline-block"-->
        <!--                    />-->
        <!--                  </el-form-item>-->
        <!--                </el-col>-->
        <!--              </el-row>-->
        <!--            </div>-->
        <!--          </el-col>-->
        <!--        </el-row>-->

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.blogContent" :height="400"/>
        </el-form-item>

        <el-form-item prop="image_uri" style="margin-bottom: 30px;">
          <Upload v-model="postForm.image_uri"/>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchBLog, createBlog, deleteBlog, updateBlog } from '@/api/blog'
import MDinput from '@/components/MDinput'
// import { searchUser } from '@/api/remote-search'
// import Warning from './Warning'
// import { validURL } from '@/utils/validate'

const defaultForm = {
  status: 'draft',
  userAvatar: '',
  blogTitle: '', // 文章题目
  blogContent: '', // 文章内容
  image_uri: '', // 文章图片
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false
  // importance: 0
}

export default {
  name: 'ArticleDetail',
  // components: { Tinymce, MDinput, Upload, Sticky, Warning },
  components: { Tinymce, Upload, Sticky, MDinput },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        blogTitle: [{ validator: validateRequire }],
        blogContent: [{ validator: validateRequire }]
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
  },
  methods: {
    fetchData(id) {
      fetchBLog(id).then(response => {
        this.postForm = response.data

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.blogId}`
    },
    submitForm() {
      if (!this.isEdit) {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            createBlog(this.postForm).then(res => {
              if (res.code === 0) {
                this.loading = true
                this.$notify({
                  title: '成功',
                  message: '发布文章成功',
                  type: 'success',
                  duration: 2000
                })
                this.postForm.status = 'published'
                this.loading = false
              }
              console.log(res)
            }).catch(err => {
              console.log(err)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            updateBlog(this.postForm).then(res => {
              if (res.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                })
                this.$router.push('/example/list')
              } else {
                this.$notify({
                  title: '失败',
                  message: '更新失败',
                  type: 'error',
                  duration: 2000
                })
                this.$router.push('/example/list')
              }
            })
          }
        })
      }
    },
    deleteForm() {
      const id = this.$route.params && this.$route.params.id
      deleteBlog(id).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: '成功',
            message: '成功删除',
            type: 'success',
            duration: 2000
          })
          this.$router.push('/example/list')
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
