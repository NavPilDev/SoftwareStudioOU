import { client } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Link from "next/link";
import { Navbar, Footer } from "@/components";
import BlogCard from "@/components/blog-card";

const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  image,
  "excerpt": array::join(string::split((pt::text(body)), "")[0..150], "") + "..."
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function BlogPage() {
  const posts = await client.fetch<Array<{
    _id: string;
    title: string;
    slug: { current: string };
    publishedAt: string;
    image?: SanityImageSource;
    excerpt?: string;
  }>>(POSTS_QUERY, {}, options);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest news, insights, and stories from Software Studio OU
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {posts.map((post) => {
                const imageUrl = post.image
                  ? urlFor(post.image)?.width(600).height(400).url()
                  : null;

                return (
                  <BlogCard
                    key={post._id}
                    title={post.title}
                    slug={post.slug.current}
                    publishedAt={post.publishedAt}
                    imageUrl={imageUrl}
                    excerpt={post.excerpt}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

