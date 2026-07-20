# FnDepot - 飞牛 OS 应用仓库

🥰 咸鱼不会写代码，但是咸鱼会用 shell，专注于原生 fpk 的打包，顺便蹭新官方仓库的新旧软件，做条咸鱼<br>
💡 大部分项目都是二改制 + webui，已支持 FnDepot 仓库 x86、arm 双版本<br>
🥰 闲时把大部分项目转成 action 构建，感兴趣的可以参考：<https://github.com/shuangji66/buildbot><br>

以下根据 `fnpack.json` 列出所有已打包应用，方便快速知其貌、显示名与功能简介：

| 包名 | 显示名 | 描述 |
|------|--------|------|
| AniRSS | ANI-RSS | 🥰 基于 RSS 自动追番、订阅、下载、刮削、整理。支持蜜柑 / Mikan / 动漫花园 / Bangumi / TMDB 等多源，自动推送到 qBittorrent / Transmission / Aria2，自带 Web 管理面板。本软件依赖 Java 17 环境，优先调用 java-17-openj9。 |

> 模板 layout 与 [shuangji66/FnDepot](https://github.com/shuangji66/FnDepot) 对齐：
> 每条 app 在仓库根目录有独立子目录，含 `ICON.PNG` / `Preview/` / `README.md`，并在 `fnpack.json` 中维护完整 schema 索引。

## 参与贡献

1. Fork 本仓库
2. 在 `fnpack.json` 中按现有 schema 追加你的 app 索引项
   - `fnpack.json` 顶层只能包含应用对象，不要添加 `_comment` 等字符串型元数据
3. 在仓库根创建对应 app 目录（`<AppName>/`），放入 `ICON.PNG` / `Preview/*.png` / `README.md`
4. 提交 PR

## 协议

fnpack.json 索引与各 app 的资源整理遵循上游项目原有协议。
