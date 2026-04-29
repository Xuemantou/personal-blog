"use client";

export default function Comments() {
  return (
    <div>
      <p className="md-body-large mb-4" style={{ color: 'var(--md-on-surface-variant)' }}>
        评论功能已启用。请在 GitHub 上登录后发表评论。
      </p>
      <div
        className="md-surface-dim p-4"
      >
        <p className="md-body-medium" style={{ color: 'var(--md-on-surface-variant)' }}>
          提示：要使用评论功能，请在 app/posts/[id]/page.tsx 中配置 Giscus 或其他评论系统。
        </p>
        <p className="md-body-medium mt-2" style={{ color: 'var(--md-on-surface-variant)' }}>
          Giscus 配置步骤：
        </p>
        <ol className="md-body-medium mt-2 list-decimal list-inside space-y-1" style={{ color: 'var(--md-on-surface-variant)' }}>
          <li>在 GitHub 上启用 Discussions</li>
          <li>访问 https://giscus.app 获取配置</li>
          <li>将生成的脚本添加到此组件中</li>
        </ol>
      </div>
    </div>
  );
}
