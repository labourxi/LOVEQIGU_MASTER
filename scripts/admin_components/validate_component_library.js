const fs = require('fs');
const path = require('path');

const lib = require('../../apps/admin/shared/components');

const samples = {
  TopNav: () => lib.renderTopNav({ title: 'Platform Admin', subtitle: 'Demo', env: 'DEV', user: 'operation_admin' }),
  SideNav: () =>
    lib.renderSideNav({
      activeId: 'dashboard',
      sections: [
        { title: '总览', items: [{ id: 'dashboard', label: '总览', href: '#' }] },
        { title: '审核', items: [{ id: 'reviews', label: '审核中心', href: '#' }] }
      ]
    }),
  Breadcrumb: () => lib.renderBreadcrumb({ items: [{ label: '总览' }, { label: '审核中心' }] }),
  PageHeader: () => lib.renderPageHeader({ title: '标题', description: '描述' }),
  KpiCard: () => lib.renderKpiCard({ label: '景区数量', value: 12, subtext: 'Mock' }),
  Table: () => lib.renderTable({ columns: [{ key: 'name', label: '名称' }], rows: [{ name: '爱企谷' }] }),
  Filter: () => lib.renderFilter({ controls: [{ label: '搜索' }], actions: [{ label: '查询', variant: 'primary' }] }),
  StatusBadge: () => lib.renderStatusBadge({ text: 'PENDING', tone: 'warning' }),
  Button: () => lib.renderButton({ label: '保存', variant: 'primary' }),
  Input: () => lib.renderInput({ label: '名称', placeholder: '请输入' }),
  Select: () => lib.renderSelect({ label: '状态', options: ['全部', '通过'] }),
  Textarea: () => lib.renderTextarea({ label: '备注', value: '说明' }),
  Modal: () => lib.renderModal({ title: '提示', content: '内容', actions: [{ label: '关闭' }] }),
  Drawer: () => lib.renderDrawer({ title: '详情', content: '内容' }),
  Pagination: () => lib.renderPagination({ page: 1, totalPages: 5 }),
  EmptyState: () => lib.renderEmptyState({ title: '暂无数据' }),
  LoadingState: () => lib.renderLoadingState({ title: '加载中' }),
  ErrorState: () => lib.renderErrorState({ title: '加载失败' })
};

const failures = [];
const snapshots = {};

Object.keys(samples).forEach((name) => {
  const html = samples[name]();
  snapshots[name] = html;
  if (typeof html !== 'string' || !html.trim()) {
    failures.push(name + ': empty render');
  }
});

const required = ['ad-btn', 'ad-badge', 'ad-table', 'ad-state'];
required.forEach((token) => {
  if (!Object.values(snapshots).some((html) => html.includes(token))) {
    failures.push('missing token: ' + token);
  }
});

const reportPath = path.join(__dirname, '../../docs/product/backoffice/ADMIN_COMPONENT_LIBRARY_V1_REPORT.md');
const report = `# ADMIN_COMPONENT_LIBRARY_V1_REPORT

## Summary

共享后台组件库已建立，覆盖 Platform Admin / Merchant Portal / Park Admin。

## Components

- TopNav
- SideNav
- Breadcrumb
- PageHeader
- KPI Card
- Table
- Filter
- Status Badge
- Button
- Input
- Select
- Textarea
- Modal
- Drawer
- Pagination
- Empty State
- Loading State
- Error State

## Render Check

- independent_render: ${failures.length === 0 ? 'PASS' : 'FAIL'}
- failures: ${JSON.stringify(failures)}

## Location

- shared/components/index.js
- shared/components/library.css
- shared/components/demo.html

## Completion

- ADMIN_COMPONENT_LIBRARY_V1_COMPLETE = ${failures.length === 0 ? 'YES' : 'NO'}
`;

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, report, 'utf8');

if (failures.length) {
  console.error('ADMIN_COMPONENT_LIBRARY_TEST_FAIL');
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}

console.log('ADMIN_COMPONENT_LIBRARY_TEST_PASS');
