import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/db";

interface BlogPageProps {
  params: {
    id: string;
  };
}

async function getBlogById(id: string) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { 
        id: id
      },
      include: { 
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    return blog;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const blog = await getBlogById(params.id);
  
  if (!blog) {
    notFound();
  }

  const formattedDate = new Intl.DateTimeFormat("sr-RS", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(blog.createdAt));

  // Convert content to paragraphs
  const paragraphs = blog.content.split('\n\n').filter(Boolean);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
          <p className="text-gray-500">
            {formattedDate} | Autor: {blog.author.name}
          </p>
        </div>
        
        <Separator className="my-8" />
        
        <div className="prose prose-emerald lg:prose-lg max-w-none">
          {paragraphs.map((paragraph, index) => {
            // Check if paragraph is a heading with markdown-like format (starts with **)
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              const headingText = paragraph.slice(2, -2);
              return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{headingText}</h2>;
            }
            
            // If paragraph contains bold text (between ** **), convert to HTML
            if (paragraph.includes('**')) {
              const parts = paragraph.split(/(\*\*.*?\*\*)/g);
              return (
                <p key={index} className="mb-4">
                  {parts.map((part, partIndex) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </p>
              );
            }
            
            // Regular paragraph
            return <p key={index} className="mb-4">{paragraph}</p>;
          })}
        </div>
      </div>
    </div>
  );
} 