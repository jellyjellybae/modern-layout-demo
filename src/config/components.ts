import type { ComponentDefinition } from '@/types/layout'

export const componentDefinitions: ComponentDefinition[] = [
  {
    type: 'container',
    name: '容器',
    icon: 'Grid',
    category: 'layout',
    defaultProps: {},
    defaultStyle: {
      width: 'auto',
      minWidth: '200px',
      minHeight: '100px',
      padding: '16px',
      border: '1px dashed #ccc',
      borderRadius: '4px'
    },
    propsSchema: {
      direction: { type: 'select', options: ['row', 'column'], default: 'column' }
    },
    allowChildren: true
  },
  {
    type: 'button',
    name: '按钮',
    icon: 'Pointer',
    category: 'basic',
    defaultProps: {
      text: '按钮',
      type: 'primary',
      size: 'default'
    },
    defaultStyle: {
      margin: '8px'
    },
    propsSchema: {
      text: { type: 'string', default: '按钮' },
      type: { type: 'select', options: ['primary', 'success', 'warning', 'danger', 'info'], default: 'primary' },
      size: { type: 'select', options: ['large', 'default', 'small'], default: 'default' }
    },
    allowChildren: false
  },
  {
    type: 'input',
    name: '输入框',
    icon: 'EditPen',
    category: 'form',
    defaultProps: {
      placeholder: '请输入内容',
      type: 'text'
    },
    defaultStyle: {
      width: '200px',
      margin: '8px'
    },
    propsSchema: {
      placeholder: { type: 'string', default: '请输入内容' },
      type: { type: 'select', options: ['text', 'password', 'number', 'email'], default: 'text' }
    },
    allowChildren: false
  },
  {
    type: 'text',
    name: '文本',
    icon: 'Document',
    category: 'basic',
    defaultProps: {
      content: '文本内容',
      tag: 'span'
    },
    defaultStyle: {
      margin: '8px'
    },
    propsSchema: {
      content: { type: 'string', default: '文本内容' },
      tag: { type: 'select', options: ['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'], default: 'span' }
    },
    allowChildren: false
  },
  {
    type: 'image',
    name: '图片',
    icon: 'Picture',
    category: 'media',
    defaultProps: {
      src: 'https://via.placeholder.com/200x150',
      alt: '图片'
    },
    defaultStyle: {
      width: '200px',
      height: '150px',
      margin: '8px'
    },
    propsSchema: {
      src: { type: 'string', default: 'https://via.placeholder.com/200x150' },
      alt: { type: 'string', default: '图片' }
    },
    allowChildren: false
  },
  {
    type: 'card',
    name: '卡片',
    icon: 'Tickets',
    category: 'layout',
    defaultProps: {
      title: '卡片标题'
    },
    defaultStyle: {
      width: '300px',
      margin: '8px'
    },
    propsSchema: {
      title: { type: 'string', default: '卡片标题' }
    },
    allowChildren: true,
    slots: ['header', 'default', 'footer']
  }
]