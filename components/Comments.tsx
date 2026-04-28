"use client";

export default function Comments() {
  return (
    <div className="comments-container">
      <p className="text-gray-600 mb-4">
        评论功能已启用。请在 GitHub 上登录后发表评论。
      </p>
      <div className="border rounded-lg p-4 bg-gray-50">
        <p className="text-sm text-gray-500">
          提示：要使用评论功能，请在 app/posts/[id]/page.tsx 中配置 Giscus 或其他评论系统。
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Giscus 配置步骤：
        </p>
        <ol className="text-sm text-gray-500 mt-2 list-decimal list-inside space-y-1">
          <li>在 GitHub 上启用 Discussions</li>
          <li>访问 https://giscus.app 获取配置</li>
          <li>将生成的脚本添加到此组件中</li>
        </ol>
      </div>
    </div>
  );
}
