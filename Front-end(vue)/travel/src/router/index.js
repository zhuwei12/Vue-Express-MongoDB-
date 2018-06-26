import Vue from 'vue'
import Router from 'vue-router'

import TakePerson from '@/views/TakePerson'
import TPublish from '@/views/Publish'
import Self from '@/views/Self'
import Detail from '@/views/Detail'
import Message from '@/views/Message'
import Notes from '@/views/Notes'
import MessageDetail from '@/views/MessageDetail'
import Error from '@/views/Error'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TakePerson',
      component: TakePerson
    },
    {
      path: '/publish',
      name: 'Publish',
      component: TPublish
    },
    {
      path: '/self',
      name: 'Self',
      component: Self
    },
    {
      path: '/detail',
      name: 'Detail',
      component: Detail
    },
    {
      path: '/message',
      name: 'Message',
      component: Message
    },
    {
      path: '/notes',
      name: 'Notes',
      component: Notes
    },
    {
      path: '/messageDetail',
      name: 'MessageDetail',
      component: MessageDetail
    },
    {
      path:'/error',
      name:'Error',
      component: Error
    }
  ]
})
