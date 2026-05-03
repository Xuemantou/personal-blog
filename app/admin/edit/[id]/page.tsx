import { notFound } from 'next/navigation';
import { getRawPostData, getAllPostIds } from '@/lib/posts';
import EditForm from '../EditForm';

export async function generateStaticParams() {
  const posts = getAllPostIds();
  return posts;
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const post = getRawPostData(id);
    return <EditForm id={post.id} initialTitle={post.title} initialContent={post.content} />;
  } catch {
    notFound();
  }
}
