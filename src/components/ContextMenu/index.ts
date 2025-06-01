import ContextMenu, { MenuItem } from '@imengyu/vue3-context-menu'
import { h } from 'vue'

export interface IContextMenuOptions {
  event: MouseEvent,
  menuList: Array<IMenuItem>,
}

export interface IMenuItem extends MenuItem {
  textType: string,
  label: string,
}

export const showContextMenu = ({ event, menuList }: IContextMenuOptions) => {
  const items = menuList.map((item: IMenuItem) => {
    return {
      label: h('p', {class: ['menu-text', {red: item.textType === 'danger'}]}, item.label),
      onClick: item.onClick,
    }
  })

  ContextMenu.showContextMenu({
    x: event.x,
    y: event.y,
    items: items,
  })
}
