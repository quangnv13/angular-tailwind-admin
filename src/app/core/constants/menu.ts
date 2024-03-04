import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Quản lý',
      separator: true,
      items: [
        {
          icon: 'fa-duotone fa-grid-horizontal',
          label: 'Tổng quan',
          route: '/manage/dashboard',
        },
        {
          icon: 'fa-sharp fa-solid fa-shirt',
          label: 'Thiết kế',
          route: '/manage/design',
        },
        {
          icon: 'fa-solid fa-file-invoice-dollar',
          label: 'Dropship',
          route: '/manage/dropship',
        },
        {
          icon: 'fa-solid fa-arrow-down-triangle-square',
          label: 'Đơn hàng cần xử lý',
          route: '/manage/process-order',
        },
        {
          icon: 'fa-regular fa-file-invoice',
          label: 'Hoá đơn',
          route: '/manage/invoice',
        },
        {
          icon: 'fa-regular fa-users',
          label: 'Người dùng',
          route: '/manage/user',
        },
      ],
    },
    {
      group: 'Cấu hình',
      separator: false,
      items: [
        {
          icon: 'fa-duotone fa-grid-horizontal',
          label: 'Cài đặt chung',
          route: '/settings',
        },
        {
          icon: 'fa-duotone fa-grid-horizontal',
          label: 'Thông báo',
          route: '/gift',
        },
      ],
    },
  ];
}
