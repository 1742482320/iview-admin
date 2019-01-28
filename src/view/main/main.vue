 <!-- @haidong 主页 -->
<template>
  <!-- @haidong 页面结构组件 -->
  <Layout style="height: 100%" class="main">
    <!-- @haidong 折叠组件 -->
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <!-- @haidong 侧边导航栏 -->
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div>
      </side-menu>
    </Sider>
    <!-- @haidong 内容框架 -->
    <Layout>
      <!-- @haidong 头部 -->
      <Header class="header-con">
        <!-- @haidong 主体盒子的顶部信息 -->
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <!-- @haidong 用户头像 -->
          <user :user-avator="userAvator"/>
          <!-- @haidong 语言 -->
          <language @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>
          <!-- @haidong 放大按钮 -->
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <!-- @haidong 主体盒子 -->
      <Content class="main-content-con">
        <!-- @haidong 主体盒子结构 -->
        <Layout class="main-layout-con">
          <!-- @haidong 标签链接 -->
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <!-- @haidong 主体内容 -->
          <Content class="content-wrapper">
            <!-- @haidong 内容缓存 -->
            <keep-alive :include="cacheList">
              <!-- @haidong 路由视图 -->
              <router-view/>
            </keep-alive>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu' // @haidong 侧边导航栏
import HeaderBar from './components/header-bar' // @haidong 主体顶部
import TagsNav from './components/tags-nav' // @haidong 标签链接
import User from './components/user' // @haidong 用户头像
import Fullscreen from './components/fullscreen' // @haidong 放大按钮
import Language from './components/language' // @haidong 语言类型
import { mapMutations, mapActions } from 'vuex' // @haidong 用户头像
import { getNewTagList, getNextRoute, routeEqual } from '@/libs/util'
import minLogo from '@/assets/images/logo-min.jpg' // @haidong logo
import maxLogo from '@/assets/images/logo.jpg' // @haidong 用户头像
import './main.less'
export default {
  name: 'Main',
  components: { // @haidong 页面的组件
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    User
  },
  data () {
    return {
      collapsed: false, // @haidong 侧边栏折叠变量，false展开，true折叠
      minLogo, // @haidong 折叠后的小logo
      maxLogo, // @haidong 大logo
      isFullscreen: false
    }
  },
  computed: {
    tagNavList () { // @haidong 标签导航的数量，保存在全局变量中
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvator () { // @haidong 获取缓存中的用户头像
      return this.$store.state.user.avatorImgPath
    },
    cacheList () { // @haidong 缓存起来的内容列表
      return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
    },
    menuList () { // @haidong 侧边栏导航列表
      return this.$store.getters.menuList
    },
    local () { // @haidong 语言
      return this.$store.state.app.local
    }
  },
  methods: {
    ...mapMutations([ // @haidong 将methods中的方法映射为store中mutations中的方法
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal'
    ]),
    ...mapActions([ // @haidong 映射actions
      'handleLogin'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      let openName = ''
      if (type === 'all') {
        this.turnToPage('home')
        openName = 'home'
      } else if (routeEqual(this.$route, route)) {
        if (type === 'others') {
          openName = route.name
        } else {
          const nextRoute = getNextRoute(this.tagNavList, route)
          this.$router.push(nextRoute)
          openName = nextRoute.name
        }
      }
      this.setTagNavList(res)
      this.$refs.sideMenu.updateOpenName(openName)
    },
    handleClick (item) {
      this.turnToPage(item)
    }
  },
  watch: {
    '$route' (newRoute) {
      this.setBreadCrumb(newRoute.matched)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.addTag({
      route: this.$store.state.app.homeRoute
    })
    this.setBreadCrumb(this.$route.matched)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 文档提示
    this.$Notice.info({
      title: '想快速上手，去看文档吧',
      duration: 0,
      render: (h) => {
        return h('p', {
          style: {
            fontSize: '13px'
          }
        }, [
          '点击',
          h('a', {
            attrs: {
              href: 'https://lison16.github.io/iview-admin-doc/#/',
              target: '_blank'
            }
          }, 'iview-admin2.0文档'),
          '快速查看'
        ])
      }
    })
  }
}
</script>
