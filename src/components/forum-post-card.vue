<template>
  <v-card v-if="hasContent" flat tile>
    <!-- headers -->
    <v-row>
      <v-card-subtitle>
        <span :class="{ 'floor-master': content.floor === 1 }">#{{ content.floor }}</span>
        &nbsp;·&nbsp;
        <router-link
          :to="`/${content.author.type}s/${content.author.username}`"
          :style="`color: ${contentColor} !important;`"
        >
          {{ content.author.username }}
        </router-link>
        &nbsp;·&nbsp;
        {{ timestamp }}
      </v-card-subtitle>
      <v-spacer/>
      <v-btn icon small depressed
        @click="handleAction('edit', content._id)"
        :color="contentColor"
        class="mr-3 mt-3"
        v-if="editable && post"
      >
        <v-icon size="30">mdi-pencil</v-icon>
      </v-btn>
      <v-dialog :scrollable="false" v-model="deleteDialogShow" max-width="410px" :retain-focus="false">
        <template v-slot:activator="{ on1 }">
          <v-btn icon small depressed
            v-on="on1"
            slot = "activator"
            @click="openDeleteDialog()"
            v-if="editable && post"
            :color="contentColor"
            class="mr-3 mt-3"
          >
            <v-icon size="30">mdi-delete</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            Are you sure want to delete the post?
          </v-card-title>
          <v-card-subtitle>
            Please press YES to confirm.
          </v-card-subtitle>
          <v-btn
            text
            @click="handleAction('delete', content._id)"
            :color="contentColor"
            class="ml-2"
          >
            Yes
          </v-btn>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- if content is quoting a reply -->
    <blockquote v-if="content.parent" class="px-4">
      <v-card color="#F5F5F5" outlined>
        <v-card-text v-html="content.parent.content" class="py-3 editor-content" />
      </v-card>
    </blockquote>
    <!-- main content -->
    <v-card-text class="black--text editor-content" v-html="content.content" />
    <!-- action buttons here -->
    <v-card-actions>
      <v-card color="#F5F5F5" class="caption" outlined>
        <v-btn icon small depressed
          @click="emitReaction('liked', content._id, !reactions.liked)"
          :color="reactions.liked ? contentColor : ''"
        >
          <v-icon size="15">mdi-thumb-up</v-icon>
        </v-btn>
        <span class="pl-n2">{{ content.nLikes }}</span>
        <v-btn icon small depressed
          @click="emitReaction('disliked', content._id, !reactions.disliked)"
          :color="reactions.disliked ? contentColor : ''"
        >
          <v-icon size="15">mdi-thumb-down</v-icon>
        </v-btn>
        <span class="pl-n2 pr-2">{{ content.nDislikes }}</span>
      </v-card>
      <v-card color="#F5F5F5" class="caption" outlined>
        <v-dialog :fullscreen="true" v-if="reactable" :scrollable="false" v-model="replyDialogShow" max-width="800px" :retain-focus="false">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" slot = "activator" icon small depressed @click="openDialog(content._id, post)">
              <v-icon size="15">mdi-chat</v-icon>
            </v-btn>
            <span v-if="numberOfComments" class="pl-n2 pr-2">{{ numberOfComments }}</span>
            <span v-else class="pl-n2 pr-2"> {{ content.nComments}} </span>
          </template>
          <v-card>
            <div class="row">
              <v-card-title primary-title class="ml-3">
                Replies
              </v-card-title>
              <v-spacer></v-spacer>
              <v-btn class="mr-12 mt-3" :color="contentColor" icon large  v-on:click="closeDialog()">
                <v-icon size="50">mdi-close</v-icon>
              </v-btn>
            </div>
            <v-divider></v-divider>
            <reply-post
              :cid="cid"
              :commentsinDialog="commentsinDialog"
              :post="post"
              :content="content"
              @load-page="loadCommentPage"
              @page-change="changeCommentPage"
              class="mt-2 mb-2"
            />
            <v-container>
              <v-row>
                <v-col cols="12" md="11">
                  <text-editor v-model="comment"/>
                </v-col>
                <v-col cols="12" md="1" align-self="end">
                  <v-btn class="ml-2 mt-5" icon small depressed :color="contentColor" v-on:click="replyPost('comment', content._id, comment)">
                    <v-icon dark>mdi-send</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-dialog>
      </v-card>
    </v-card-actions>
  </v-card>
</template>

<script>
import utils from '@/utils/forum'
import ReplyPost from './forum-post-reply.vue'
import http from '@/utils/http'
import TextEditor from '@/components/text-editor.vue'

export default {
  components: {
    ReplyPost, TextEditor
  },
  props: {
    numberOfComments: {
      type: Number,
      required: false
    },
    post: {
      type: Boolean,
      required: false,
      default: false
    },
    content: {
      type: Object,
      required: true
    },
    reactable: {
      type: Boolean,
      required: false,
      default: false
    },
    editable: {
      type: Boolean,
      required: false,
      default: false
    },
    postinfo: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    cid: 0,
    commentscrollHistory: {},
    commentsinDialog: {
      comments: [],
      parent: {
        nComments: 0,
        author: {
          _id: '',
          username: '',
          type: '',
          src: ''
        },
        content: '',
        updatedAt: '',
        createdAt: '',
        nLikes: '',
        nDislikes: '',
        liked: false,
        disliked: false,
        floor: 1
      },
      loadedPages: {},
      page: 1,
      pages: 1
    },
    reactions: {
      liked: false,
      disliked: false
    },
    replyDialogShow: false,
    deleteDialogShow: false,
    comment: ''
  }),
  computed: {
    hasContent () {
      return !!Object.keys(this.content).length
    },
    contentColor () {
      return utils.getPostColor(this.content.author)
    },
    timestamp () {
      return utils.getPostTimestamp(this.content.createdAt)
    }
  },
  methods: {
    async loadCommentPage (page, container) {
      console.log(this.commentsinDialog.page)
      const result = await this.fetchComments({ id: this.postinfo._id, page: page, reply: this.cid })
      console.log(result)
      console.log(this.commentsinDialog)
      if (result.page > this.commentsinDialog.page) this.commentsinDialog.comments.push(...result.comments)
      if (result.page < this.commentsinDialog.page) this.commentsinDialog.comments = [ ...result.comments, ...this.commentsinDialog.comments ]
      console.log(this.commentsinDialog.comments)
      if (result.page < this.commentsinDialog.page && container) {
        const initHeight = container.scrollHeight
        await this.$nextTick()
        container.scrollTop = container.scrollHeight - initHeight
      }
      // this.scroll('#post-comment-0', '#post-display-container')
      this.commentsinDialog.loadedPages[result.page] = result.comments
      this.commentsinDialog.page = result.page
    },
    async fetchComments (options = {}) {
      const { id, page, size = 10, reply } = options
      return new Promise((resolve, reject) => {
        http.getComments({ id, page, size, reply })
          .then(({ data }) => resolve(data))
          .catch(() => reject(new Error('error fetching comments')))
      })
    },
    async openDialog (cid, isPost) {
      this.cid = cid
      if (this.reactable === true) {
        this.replyDialogShow = true
      }
      if (isPost === false) {
        return new Promise((resolve, reject) => {
          http.getComments({ id: this.postinfo._id, page: 1, size: 10, reply: cid })
            .then(({ data }) => {
              this.commentsinDialog = {
                comments: data.comments,
                page: data.page,
                pages: data.pages,
                parent: data.parent,
                loadedPages: { 1: data.comments }
              }
              console.log(data)
              resolve(data)
            })
            .catch(() => reject(new Error('error fetching comments')))
        })
      }
    },
    emitReaction (reaction, target, value) {
      this.reactable
        ? this.$emit('react', reaction, { _id: target, type: this.post ? 'post' : 'comment' }, value)
        : this.$emit('denied')
    },
    replyPost (reaction, target, comment) {
      if (this.comment.length !== 0) {
        this.replyDialogShow = false
        this.reactable
          ? this.$emit('react', reaction, { _id: target, type: this.post ? 'post' : 'comment' }, comment)
          : this.$emit('denied')
        this.comment = ''
      }
    },
    async changeCommentPage (newPage) {
      this.commentsinDialog.page = newPage
    },
    scroll (target) {
      const scrollOptions = {
        duration: 1000,
        offset: 0,
        easing: 'easeInOutCubic',
        container: '#comment-display-container'
      }
      console.log(target)
      this.$vuetify.goTo(target, scrollOptions)
    },
    closeDialog () {
      this.replyDialogShow = false
      this.comment = ''
    },
    openDeleteDialog () {
      this.deleteDialogShow = true
    },
    handleAction (action, target) {
      this.$emit('action', action, target)
      if (action === 'delete') this.deleteDialogShow = false
    }
  },
  watch: {
    content: {
      immediate: true,
      deep: true,
      handler () {
        this.reactions = {
          liked: this.content.liked,
          disliked: this.content.disliked
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .floor-master
    color: #ea9085
</style>