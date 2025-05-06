import BlogCard from "@/components/blog/BlogCard";
import { prisma } from "@/lib/db";

async function getBlogs() {
  try {
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
    
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Blog</h1>
        <p className="text-xl text-gray-600">
          Edukativni članci o fizici, metodologiji učenja i zanimljivostima iz sveta nauke.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              title={blog.title}
              content={blog.content}
              createdAt={blog.createdAt}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-16">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Nema objavljenih blog postova</h3>
            <p className="text-gray-500">Uskoro ćemo dodati više sadržaja!</p>
          </div>
        )}
      </div>
    </div>
  );
} 