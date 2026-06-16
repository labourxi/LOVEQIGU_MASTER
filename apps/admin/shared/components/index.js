(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.AdminComponentLibrary = api;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function escapeHtml(value) {
    return String(value === undefined || value === null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function attr(name, value) {
    if (value === undefined || value === null || value === false) {
      return '';
    }
    if (value === true) {
      return ' ' + name;
    }
    return ' ' + name + '="' + escapeHtml(value) + '"';
  }

  function classes(base, modifiers) {
    const list = [base].concat((modifiers || []).filter(Boolean));
    return list.join(' ');
  }

  function renderButton(options) {
    const props = options || {};
    const tag = props.href ? 'a' : 'button';
    const cls = classes('ad-btn', [
      props.variant ? 'ad-btn--' + props.variant : '',
      props.size ? 'ad-btn--' + props.size : '',
      props.block ? 'ad-btn--block' : ''
    ]);
    const content = escapeHtml(props.label || props.text || 'Button');
    if (tag === 'a') {
      return '<a class="' + cls + '"' + attr('href', props.href) + '>' + content + '</a>';
    }
    return (
      '<button class="' +
      cls +
      '"' +
      attr('type', props.type || 'button') +
      attr('disabled', props.disabled) +
      '>' +
      content +
      '</button>'
    );
  }

  function renderStatusBadge(options) {
    const props = options || {};
    return (
      '<span class="' +
      classes('ad-badge', [props.tone ? 'ad-badge--' + props.tone : '']) +
      '">' +
      escapeHtml(props.text || '') +
      '</span>'
    );
  }

  function renderInput(options) {
    const props = options || {};
    return (
      '<label class="ad-field">' +
      (props.label ? '<span class="ad-field__label">' + escapeHtml(props.label) + '</span>' : '') +
      '<input class="ad-input"' +
      attr('type', props.type || 'text') +
      attr('placeholder', props.placeholder) +
      attr('value', props.value) +
      attr('disabled', props.disabled) +
      ' />' +
      (props.hint ? '<span class="ad-field__hint">' + escapeHtml(props.hint) + '</span>' : '') +
      '</label>'
    );
  }

  function renderSelect(options) {
    const props = options || {};
    const items = (props.options || [])
      .map(function (item) {
        const value = typeof item === 'object' ? item.value : item;
        const label = typeof item === 'object' ? item.label : item;
        const selected = props.value !== undefined && props.value === value;
        return '<option' + attr('value', value) + attr('selected', selected) + '>' + escapeHtml(label) + '</option>';
      })
      .join('');
    return (
      '<label class="ad-field">' +
      (props.label ? '<span class="ad-field__label">' + escapeHtml(props.label) + '</span>' : '') +
      '<select class="ad-select"' +
      attr('disabled', props.disabled) +
      '>' +
      items +
      '</select>' +
      (props.hint ? '<span class="ad-field__hint">' + escapeHtml(props.hint) + '</span>' : '') +
      '</label>'
    );
  }

  function renderTextarea(options) {
    const props = options || {};
    return (
      '<label class="ad-field">' +
      (props.label ? '<span class="ad-field__label">' + escapeHtml(props.label) + '</span>' : '') +
      '<textarea class="ad-textarea"' +
      attr('placeholder', props.placeholder) +
      attr('disabled', props.disabled) +
      '>' +
      escapeHtml(props.value || '') +
      '</textarea>' +
      (props.hint ? '<span class="ad-field__hint">' + escapeHtml(props.hint) + '</span>' : '') +
      '</label>'
    );
  }

  function renderTopNav(options) {
    const props = options || {};
    const actions = (props.actions || [])
      .map(function (item) {
        return renderButton(item);
      })
      .join('');
    return (
      '<header class="ad-topnav">' +
      '<div class="ad-topnav__brand">' +
      '<div class="ad-topnav__logo">' + escapeHtml((props.brand || 'A').slice(0, 1)) + '</div>' +
      '<div>' +
      '<div class="ad-topnav__title">' + escapeHtml(props.title || 'Backoffice') + '</div>' +
      '<div class="ad-topnav__subtitle">' + escapeHtml(props.subtitle || 'Mock-first admin console') + '</div>' +
      '</div>' +
      '</div>' +
      '<div class="ad-topnav__meta">' +
      (props.env ? renderStatusBadge({ text: props.env, tone: 'accent' }) : '') +
      (props.user ? renderStatusBadge({ text: props.user, tone: 'neutral' }) : '') +
      actions +
      '</div>' +
      '</header>'
    );
  }

  function renderSideNav(options) {
    const props = options || {};
    const sections = (props.sections || [])
      .map(function (section) {
        const items = (section.items || [])
          .map(function (item) {
            const active = props.activeId && props.activeId === item.id ? ' is-active' : '';
            return (
              '<a class="ad-sidenav__link' +
              active +
              '"' +
              attr('href', item.href || '#') +
              '>' +
              escapeHtml(item.label || item.id || '') +
              '</a>'
            );
          })
          .join('');
        return (
          '<div class="ad-sidenav__group">' +
          '<div class="ad-sidenav__group-title">' +
          escapeHtml(section.title || '') +
          '</div>' +
          '<div class="ad-sidenav__items">' +
          items +
          '</div>' +
          '</div>'
        );
      })
      .join('');
    return '<aside class="ad-sidenav">' + sections + '</aside>';
  }

  function renderBreadcrumb(options) {
    const items = (options && options.items) || [];
    return (
      '<nav class="ad-breadcrumb">' +
      items
        .map(function (item, index) {
          const isLast = index === items.length - 1;
          return (
            '<span class="ad-breadcrumb__item' +
            (isLast ? ' is-current' : '') +
            '">' +
            escapeHtml(item.label || '') +
            '</span>'
          );
        })
        .join('<span class="ad-breadcrumb__sep">/</span>') +
      '</nav>'
    );
  }

  function renderPageHeader(options) {
    const props = options || {};
    const actions = (props.actions || []).map(function (item) {
      return renderButton(item);
    }).join('');
    return (
      '<section class="ad-page-header">' +
      '<div class="ad-page-header__body">' +
      '<h1>' + escapeHtml(props.title || '') + '</h1>' +
      (props.description ? '<p>' + escapeHtml(props.description) + '</p>' : '') +
      '</div>' +
      (actions ? '<div class="ad-page-header__actions">' + actions + '</div>' : '') +
      '</section>'
    );
  }

  function renderKpiCard(options) {
    const props = options || {};
    const valueCls = props.valueTone ? ' ad-kpi__value--' + props.valueTone : '';
    return (
      '<article class="ad-kpi">' +
      '<div class="ad-kpi__label">' + escapeHtml(props.label || '') + '</div>' +
      '<div class="ad-kpi__value' + valueCls + '">' + escapeHtml(props.value === undefined ? '—' : props.value) + '</div>' +
      (props.subtext ? '<div class="ad-kpi__subtext">' + escapeHtml(props.subtext) + '</div>' : '') +
      '</article>'
    );
  }

  function renderTable(options) {
    const props = options || {};
    const columns = props.columns || [];
    const rows = props.rows || [];
    const density = props.density === 'compact' ? ' ad-table--compact' : '';
    const sticky = props.stickyHeader ? ' ad-table--sticky' : '';
    const wrapSticky = props.stickyHeader ? ' ad-table-wrap--sticky' : '';
    function normalizeCell(value) {
      if (value && typeof value === 'object') {
        if (typeof value.html === 'string') return value.html;
        if (typeof value.raw === 'string') return value.raw;
      }
      return escapeHtml(value === undefined ? '' : value);
    }
    const head = columns
      .map(function (column) {
        return '<th' + attr('style', column.width ? 'width:' + column.width : null) + '>' + escapeHtml(column.label || column.key || '') + '</th>';
      })
      .join('');
    const body = rows
      .map(function (row) {
        return (
          '<tr>' +
          columns
            .map(function (column) {
              const value = typeof column.render === 'function' ? column.render(row) : row[column.key];
              const tdCls = [column.align === 'right' ? 'is-numeric' : '', column.key === 'actions' ? 'is-actions' : ''].filter(Boolean).join(' ');
              return '<td' + (tdCls ? ' class="' + tdCls + '"' : '') + '>' + normalizeCell(value) + '</td>';
            })
            .join('') +
          '</tr>'
        );
      })
      .join('');
    return (
      '<div class="ad-table-wrap' + wrapSticky + '">' +
      '<table class="ad-table' + density + sticky + '">' +
      '<thead><tr>' + head + '</tr></thead>' +
      '<tbody>' +
      (body || '<tr><td colspan="' + Math.max(columns.length, 1) + '"><div class="ad-empty-inline">暂无数据</div></td></tr>') +
      '</tbody></table></div>'
    );
  }

  function renderFilterBar(options) {
    const props = options || {};
    const inline = props.inline ? ' ad-filter-bar--inline' : '';
    const chips = (props.chips || [])
      .map(function (chip) {
        const active = chip.active ? ' ad-btn--primary' : '';
        return '<button class="ad-btn' + active + '" type="button">' + escapeHtml(chip.label) + '</button>';
      })
      .join('');
    const controls = (props.controls || [])
      .map(function (control) {
        if (control.type === 'select') return renderSelect(control);
        if (control.type === 'search') {
          return '<input class="ad-input ad-input--search"' + attr('placeholder', control.placeholder || '搜索') + ' />';
        }
        return renderInput(control);
      })
      .join('');
    const actions = (props.actions || []).map(renderButton).join('');
    return (
      '<section class="ad-filter-bar' + inline + '">' +
      (props.chips ? '<div class="ad-filter-bar__group">' + chips + '</div>' : '') +
      controls +
      '<div class="ad-filter-bar__actions">' + actions + '</div>' +
      '</section>'
    );
  }

  function renderFilter(options) {
    return renderFilterBar(options);
  }

  function renderTabBar(options) {
    const tabs = (options && options.tabs) || [];
    const activeId = options && options.activeId;
    return (
      '<nav class="ad-tab-bar">' +
      tabs
        .map(function (tab) {
          const cls = tab.id === activeId ? ' ad-tab is-active' : ' ad-tab';
          return '<button class="' + cls.trim() + '" type="button">' + escapeHtml(tab.label) + '</button>';
        })
        .join('') +
      '</nav>'
    );
  }

  function renderDetailRows(fields) {
    return (fields || [])
      .map(function (field) {
        const val = field.html ? field.html : escapeHtml(field.value === undefined ? '—' : field.value);
        return '<div class="ad-detail-row"><div class="ad-detail-row__k">' + escapeHtml(field.label) + '</div><div>' + val + '</div></div>';
      })
      .join('');
  }

  function renderModal(options) {
    const props = options || {};
    const openCls = props.open !== false ? ' is-open' : '';
    const footer = (props.actions || [])
      .map(renderButton)
      .join('');
    return (
      '<div class="ad-modal-scene' + openCls + '">' +
      '<div class="ad-modal-overlay">' +
      '<div class="ad-modal" role="dialog">' +
      '<div class="ad-modal__header"><div class="ad-modal__title">' + escapeHtml(props.title || '') + '</div></div>' +
      (props.content ? '<div class="ad-modal__body">' + escapeHtml(props.content) + '</div>' : '') +
      (props.bodyHtml ? '<div class="ad-modal__body">' + props.bodyHtml + '</div>' : '') +
      (footer ? '<div class="ad-modal__footer">' + footer + '</div>' : '') +
      '</div></div></div>'
    );
  }

  function renderDrawer(options) {
    const props = options || {};
    const openCls = props.open !== false ? ' is-open' : '';
    const footer = (props.actions || []).map(renderButton).join('');
    const body = props.fields
      ? renderDetailRows(props.fields)
      : props.bodyHtml || (props.content ? escapeHtml(props.content) : '');
    return (
      '<div class="ad-drawer-scene' + openCls + '">' +
      '<div class="ad-drawer-overlay"></div>' +
      '<aside class="ad-drawer">' +
      '<div class="ad-drawer__header">' +
      '<div class="ad-drawer__title">' + escapeHtml(props.title || '') + '</div>' +
      renderButton({ label: '×', variant: 'ghost' }) +
      '</div>' +
      '<div class="ad-drawer__body">' + body + '</div>' +
      (footer ? '<div class="ad-drawer__footer">' + footer + '</div>' : '') +
      '</aside></div>'
    );
  }

  function renderPagination(options) {
    const props = options || {};
    const total = props.total || 0;
    return (
      '<div class="ad-pagination">' +
      '<span>共 ' + escapeHtml(total) + ' 条 · 每页 ' + escapeHtml(props.pageSize || 20) + ' 条</span>' +
      '<div class="ad-pagination__actions">' +
      renderButton({ label: '上一页', disabled: (props.page || 1) <= 1 }) +
      '<span>第 ' + escapeHtml(props.page || 1) + ' / ' + escapeHtml(props.totalPages || 1) + ' 页</span>' +
      renderButton({ label: '下一页', disabled: (props.page || 1) >= (props.totalPages || 1) }) +
      '</div></div>'
    );
  }

  function renderAppShell(options) {
    const props = options || {};
    return (
      '<div class="ad-app">' +
      (props.topNav ? renderTopNav(props.topNav) : '') +
      '<div class="ad-body">' +
      (props.sideNav ? renderSideNav(props.sideNav) : '') +
      '<main class="ad-content"><div class="ad-content__inner">' +
      (props.breadcrumb ? renderBreadcrumb(props.breadcrumb) : '') +
      (props.content || '') +
      '</div></main></div></div>'
    );
  }

  function renderEmptyState(options) {
    const props = options || {};
    return (
      '<div class="ad-state ad-state--empty">' +
      '<div class="ad-state__title">' + escapeHtml(props.title || '暂无数据') + '</div>' +
      (props.description ? '<div class="ad-state__desc">' + escapeHtml(props.description) + '</div>' : '') +
      '</div>'
    );
  }

  function renderLoadingState(options) {
    const props = options || {};
    return (
      '<div class="ad-state ad-state--loading">' +
      '<div class="ad-state__title">' + escapeHtml(props.title || '加载中') + '</div>' +
      (props.description ? '<div class="ad-state__desc">' + escapeHtml(props.description) + '</div>' : '') +
      '</div>'
    );
  }

  function renderErrorState(options) {
    const props = options || {};
    return (
      '<div class="ad-state ad-state--error">' +
      '<div class="ad-state__title">' + escapeHtml(props.title || '加载失败') + '</div>' +
      (props.description ? '<div class="ad-state__desc">' + escapeHtml(props.description) + '</div>' : '') +
      '</div>'
    );
  }

  const registry = {
    TopNav: renderTopNav,
    SideNav: renderSideNav,
    Breadcrumb: renderBreadcrumb,
    PageHeader: renderPageHeader,
    KpiCard: renderKpiCard,
    Table: renderTable,
    FilterBar: renderFilterBar,
    Filter: renderFilter,
    TabBar: renderTabBar,
    StatusBadge: renderStatusBadge,
    Button: renderButton,
    Input: renderInput,
    Select: renderSelect,
    Textarea: renderTextarea,
    Modal: renderModal,
    Drawer: renderDrawer,
    Pagination: renderPagination,
    EmptyState: renderEmptyState,
    LoadingState: renderLoadingState,
    ErrorState: renderErrorState,
    AppShell: renderAppShell
  };

  return {
    escapeHtml: escapeHtml,
    renderTopNav: renderTopNav,
    renderSideNav: renderSideNav,
    renderBreadcrumb: renderBreadcrumb,
    renderPageHeader: renderPageHeader,
    renderKpiCard: renderKpiCard,
    renderTable: renderTable,
    renderFilterBar: renderFilterBar,
    renderFilter: renderFilter,
    renderTabBar: renderTabBar,
    renderDetailRows: renderDetailRows,
    renderStatusBadge: renderStatusBadge,
    renderButton: renderButton,
    renderInput: renderInput,
    renderSelect: renderSelect,
    renderTextarea: renderTextarea,
    renderModal: renderModal,
    renderDrawer: renderDrawer,
    renderPagination: renderPagination,
    renderEmptyState: renderEmptyState,
    renderLoadingState: renderLoadingState,
    renderErrorState: renderErrorState,
    renderAppShell: renderAppShell,
    registry: registry
  };
});
