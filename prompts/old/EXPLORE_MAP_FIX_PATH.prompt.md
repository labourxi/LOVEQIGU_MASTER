# 修复 explore-map 页面 story-service 模块路径

请修改 `pages/explore-map/index.js` 中导入 story-service 的路径：

原代码：
```javascript
const storyService = require('../../../../services/story/story-service');

改为

const storyService = require('../../../services/story/story-service');


完成修改后，自动重新编译 pages/explore-map/ 页面，并确保页面可以正确渲染，不再报找不到模块错误。


