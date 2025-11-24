import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";
import { Navbar, Footer } from "@/components";
import { notFound } from "next/navigation";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    { slug },
    options
  );

  if (!post) {
    notFound();
  }

  const postImageUrl = post.image
    ? urlFor(post.image)?.width(1200).height(600).url()
    : null;

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <article className="container mt-10 mx-auto max-w-4xl px-4 py-20">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to blog
          </Link>

          {postImageUrl && (
            <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden">
              <Image
                src={postImageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
              />
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <p className="text-gray-600 text-lg">{formattedDate}</p>
          </header>

          <div className="prose prose-lg max-w-none">
            {Array.isArray(post.body) && (
              <PortableText
                value={post.body}
                components={{
                  block: {
                    h1: ({ children }) => (
                      <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-3xl font-bold mt-6 mb-3 text-gray-900">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-2xl font-bold mt-4 mb-2 text-gray-900">
                        {children}
                      </h3>
                    ),
                    normal: ({ children }) => (
                      <p className="mb-4 text-gray-700 leading-relaxed">
                        {children}
                      </p>
                    ),
                  },
                  list: {
                    bullet: ({ children }) => (
                      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
                        {children}
                      </ul>
                    ),
                    number: ({ children }) => (
                      <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">
                        {children}
                      </ol>
                    ),
                  },
                }}
              />
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-gray-600 hover:text-blue-gray-900 font-semibold transition-colors"
            >
              ← Back to all posts
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
